import React, { useState } from "react";
import { FiFileText, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { EvaluationCardProps } from "../../interfaces";
import axios from "axios";
import { backendURL, access_token } from "../../utils/constants";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const EvaluationCard: React.FC<EvaluationCardProps> = ({
  id,
  docName,
  date,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const formattedDate = formatDate(date);

  const handleClick = () => {
    navigate(`/evaluation-summary/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const token = access_token();
      await axios.delete(`${backendURL}/api/services/doc-process/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { doc_id: id },
      });

      setShowDeleteModal(false);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Failed to delete evaluation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="bg-gray-100 rounded-lg p-3 mb-3 cursor-pointer hover:bg-gray-200 transition-colors relative group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start">
          <div className="bg-gray-200 p-2 rounded mr-3">
            <FiFileText className="text-gray-600" size={16} />
          </div>
          <div className="w-full">
            <h3 className="font-medium text-xs">Evaluation: {docName}</h3>
            <div className="text-xs text-gray-500 mt-0.5">
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-0.5 w-full pr-1">
              <span>1 document</span>
            </div>
          </div>
        </div>

        {/* Delete icon that appears on hover */}
        <div
          className={`absolute right-2 bottom-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-300 rounded"
            onClick={handleDeleteClick}
            aria-label="Delete evaluation"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        docName={docName}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EvaluationCard;
