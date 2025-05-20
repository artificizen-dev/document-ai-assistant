// Sidebar.tsx
import React, { useState, useEffect } from "react";
import { FiX, FiLoader, FiClock } from "react-icons/fi";
import axios from "axios";
import { useAppContext } from "../../Providers/AppContext";
import { access_token, backendURL } from "../../utils/constants";
import EvaluationCard from "../Evaluation/EvaluationCard";
import { EvaluationListItem, SidebarProps } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

const ProcessingCard: React.FC<{
  id: string;
  name: string;
  startTime: number;
}> = ({ name, startTime }) => {
  const navigate = useNavigate();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeSince = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div
      onClick={() => navigate(ROUTES.evaluate)}
      className="bg-gray-50 border border-gray-200 rounded-md p-3 cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <div className="flex items-center text-xs text-yellow-600 mt-1">
            <FiClock className="mr-1" />
            <span>Processing for {formatTimeSince(startTime)}</span>
          </div>
        </div>
        <FiLoader className="text-yellow-500 animate-spin ml-2" />
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { triggerRefresh, refreshKey, processingDocuments } = useAppContext();
  const [evaluations, setEvaluations] = useState<EvaluationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get processing documents as an array
  const processingDocs = Object.entries(processingDocuments)
    .filter(([_, doc]) => doc.status === "processing")
    .map(([id, doc]) => ({
      id,
      name: doc.name,
      startTime: doc.startTime,
    }));

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error("Failed to fetch evaluations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvaluations();
  }, [refreshKey]);

  const handleDeleteEvaluation = () => {
    triggerRefresh();
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 md:relative absolute z-20 md:h-auto h-full ${
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
        ) : (
          <div className="space-y-3">
            {/* Show processing documents at the top */}
            {processingDocs.length > 0 && (
              <div className="space-y-3 mb-4">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing Documents
                </h3>
                {processingDocs.map((doc) => (
                  <ProcessingCard
                    key={doc.id}
                    id={doc.id}
                    name={doc.name}
                    startTime={doc.startTime}
                  />
                ))}
              </div>
            )}

            {/* Completed evaluations */}
            {evaluations.length > 0 ? (
              <>
                {processingDocs.length > 0 && (
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed Evaluations
                  </h3>
                )}
                {evaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.id}
                    id={evaluation.id}
                    docName={evaluation.doc_name}
                    date={evaluation.created_at}
                    onDelete={handleDeleteEvaluation}
                  />
                ))}
              </>
            ) : processingDocs.length === 0 ? (
              <div className="flex justify-center pt-10">
                <p className="text-gray-500 text-sm">
                  No evaluation history yet
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
