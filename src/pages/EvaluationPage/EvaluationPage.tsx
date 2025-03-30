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
        <FileUpload onFilesSelected={handleFilesSelected} files={files} />
      </div>
    </section>
  );
};

export default EvaluatePage;
