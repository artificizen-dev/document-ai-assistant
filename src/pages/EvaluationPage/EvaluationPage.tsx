import React, { useState } from "react";
import FileUpload from "../../components/Evaluation/FileUpload";

const EvaluatePage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  return (
    <section className="min-h-[85vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-center font-bold mb-2">
            AI Powered Evaluation
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Get expert-level assessment and insights with AI. Evaluate
            structure, content quality, and clarity, and receive actionable
            recommendations for improvement.
          </p>
        </div>

        <FileUpload onFilesSelected={handleFilesSelected} files={files} />
      </div>
    </section>
  );
};

export default EvaluatePage;
