import React, { useState } from "react";
import FileUpload from "../../components/Evaluation/FileUpload";

const EvaluatePage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  console.log(files);

  return (
    <section className="min-h-[85vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl text-center font-bold mb-2">
            Document Evaluation
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Upload documents to get an AI-powered evaluation and analysis. The
            AI will assess structure, content quality, clarity, and provide
            recommendations.
          </p>
        </div>

        <FileUpload onFilesSelected={handleFilesSelected} />
      </div>
    </section>
  );
};

export default EvaluatePage;
