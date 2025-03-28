import React from "react";
import { MdCheckCircle, MdClose } from "react-icons/md";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface UploadFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

interface UploadNotificationProps {
  files: UploadFile[];
  onClose: () => void;
  expanded: boolean;
  toggleExpanded: () => void;
}

const UploadNotification: React.FC<UploadNotificationProps> = ({
  files,
  onClose,
  expanded,
  toggleExpanded,
}) => {
  const completedCount = files.filter(
    (file) => file.status === "complete"
  ).length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between bg-blue-50 px-4 py-3 cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-800">
            {completedCount} {completedCount === 1 ? "upload" : "uploads"}{" "}
            complete
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {expanded ? <FiChevronDown /> : <FiChevronUp />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose />
          </button>
        </div>
      </div>

      {/* File List (shown when expanded) */}
      {expanded && (
        <div className="max-h-64 overflow-y-auto">
          {files.map((file) => (
            <div key={file.id} className="p-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <div className="bg-red-100 text-red-800 uppercase text-xs font-bold p-1 rounded">
                    PDF
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>

                  {file.status === "uploading" && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {file.progress < 60
                          ? `Uploading... ${file.progress}%`
                          : `Processing document... ${file.progress}%`}
                      </p>
                    </>
                  )}

                  {file.status === "error" && (
                    <p className="text-xs text-red-500 mt-1">
                      {file.error || "Upload failed"}
                    </p>
                  )}
                </div>

                {file.status === "complete" && (
                  <MdCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadNotification;
