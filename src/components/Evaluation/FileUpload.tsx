import React, { useState, useRef } from "react";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

interface SelectedFile {
  file: File;
  id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(newFiles.map((f) => f.file));
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
    if (files) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        id: `${file.name}-${Date.now()}`,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected(newFiles.map((f) => f.file));
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((files) => files.filter((file) => file.id !== id));
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
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
          Upload Documents for Evaluation
        </h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          Drag and drop your documents here, or click to browse
        </p>
        <button className="bg-white border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          Browse Files
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Supported formats: PDF, DOC, DOCX, TXT
        </p>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.txt"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">
            Selected Documents ({selectedFiles.length})
          </h4>

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
          onClick={() => navigate("/evaluation-summary")}
          className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900 transition-colors"
        >
          Evaluate Documents
        </button>
      )}
    </div>
  );
};

export default FileUpload;
