import React, { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import axios from "axios";
import { useAppContext } from "../../Providers/AppContext";
import { access_token, backendURL } from "../../utils/constants";
import EvaluationCard from "../Evaluation/EvaluationCard";
import { EvaluationListItem, SidebarProps } from "../../interfaces";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { handleError, refreshKey } = useAppContext();
  const [evaluations, setEvaluations] = useState<EvaluationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!isOpen) return;

      try {
        setIsLoading(true);
        const token = access_token();

        if (!token) {
          return;
        }

        const response = await axios.get(`${backendURL}/api/services/docs/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEvaluations(response.data);
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
        handleError("Failed to load evaluation history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [isOpen, refreshKey]);

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 md:relative absolute md:h-auto h-full ${
        isOpen ? "md:w-70 w-60" : "w-0 overflow-hidden"
      }`}
    >
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
        aria-label="Close sidebar"
      >
        <FiX size={20} />
      </button>

      <div className="flex flex-col h-full p-4 overflow-auto">
        <h2 className="font-medium text-gray-800 mb-4">Evaluation History</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <FiLoader className="animate-spin text-gray-400" size={24} />
          </div>
        ) : evaluations.length > 0 ? (
          <div className="space-y-3">
            {evaluations.map((evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                id={evaluation.id}
                docName={evaluation.doc_name}
                date={evaluation.created_at}
                // score={74}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center pt-10">
            <p className="text-gray-500 text-sm">No evaluation history yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
