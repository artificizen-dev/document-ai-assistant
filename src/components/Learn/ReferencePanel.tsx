import React from "react";
import { FiX } from "react-icons/fi";
import ReferenceItem from "./ReferenceItem";

interface ReferencePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const ReferencePanel: React.FC<ReferencePanelProps> = ({
  isVisible,
  onClose,
}) => {
  // Sample reference data
  const references = [
    {
      id: "ref1",
      title: "Source from Knowledge Base",
      date: "11/03/2025",
      relevance: "high" as const,
    },
    {
      id: "ref2",
      title: "General Reference",
      date: "11/03/2025",
      relevance: "medium" as const,
    },
  ];

  return (
    <aside
      className={`bg-gray-50 border-l border-gray-200 transition-all duration-300 z-10
        md:relative absolute right-0 md:h-auto h-full
        ${isVisible ? "w-72" : "w-0 overflow-hidden"}
      `}
    >
      {/* Close button - visible only on mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-black"
        aria-label="Close reference panel"
      >
        <FiX size={20} />
      </button>

      <div className="p-4">
        <h4 className="font-normal text-sm text-gray-600 mb-3">
          {references.length} references used to generate this response
        </h4>

        {references.map((reference) => (
          <ReferenceItem
            key={reference.id}
            title={reference.title}
            date={reference.date}
            relevance={reference.relevance}
          />
        ))}
      </div>
    </aside>
  );
};

export default ReferencePanel;
