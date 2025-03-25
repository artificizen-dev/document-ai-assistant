import React, { useState, useEffect } from "react";
import { FiFileText, FiDownload } from "react-icons/fi";
import axios from "axios";
import { backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";

interface ExamCopiesTabProps {
  docName: string;
  docLink: string;
  question: string;
  answer: string;
}

const ExamCopiesTab: React.FC<ExamCopiesTabProps> = ({
  docName,
  docLink,
  question,
  answer,
}) => {
  const { handleError } = useAppContext();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  useEffect(() => {
    // If docLink is a full URL, use it directly
    if (
      docLink &&
      (docLink.startsWith("http://") || docLink.startsWith("https://"))
    ) {
      setPdfUrl(docLink);
      setIsLoadingPdf(false);
      return;
    }

    // Otherwise try to fetch it from the backend
    const fetchPdf = async () => {
      try {
        setIsLoadingPdf(true);

        // Extract the filename from docLink
        const filename = docLink.split("/").pop();

        if (!filename) {
          throw new Error("Invalid document link");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        // Fetch the PDF file
        const response = await axios.get(
          `${backendURL}/api/services/docs/download/${filename}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );

        // Create a blob URL for the PDF
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error: any) {
        console.error("Error fetching PDF:", error);
        handleError(
          "Unable to load PDF document. You may need to download it instead."
        );
        // Set a flag in state to indicate PDF loading failed
        setPdfUrl(null);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchPdf();

    // Cleanup function to revoke object URL
    return () => {
      if (pdfUrl && !pdfUrl.startsWith("http")) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [docLink, handleError]);

  // Function to download the PDF
  const handleDownload = async () => {
    if (
      pdfUrl &&
      (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://"))
    ) {
      // If it's a remote URL, fetch it first
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(pdfUrl, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = docName || "document.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        window.open(pdfUrl, "_blank");
      }
    } else if (pdfUrl) {
      // If it's a local blob URL, just download it
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = docName || "document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PDF Document Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 flex justify-between items-center border-b">
          <div className="flex items-center">
            <FiFileText className="mr-2 text-gray-600" />
            <h3 className="font-medium">{docName}</h3>
          </div>
          <button
            onClick={handleDownload}
            className="text-gray-600 hover:text-black"
            title="Download PDF"
          >
            <FiDownload />
          </button>
        </div>
        <div className="h-[600px] relative">
          {isLoadingPdf ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Document PDF"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center p-6">
                <FiFileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500 mb-2">
                  PDF document not available for preview
                </p>
                <button
                  onClick={handleDownload}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Download Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question and Answer Section */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="font-medium">Question and Answer</h3>
        </div>
        <div className="p-4 overflow-y-auto h-[600px]">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
            <p className="bg-gray-50 p-3 rounded-md">{question}</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Answer:</h4>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-md"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCopiesTab;
