import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import axios from "axios";
import { backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { access_token } from "../../utils/constants";
import { FileUploadProps, SelectedFile } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import ProcessingLoader from "./ProcessingLoader";

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, files }) => {
  const navigate = useNavigate();
  const token = access_token();
  const {
    getSessionId,
    triggerRefresh,
    startDocumentProcessing,
    completeDocumentProcessing,
    documentProcessingError,
    processingDocuments,
    fetchCredits,
  } = useAppContext();

  const hasProcessingDocuments = Object.values(processingDocuments).some(
    (doc) => doc.status === "processing"
  );

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState<string>("GS");
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const formattedFiles = files.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));
      setSelectedFiles(formattedFiles);
    } else {
      setSelectedFiles([]);
    }
  }, [files]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );

      if (validFiles.length === 0) {
        return;
      }

      const newFiles = validFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected([...files].filter((f) => validFiles.includes(f)));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );

      if (validFiles.length === 0) {
        return;
      }

      const newFiles = validFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));

      setSelectedFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected([...files].filter((f) => validFiles.includes(f)));
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    // Update the files array sent back to parent
    const remainingFiles = selectedFiles
      .filter((file) => file.id !== id)
      .map((file) => file.file);
    onFilesSelected(remainingFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateQuestion = () => {
    if (!question.trim()) {
      setQuestionError("Question is required");
      return false;
    } else if (question.trim().length < 10) {
      setQuestionError("Question must be at least 10 characters long");
      return false;
    }
    setQuestionError("");
    return true;
  };

  const uploadFile = async (file: SelectedFile) => {
    if (!validateQuestion()) {
      return;
    }

    const processingId = `processing-${file.id}`;

    startDocumentProcessing(processingId, file.file.name);

    try {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("question", question);
      formData.append("category", category);

      let headers: Record<string, string> = {
        "Content-Type": "multipart/form-data",
      };

      if (!token) {
        const sessionId = getSessionId();
        if (!sessionId) {
          throw new Error("Session ID not found. Please refresh the page.");
        }
        formData.append("session_id", sessionId);
      } else {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${backendURL}/api/services/doc-process/`,
        formData,
        {
          headers,
        }
      );

      const documentId = response.data?.id;
      localStorage.setItem("evaluationId", documentId);
      completeDocumentProcessing(processingId, String(documentId));
      setQuestion("");
      triggerRefresh();
      navigate(`/evaluation-summary/${documentId}`);
      setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error: any) {
      console.error("Error uploading document:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload document. Please try again.";
      documentProcessingError(processingId, errorMessage);
    }
  };

  const handleUploadAll = async () => {
    if (!validateQuestion()) {
      return;
    }

    const validFiles = selectedFiles.filter(
      (file) => file.file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // Process files sequentially to ensure consistent state
    for (const file of validFiles) {
      if (file.file.size > 10 * 1024 * 1024) {
        continue;
      }

      await uploadFile(file);
    }

    setIsSubmitting(false);
    triggerRefresh();
    await fetchCredits();
  };

  if (hasProcessingDocuments || isSubmitting) {
    return <ProcessingLoader documents={processingDocuments} />;
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div className="text-center mb-8">
        <h2 className="text-2xl text-center font-bold mb-2">
          AI Powered Evaluation
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Get expert-level assessment and insights with AI. Evaluate structure,
          content quality, and clarity, and receive actionable recommendations
          for improvement.
        </p>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-4 transition-colors ${
          isDragging ? "border-black bg-gray-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <FiUpload className="text-gray-400 w-10 h-10 mb-3" />
        <h3 className="text-base text-center font-medium mb-1">
          Upload Document for Evaluation
        </h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          Drag and drop your PDF documents here, or click to browse
        </p>
        <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Supported format: PDF only (Max 10MB)
        </p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
          multiple
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">
              Selected Documents ({selectedFiles.length})
            </h4>
            <button
              onClick={() => {
                setSelectedFiles([]);
                onFilesSelected([]);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-3"
              >
                <div className="flex items-center">
                  <FiFile className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="GS">General Studies</option>
            <option value="Ethics">Ethics</option>
          </select>
        </div>
      )}

      {/* Question Input */}
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium mb-2">
            Question <span className="text-red-500">*</span>
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (questionError) validateQuestion();
            }}
            placeholder="Enter your question for document evaluation"
            className={`w-full border ${
              questionError ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 text-sm min-h-[100px]`}
          />
          {questionError && (
            <p className="text-red-500 text-xs mt-1">{questionError}</p>
          )}
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUploadAll}
          disabled={isSubmitting}
          className={`w-full bg-black text-white py-3 rounded font-medium transition-colors hover:bg-gray-900 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? "Processing..."
            : selectedFiles.length > 1
            ? `Evaluate ${selectedFiles.length} Documents`
            : "Evaluate Document"}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
