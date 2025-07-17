import React, { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { access_token } from "../../utils/constants";
import { FileUploadProps, SelectedFile } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import ProcessingLoader from "./ProcessingLoader";
import documentImage from "../../assets/document.png";
import { BsFolderCheck } from "react-icons/bs";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const formattedFiles = files.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));
      setSelectedFiles(formattedFiles);

      // Generate preview for the first file
      if (files[0]) {
        generatePreview(files[0]);
      }
    } else {
      setSelectedFiles([]);
      setPreviewUrl(null);
    }
  }, [files]);

  const generatePreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

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

      // Generate preview for the first file if no preview exists
      if (!previewUrl && validFiles[0]) {
        generatePreview(validFiles[0]);
      }

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

      // Generate preview for the first file if no preview exists
      if (!previewUrl && validFiles[0]) {
        generatePreview(validFiles[0]);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
    const remainingFiles = selectedFiles
      .filter((file) => file.id !== id)
      .map((file) => file.file);
    onFilesSelected(remainingFiles);

    // If removing the previewed file, clear preview or set new one
    if (selectedFiles.length === 1) {
      setPreviewUrl(null);
    } else if (remainingFiles.length > 0) {
      generatePreview(remainingFiles[0]);
    }
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

  const handleClearFiles = () => {
    setSelectedFiles([]);
    onFilesSelected([]);
    setPreviewUrl(null);
  };

  if (hasProcessingDocuments || isSubmitting) {
    return <ProcessingLoader documents={processingDocuments} />;
  }

  return (
    <div className="w-full mx-auto px-2 md:px-6 py-2 md:py-2">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-[40px] font-['Grotesque'] font-medium text-[#204336] mb-4">
          AI Powered Evaluation
        </h1>
      </div>

      {/* Two Column Layout - Always Consistent */}
      <div className="grid lg:grid-cols-2 gap-8 p-2 bg-[#F0F0F0] rounded-2xl shadow-2xl">
        {/* Left Column - Upload Area with Document Preview */}
        <div className="space-y-6 md:w-[429px]">
          <div className="border-2 border-dashed border-[#D1D5DB] rounded-2xl p-2 md:p-4 bg-[#F9F9F9] h-full">
            {selectedFiles.length === 0 ? (
              /* No Files - Upload Zone */
              <div
                className={`rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 h-full min-h-[500px] ${
                  isDragging
                    ? "border-[#10B981] bg-green-50"
                    : "bg-[#F1F1F1] hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                {/* Document Illustration */}
                <div className="relative mb-4">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <img src={documentImage} alt="" />
                    </div>
                  </div>
                  {/* Plus Icon */}
                  <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-b from-[#71BBA0] to-[#35765E] rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-['Funnel_Sans'] font-semibold text-[#1F2937] mb-2">
                  Upload Document for Evaluation
                </h3>
                <p className="text-[#6B7280] font-['Funnel_Sans'] text-center mb-6">
                  Drag and drop your PDF documents here, or{" "}
                  <span className="text-[#10B981] font-medium">
                    click to browse
                  </span>
                </p>
                <p className="text-sm text-[#9CA3AF] font-['Funnel_Sans'] mb-8">
                  Supported format: PDF only (Max 10MB)
                </p>

                <button
                  className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl py-3 px-6 text-[#374151] font-['Funnel_Sans'] font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                >
                  <IoCloudUploadOutline className="w-5 h-5" />
                  Browse files
                </button>
              </div>
            ) : (
              /* Files Selected - Success State with Preview */
              <>
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-[42px] h-[42px] bg-gradient-to-b shadow-2xl from-[#B6E588] to-[#35765E] rounded-full flex items-center justify-center">
                    <BsFolderCheck className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-[22px] font-['Funnel_Sans'] font-medium text-[#1F2937] mb-2">
                    Your document <br /> is uploaded!
                  </h3>
                </div>

                {/* Document Preview */}
                <div className="bg-gray-50 rounded-xl md:p-2 mb-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 min-h-[316px] flex items-center justify-center">
                    {previewUrl ? (
                      <embed
                        src={`${previewUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        type="application/pdf"
                        className="w-full h-[300px] rounded"
                        title="Document Preview"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <HiOutlineDocumentText className="w-16 h-16 mx-auto mb-2 text-[#9CA3AF]" />
                        <p className="text-sm font-['Funnel_Sans']">
                          Preview not available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleBrowseClick}
                    className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl py-3 px-4 text-[#374151] font-['Funnel_Sans'] font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Browse files
                  </button>
                  <button
                    onClick={handleClearFiles}
                    className="w-full bg-white border-2 border-[#EF4444] text-[#EF4444] rounded-xl py-3 px-4 font-['Funnel_Sans'] font-medium hover:bg-red-50 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              multiple
            />
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-[#F9F9F9] rounded-2xl p-8 border border-[#E5E7EB]">
          <div
            className={`rounded-2xl p-2 ${
              selectedFiles.length > 0
                ? "bg-[#F8F7F7] border-[1px] border-gray-200"
                : ""
            }`}
          >
            <h3 className="text-lg font-['Funnel_Sans'] font-semibold text-[#1F2937] mb-4">
              {selectedFiles.length > 0
                ? "Selected Documents"
                : "Document Evaluation Form"}
            </h3>

            {/* Selected Files List - Only show if files exist */}
            {selectedFiles.length > 0 && (
              <div className="space-y-3 mb-2">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <HiOutlineDocumentText className="w-5 h-5 text-[#6B7280] mr-3" />
                      <div>
                        <p className="text-sm font-['Funnel_Sans'] font-medium text-[#1F2937] truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs font-['Funnel_Sans'] text-[#9CA3AF]">
                          ({formatFileSize(file.file.size)})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.id);
                      }}
                      className="text-[#6B7280] hover:text-[#EF4444] transition-colors duration-200"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-6 bg-[#F8F7F7] rounded-2xl p-2 border-[1px] border-gray-200 mt-4">
            <label className="block text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-2">
              Select a category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-xl py-3 px-4 text-[#1F2937] font-['Funnel_Sans'] bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent appearance-none"
              >
                <option value="GS">General Studies</option>
                <option value="Ethics">Ethics</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Question Input */}
          <div className="mb-4 bg-[#F8F7F7] rounded-2xl p-2 border-[1px] border-gray-200">
            <label className="block text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-3">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (questionError) validateQuestion();
              }}
              placeholder="Enter your question for document evaluation"
              className={`w-full border ${
                questionError ? "border-red-500" : "border-[#E5E7EB]"
              } rounded-xl bg-white p-4 text-[#1F2937] font-['Funnel_Sans'] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent resize-none`}
            />
            {questionError && (
              <p className="text-red-500 text-sm font-['Funnel_Sans'] mt-2">
                {questionError}
              </p>
            )}
          </div>

          {/* Evaluate Button */}
          <button
            onClick={
              selectedFiles.length > 0 ? handleUploadAll : handleBrowseClick
            }
            disabled={
              isSubmitting || (selectedFiles.length > 0 && !question.trim())
            }
            className={`w-full py-4 px-6 rounded-xl font-['Funnel_Sans'] font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedFiles.length > 0
                ? `bg-[#10B981] text-white ${
                    isSubmitting || !question.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-[#059669]"
                  }`
                : "bg-white border-2 border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
            }`}
          >
            {isSubmitting ? (
              "Processing..."
            ) : selectedFiles.length > 0 ? (
              <>
                Evaluate document
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </>
            ) : (
              <>
                <IoCloudUploadOutline className="w-5 h-5" />
                Upload Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
