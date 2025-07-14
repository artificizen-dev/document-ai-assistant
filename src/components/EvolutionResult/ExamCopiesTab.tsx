import React, { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
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

  const processAnswerHTML = (answer: any) => {
    if (!answer) return "";

    let formattedAnswer = answer;

    // Check if answer already contains HTML (starts with ```html)
    if (formattedAnswer.includes("```html")) {
      // Remove the ```html wrapper
      formattedAnswer = formattedAnswer
        .replace(/```html\n?/g, "")
        .replace(/```\n?$/g, "");

      // Replace font color tags with span classes for better styling
      formattedAnswer = formattedAnswer
        .replace(
          /<font color="red">/g,
          '<span class="text-red-600 font-medium">'
        )
        .replace(/<\/font>/g, "</span>");

      // Add Tailwind classes to existing HTML elements
      formattedAnswer = formattedAnswer
        .replace(/<h1>/g, '<h1 class="text-2xl font-bold text-gray-900 mb-4">')
        .replace(
          /<h2>/g,
          '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">'
        )
        .replace(
          /<h3>/g,
          '<h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">'
        )
        .replace(
          /<h4>/g,
          '<h4 class="text-base font-medium text-gray-700 mt-3 mb-2">'
        )
        .replace(/<p>/g, '<p class="mb-3 text-gray-900">')
        .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-3 space-y-1">')
        .replace(/<li>/g, '<li class="text-gray-900">');

      return formattedAnswer;
    }

    // Handle plain text formatting (existing logic for non-HTML content)
    formattedAnswer = formattedAnswer
      // Replace double line breaks with paragraph breaks
      .replace(/\n\n/g, "</p><p>")
      // Replace single line breaks with <br> tags
      .replace(/\n/g, "<br>")
      // Handle bullet points (①②③④⑤ symbols)
      .replace(/([①②③④⑤])/g, "<strong>$1</strong>")
      // Handle asterisk bullet points
      .replace(/\* /g, "• ")
      // Handle numbered points like "1.", "2.", etc.
      .replace(/^(\d+\.)\s/gm, "<strong>$1</strong> ")
      // Make section headers bold (lines that end with a colon or are standalone)
      .replace(/^([^<\n]+:)$/gm, "<strong>$1</strong>")
      // Handle standalone section titles
      .replace(
        /^(British Economic policies|Negative side|Positive side)$/gm,
        '<h4 class="font-semibold text-gray-800 mt-4 mb-2">$1</h4>'
      )
      // Handle quotes with proper styling
      .replace(/"([^"]+)"/g, '<em>"$1"</em>')
      // Handle examples (e.g. text)
      .replace(/e\.g\./g, "<em>e.g.</em>");

    // Wrap in paragraphs if not already wrapped
    if (!formattedAnswer.includes("<p>") && !formattedAnswer.includes("<h4>")) {
      formattedAnswer = `<p>${formattedAnswer}</p>`;
    } else if (!formattedAnswer.startsWith("<")) {
      formattedAnswer = `<p>${formattedAnswer}`;
    }

    // Ensure proper closing
    if (
      formattedAnswer.startsWith("<p>") &&
      !formattedAnswer.endsWith("</p>")
    ) {
      formattedAnswer += "</p>";
    }

    return formattedAnswer;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PDF Document Section */}
      <div className="border rounded-lg overflow-hidden">
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
        <div className="p-4 overflow-y-auto h-[600px]">
          <div>
            <div
              className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border border-gray-200 [&>p]:mb-3 [&>h4]:text-base [&>strong]:text-gray-900 [&>em]:text-gray-700"
              style={{
                lineHeight: "1.6",
                fontSize: "14px",
              }}
              dangerouslySetInnerHTML={{
                __html: processAnswerHTML(answer),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCopiesTab;
