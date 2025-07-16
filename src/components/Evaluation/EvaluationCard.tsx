import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { EvaluationCardProps } from "../../interfaces";
import axios from "axios";
import { backendURL, access_token } from "../../utils/constants";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import pdfView from "../../assets/pdf.svg";
import { FaChevronRight } from "react-icons/fa";

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
  const currentID = useParams<{ id: string }>().id;
  console.log("Current ID:", currentID);

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
  const isActive = currentID === id.toString();

  return (
    <>
      <div
        className={`rounded-lg p-3 py-4 mb-3 cursor-pointer transition-colors relative group ${
          isActive ? "bg-white/20" : "bg-[#5E5E5E2E]/82 hover:bg-gray-200"
        }`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start">
          <div className="mr-3">
            <img src={pdfView} alt="pdf" className="w-[25px] h-[30px]" />
          </div>
          <div className="w-full flex justify-between items-center">
            <div>
              <h3 className="font-medium text-xs">Evaluation: {docName}</h3>
              <div className="text-xs text-gray-500 mt-0.5">
                <span>{formattedDate}</span>
              </div>
            </div>
            <div>
              <FaChevronRight className="text-[#9c9a9a]" />
            </div>
          </div>
        </div>

        {/* Delete icon that appears on hover */}
        <div
          className={`absolute right-2 bottom-0 transition-opacity duration-200 ${
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
