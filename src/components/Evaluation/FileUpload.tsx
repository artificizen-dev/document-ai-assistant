import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { access_token } from "../../utils/constants";
import { FileUploadProps, SelectedFile } from "../../interfaces";

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, files }) => {
  const navigate = useNavigate();
  const token = access_token();
  const { handleSuccess, handleError, setLoading, triggerRefresh } =
    useAppContext();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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
        handleError("Only PDF files are supported");
        return;
      }
      const file = validFiles[0];
      const newFile = {
        file,
        id: `${file.name}-${Date.now()}`,
      };
      setSelectedFiles([newFile]);
      onFilesSelected([newFile.file]);
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
      const file = Array.from(files).find(
        (file) => file.type === "application/pdf"
      );

      if (!file) {
        handleError("Only PDF files are supported");
        return;
      }

      const newFile = {
        file,
        id: `${file.name}-${Date.now()}`,
      };
      setSelectedFiles([newFile]);
      onFilesSelected([newFile.file]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles([]);
    console.log(id);
    onFilesSelected([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleEvaluateDocument = async () => {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFiles[0].file);

      if (!access_token) {
        handleError("Authentication required");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${backendURL}/api/services/doc-process/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Document evaluation response:", response.data);
      handleSuccess("Document uploaded successfully for evaluation");

      if (response.data.id) {
        localStorage.setItem("evaluationId", response.data.id);
      }
      let evaluationID = response.data?.id;

      navigate(`/evaluation-summary/${evaluationID}`);
      triggerRefresh();
    } catch (error: any) {
      console.error("Error evaluating document:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to process document. Please try again.";
      handleError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
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
          Drag and drop your PDF document here, or click to browse
        </p>
        <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-2">Supported format: PDF only</p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,application/pdf"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Selected Document</h4>

          <div className="space-y-2">
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

      {/* Evaluate Button */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleEvaluateDocument}
          disabled={isSubmitting}
          className={`w-full bg-black text-white py-3 rounded font-medium transition-colors ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
          }`}
        >
          {isSubmitting ? "Processing..." : "Evaluate Document"}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
