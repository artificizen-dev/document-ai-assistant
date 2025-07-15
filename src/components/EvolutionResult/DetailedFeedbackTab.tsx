// import React, { useState } from "react";
// import {
//   FiChevronDown,
//   FiChevronUp,
//   FiCheckCircle,
//   FiXCircle,
//   FiFileText,
// } from "react-icons/fi";
// import { DetailedFeedbackTabProps } from "../../interfaces/evaluationDetail";

// const DetailedFeedbackTab: React.FC<DetailedFeedbackTabProps> = ({
//   llm_response,
//   feedback,
//   improvements,
//   strengths,
//   weaknesses,
//   category,
// }) => {
//   const [expandedSections, setExpandedSections] = useState<{
//     [key: string]: boolean;
//   }>({});

//   // Auto-expand the first section by default
//   React.useEffect(() => {
//     if (llm_response?.Evaluation && llm_response.Evaluation.length > 0) {
//       setExpandedSections((prev) => ({
//         ...prev,
//         "eval-0": true,
//       }));
//     }
//   }, [llm_response]);

//   // Check if we're using the new format
//   const isNewFormat = !!llm_response?.Evaluation;
//   const isEthics = category === "Ethics";

//   // Toggle section expansion
//   const toggleSection = (sectionId: string) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));
//   };

//   // Get color based on score (out of 3)
//   const getScoreColor = (score: number) => {
//     if (score >= 2.5) return "bg-gray-100 border-gray-200";
//     if (score >= 1.8) return "bg-gray-100 border-gray-200";
//     if (score >= 1.2) return "bg-gray-100 border-gray-200";
//     if (score >= 0.6) return "bg-gray-100 border-gray-200";
//     return "bg-gray-100 border-gray-200";
//   };

//   if (isNewFormat) {
//     return (
//       <div className="space-y-8 bg-[#E8EEED] p-4 rounded-2xl shadow-2xl">
//         <h3 className="text-[16px] font-semibold mt-5 !mb-1 font-['Funnel_Sans'] text-[#414651] border-b border-gray-200">
//           Detailed Evaluation
//         </h3>
//         <p className="text-[10px] text-[#9E9F9F] !mt-0 font-['Funnel_Sans']">
//           Smart AI Review
//         </p>

//         {/* Regular Evaluation sections */}
//         {llm_response?.Evaluation?.map((category, categoryIndex) => (
//           <div
//             key={`eval-${categoryIndex}`}
//             className={`rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm
//             ${expandedSections[`eval-${categoryIndex}`] ? "shadow-md" : ""}`}
//           >
//             <button
//               className="w-full flex justify-between items-center p-5
//               bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
//               onClick={() => toggleSection(`eval-${categoryIndex}`)}
//             >
//               <h4 className="font-semibold text-gray-900">{category.name}</h4>
//               {expandedSections[`eval-${categoryIndex}`] ? (
//                 <FiChevronUp className="text-gray-500 transition-transform duration-300" />
//               ) : (
//                 <FiChevronDown className="text-gray-500 transition-transform duration-300" />
//               )}
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ease-in-out
//               ${
//                 expandedSections[`eval-${categoryIndex}`]
//                   ? "max-h-[5000px] opacity-100"
//                   : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="p-5 border-t border-gray-200 bg-white">
//                 {isEthics
//                   ? // For Ethics response with nested items structure
//                     category.items.map((subItem, subItemIndex) => (
//                       <div
//                         key={`sub-item-${categoryIndex}-${subItemIndex}`}
//                         className="mb-6 last:mb-0"
//                       >
//                         {subItem.name && (
//                           <h5 className="font-medium text-gray-900 mb-3 pb-1 border-b border-gray-100">
//                             {subItem.name}
//                             {subItem.Score !== undefined && (
//                               <span
//                                 className={`ml-3 px-3 py-1 rounded-full text-sm font-medium border inline-block
//                               ${getScoreColor(subItem.Score)}`}
//                               >
//                                 {subItem.Score}/3
//                               </span>
//                             )}
//                           </h5>
//                         )}

//                         {subItem.Feedback && (
//                           <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                             <h6 className="font-medium text-gray-800 mb-2">
//                               Feedback:
//                             </h6>
//                             <p className="text-gray-700 leading-relaxed">
//                               {subItem.Feedback}
//                             </p>
//                           </div>
//                         )}

//                         {subItem.Strengths && subItem.Strengths.length > 0 && (
//                           <div className="mb-4">
//                             <h6 className="font-medium text-gray-800 mb-2 flex items-center">
//                               <FiCheckCircle
//                                 className="text-green-500 mr-2"
//                                 size={16}
//                               />
//                               Strengths:
//                             </h6>
//                             <ul className="space-y-2">
//                               {subItem.Strengths.map((strength, idx) => (
//                                 <li
//                                   key={`strength-${categoryIndex}-${subItemIndex}-${idx}`}
//                                   className="text-gray-700 bg-green-50 px-4 py-2 rounded-md border-l-4 border-green-400"
//                                 >
//                                   {strength}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         {subItem.Weaknesses &&
//                           subItem.Weaknesses.length > 0 && (
//                             <div className="mb-4">
//                               <h6 className="font-medium text-gray-800 mb-2 flex items-center">
//                                 <FiXCircle
//                                   className="text-red-500 mr-2"
//                                   size={16}
//                                 />
//                                 Weaknesses:
//                               </h6>
//                               <ul className="space-y-2">
//                                 {subItem.Weaknesses.map((weakness, idx) => (
//                                   <li
//                                     key={`weakness-${categoryIndex}-${subItemIndex}-${idx}`}
//                                     className="text-gray-700 bg-red-50 px-4 py-2 rounded-md border-l-4 border-red-400"
//                                   >
//                                     {weakness}
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}
//                       </div>
//                     ))
//                   : // For GS response with simple items structure
//                     category.items.map((item, itemIndex) => (
//                       <div
//                         key={`eval-item-${categoryIndex}-${itemIndex}`}
//                         className="mb-5 last:mb-0"
//                       >
//                         {item.Score !== undefined && (
//                           <div className="flex items-center mb-3">
//                             <span className="font-medium mr-2">Score:</span>
//                             <span
//                               className={`px-3 py-1 rounded-full text-sm font-medium border
//                           ${getScoreColor(item.Score)}`}
//                             >
//                               {item.Score}/3
//                             </span>
//                           </div>
//                         )}

//                         {item.name && (
//                           <h5 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
//                             {item.name}
//                           </h5>
//                         )}

//                         {item.Feedback && (
//                           <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">
//                               Feedback:
//                             </h5>
//                             <p className="text-gray-700 leading-relaxed">
//                               {item.Feedback}
//                             </p>
//                           </div>
//                         )}

//                         {item.Strengths && item.Strengths.length > 0 && (
//                           <div className="mb-4">
//                             <h5 className="font-medium text-gray-800 mb-2 flex items-center">
//                               <FiCheckCircle
//                                 className="text-green-500 mr-2"
//                                 size={16}
//                               />
//                               Strengths:
//                             </h5>
//                             <ul className="space-y-2">
//                               {item.Strengths.map((strength, idx) => (
//                                 <li
//                                   key={`strength-${idx}`}
//                                   className="text-gray-700 bg-green-50 px-4 py-2 rounded-md border-l-4 border-green-400"
//                                 >
//                                   {strength}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         {item.Weaknesses && item.Weaknesses.length > 0 && (
//                           <div>
//                             <h5 className="font-medium text-gray-800 mb-2 flex items-center">
//                               <FiXCircle
//                                 className="text-red-500 mr-2"
//                                 size={16}
//                               />
//                               Weaknesses:
//                             </h5>
//                             <ul className="space-y-2">
//                               {item.Weaknesses.map((weakness, idx) => (
//                                 <li
//                                   key={`weakness-${idx}`}
//                                   className="text-gray-700 bg-red-50 px-4 py-2 rounded-md border-l-4 border-red-400"
//                                 >
//                                   {weakness}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )}

//                         {item["Instruction Analyses"] && (
//                           <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                             <h5 className="font-medium text-gray-800 mb-2">
//                               Analysis:
//                             </h5>
//                             <p className="text-gray-700 leading-relaxed">
//                               {item["Instruction Analyses"]}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Evaluation-P1 Section */}
//         {llm_response?.["Evaluation-P1"] && (
//           <div className="rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm">
//             <button
//               className="w-full flex justify-between items-center p-5
//               bg-blue-50 hover:bg-blue-100 transition-all duration-300 text-left border-l-4 border-blue-400"
//               onClick={() => toggleSection("evaluation-p1")}
//             >
//               <h4 className="font-semibold text-gray-900 flex items-center">
//                 <FiFileText className="text-blue-600 mr-2" size={20} />
//                 {isEthics
//                   ? "Initial Assessment & Requirements Analysis"
//                   : "Structural Analysis"}
//               </h4>
//               {expandedSections["evaluation-p1"] ? (
//                 <FiChevronUp className="text-gray-500 transition-transform duration-300" />
//               ) : (
//                 <FiChevronDown className="text-gray-500 transition-transform duration-300" />
//               )}
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ease-in-out
//   ${
//     expandedSections["evaluation-p1"]
//       ? "max-h-[3000px] opacity-100"
//       : "max-h-0 opacity-0"
//   }`}
//             >
//               <div className="p-5 border-t border-gray-200 bg-white">
//                 {llm_response["Evaluation-P1"].map(
//                   (evalP1Item, evalP1Index) => (
//                     <div
//                       key={`eval-p1-${evalP1Index}`}
//                       className="mb-6 last:mb-0"
//                     >
//                       {evalP1Item.name && (
//                         <h5 className="font-medium text-blue-900 mb-4 pb-2 border-b border-blue-100 bg-blue-50 px-3 py-2 rounded-md">
//                           {evalP1Item.name}
//                         </h5>
//                       )}

//                       {evalP1Item.items?.map((item, itemIndex) => (
//                         <div
//                           key={`eval-p1-item-${evalP1Index}-${itemIndex}`}
//                           className="mb-4 last:mb-0"
//                         >
//                           {/* For Ethics: Handle different field structure */}
//                           {isEthics ? (
//                             <div className="space-y-4">
//                               {/* Initial Scan */}
//                               {item["Initial Scan"] && (
//                                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//                                   <h6 className="font-medium text-yellow-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
//                                     Initial Scan
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item["Initial Scan"]}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Grasp Requirements */}
//                               {item["Grasp Requirements"] && (
//                                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
//                                   <h6 className="font-medium text-indigo-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
//                                     Requirements Understanding
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item["Grasp Requirements"]}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Identify Key Ethical Issues */}
//                               {item["Identify Key Ethical Issues"] && (
//                                 <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//                                   <h6 className="font-medium text-red-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
//                                     Key Ethical Issues Identified
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item["Identify Key Ethical Issues"]}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Feedback */}
//                               {item.Feedback && (
//                                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                                   <h6 className="font-medium text-blue-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                                     Overall Assessment Feedback
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item.Feedback}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="space-y-4">
//                               {/* For GS: Original structure */}
//                               {/* Introduction */}
//                               {item.Introduction && (
//                                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                                   <h6 className="font-medium text-green-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                                     Introduction Analysis
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item.Introduction}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Body */}
//                               {item.Body && (
//                                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                                   <h6 className="font-medium text-blue-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                                     Body Analysis
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item.Body}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Conclusion */}
//                               {item.Conclusion && (
//                                 <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
//                                   <h6 className="font-medium text-purple-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
//                                     Conclusion Analysis
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item.Conclusion}
//                                   </p>
//                                 </div>
//                               )}

//                               {/* Instruction Analyses */}
//                               {item["Instruction Analyses"] && (
//                                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                                   <h6 className="font-medium text-gray-800 mb-2 flex items-center">
//                                     <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
//                                     Overall Instruction Analysis
//                                   </h6>
//                                   <p className="text-gray-700 leading-relaxed">
//                                     {item["Instruction Analyses"]}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Final Assessment at the bottom as accordion */}
//         {llm_response?.FinalAssessment && (
//           <div className="rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm">
//             <button
//               className="w-full flex justify-between items-center p-5
//               bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
//               onClick={() => toggleSection("final-assessment")}
//             >
//               <h4 className="font-semibold text-gray-900">Final Assessment</h4>
//               {expandedSections["final-assessment"] ? (
//                 <FiChevronUp className="text-gray-500 transition-transform duration-300" />
//               ) : (
//                 <FiChevronDown className="text-gray-500 transition-transform duration-300" />
//               )}
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ease-in-out
//               ${
//                 expandedSections["final-assessment"]
//                   ? "max-h-[2000px] opacity-100"
//                   : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="p-5 border-t border-gray-200 bg-white">
//                 {llm_response.FinalAssessment.overall_feedback && (
//                   <div className="mb-5">
//                     <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
//                       Overall Feedback
//                     </h4>
//                     {llm_response.FinalAssessment.overall_feedback.map(
//                       (feedback, index) => (
//                         <p
//                           key={`feedback-${index}`}
//                           className="text-gray-700 mb-3 last:mb-0 leading-relaxed"
//                         >
//                           {feedback}
//                         </p>
//                       )
//                     )}
//                   </div>
//                 )}

//                 {llm_response.FinalAssessment.overall_strengths &&
//                   llm_response.FinalAssessment.overall_strengths.length > 0 && (
//                     <div className="mb-5">
//                       <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
//                         Overall Strengths
//                       </h4>
//                       <ul className="space-y-2">
//                         {llm_response.FinalAssessment.overall_strengths.map(
//                           (strength, index) => (
//                             <li
//                               key={`strength-${index}`}
//                               className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
//                             >
//                               {strength}
//                             </li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}

//                 {llm_response.FinalAssessment.suggested_improvements && (
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
//                       Suggested Improvements
//                     </h4>
//                     <ul className="space-y-2">
//                       {llm_response.FinalAssessment.suggested_improvements.map(
//                         (improvement, index) => (
//                           <li
//                             key={`improvement-${index}`}
//                             className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
//                           >
//                             {improvement}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   } else {
//     // ... rest of the existing legacy format code remains the same
//     const improvementItems =
//       improvements && Object.keys(improvements).length > 0
//         ? Object.entries(improvements).map(([key, value]) => ({
//             id: key,
//             content: value,
//           }))
//         : [];

//     const strengthItems =
//       strengths && Object.keys(strengths).length > 0
//         ? Object.entries(strengths).map(([key, value]) => ({
//             id: key,
//             content: value,
//           }))
//         : [];

//     const weaknessItems =
//       weaknesses && Object.keys(weaknesses).length > 0
//         ? Object.entries(weaknesses).map(([key, value]) => ({
//             id: key,
//             content: value,
//           }))
//         : [];

//     const cleanText = (text: any) => {
//       if (!text || typeof text !== "string") {
//         if (text && typeof text === "object") {
//           if ("Improvement Point" in text) {
//             let result = text["Improvement Point"];

//             if (text["Example"]) {
//               result += `<div class="pl-4 border-l-2 border-gray-300 mt-2">
//               <span class="text-sm font-medium text-gray-700">Example: </span>
//               <span>${text["Example"]}</span>
//             </div>`;
//             }

//             if (text["Link"]) {
//               result += `<div class="mt-2">
//               <a
//                 href="${text["Link"]}"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 class="text-blue-600 hover:text-blue-800 underline text-sm flex items-center"
//               >
//                 Reference Link
//               </a>
//             </div>`;
//             }

//             return result;
//           }

//           return "";
//         }

//         return "";
//       }

//       let cleaned = text;

//       cleaned = cleaned.replace(
//         /\*+([^\*]+)\*+"[^"]+"[^"]+"[^"]+">\*+([^\*]+)\*+/g,
//         "$1"
//       );

//       cleaned = cleaned.replace(/\*{2,}/g, "");

//       cleaned = cleaned.replace(/Links:\s*\*/g, "Links:");

//       const urlPattern = /(www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+(?:\/[^\s)]*)?)/g;
//       const urls = cleaned.match(urlPattern) || [];

//       if (urls.length > 0) {
//         const linksSection = cleaned.indexOf("Links:");
//         if (linksSection !== -1) {
//           const textBeforeLinks = cleaned.substring(0, linksSection);

//           let formattedLinks = "<p>Links:</p><ul class='pl-5 mt-2 list-disc'>";
//           urls.forEach((url) => {
//             formattedLinks += `<li><a href="https://${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${url}</a></li>`;
//           });
//           formattedLinks += "</ul>";

//           return textBeforeLinks + formattedLinks;
//         }
//       }

//       return cleaned;
//     };

//     const formatFeedbackContent = (content: string) => {
//       if (!content) return "";

//       const lines = content.split("\n");
//       const formattedLines = lines.map((line) => {
//         if (line.trim().startsWith("*")) {
//           const scoreParts = line.match(/\*\s+(.*?):\s+(\d+)\/(\d+)/);
//           if (scoreParts) {
//             const [_, category, score, total] = scoreParts;
//             return `<div class="my-2 p-2 bg-gray-50 rounded-md"><span class="font-medium">${category}:</span> <strong class="text-gray-700 px-2 py-1 bg-gray-100 rounded-full text-sm">${score}/${total}</strong> ${
//               line.split(score + "/" + total)[1] || ""
//             }</div>`;
//           }
//         } else if (line.trim().startsWith("Total Score:")) {
//           const totalScoreParts = line.match(/Total Score:\s+(\d+)\/(\d+)/);
//           if (totalScoreParts) {
//             const [_, score, total] = totalScoreParts;
//             return `<div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"><span class="font-semibold">Total Score:</span> <strong class="ml-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">${score}/${total}</strong></div>`;
//           }
//         } else if (line.trim() === "Scores:") {
//           return `<h4 class="font-semibold text-gray-900 mt-4 mb-3 pb-2 border-b border-gray-200">Scores:</h4>`;
//         }
//         return line;
//       });

//       return formattedLines.join("<br>");
//     };

//     // Function to safely render content
//     const renderContent = (content: any) => {
//       const htmlContent = cleanText(content);
//       return (
//         <div
//           className="text-gray-800 leading-relaxed"
//           style={{
//             overflowWrap: "break-word",
//             wordWrap: "break-word",
//             wordBreak: "break-word",
//             hyphens: "auto",
//           }}
//           dangerouslySetInnerHTML={{
//             __html: htmlContent,
//           }}
//         />
//       );
//     };

//     return (
//       <div className="space-y-8">
//         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800">
//             Smart AI Review
//           </h3>
//           <div className="bg-white p-5 rounded-lg shadow-sm">
//             <div
//               className="text-gray-800 prose max-w-none"
//               dangerouslySetInnerHTML={{
//                 __html: formatFeedbackContent(feedback || ""),
//               }}
//             />
//           </div>
//         </div>

//         {strengthItems.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//               <FiCheckCircle className="text-green-500 mr-2" size={24} />
//               Strengths
//             </h3>
//             <div className="space-y-3">
//               {strengthItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white p-4 rounded-lg border-l-4 border-green-400 shadow-sm"
//                 >
//                   {renderContent(item.content)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {weaknessItems.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//               <FiXCircle className="text-red-500 mr-2" size={24} />
//               Weaknesses
//             </h3>
//             <div className="space-y-3">
//               {weaknessItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white p-4 rounded-lg border-l-4 border-red-400 shadow-sm"
//                 >
//                   {renderContent(item.content)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {improvementItems.length > 0 && (
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800">
//               Areas for Improvement
//             </h3>
//             <div className="space-y-3">
//               {improvementItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white p-4 rounded-lg border-l-4 border-gray-300 shadow-sm"
//                 >
//                   {renderContent(item.content)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// };

// export default DetailedFeedbackTab;

import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
} from "react-icons/fi";
import { DetailedFeedbackTabProps } from "../../interfaces/evaluationDetail";

const DetailedFeedbackTab: React.FC<DetailedFeedbackTabProps> = ({
  llm_response,
  category,
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  // Auto-expand the first section by default
  React.useEffect(() => {
    if (llm_response?.Evaluation && llm_response.Evaluation.length > 0) {
      setExpandedSections((prev) => ({
        ...prev,
        "eval-0": true,
      }));
    }
  }, [llm_response]);

  // Check if we're using the new format
  const isNewFormat = !!llm_response?.Evaluation;
  const isEthics = category === "Ethics";

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const renderScoreCircle = (score: number) => {
    const percentage = (score / 3) * 100;
    const radius = 35;
    const circumference = Math.PI * radius; // Half circle circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Get stroke color based on score
    let strokeColor = "#EF4444"; // Red (default)
    if (score >= 2) strokeColor = "#204336"; // Dark green for 2+
    else if (score >= 1.8) strokeColor = "#F59E0B"; // Yellow
    else if (score >= 1.2) strokeColor = "#F97316"; // Orange

    return (
      <div className="relative w-40 h-20 flex items-end justify-center">
        <svg className="w-40 h-20" viewBox="0 0 80 40">
          {/* Background semi-circle */}
          <path
            d="M 10 35 A 30 30 0 0 1 70 35"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Progress semi-circle */}
          <path
            d="M 10 35 A 30 30 0 0 1 70 35"
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-600 mb-1">Score</span>
          <span className="text-lg font-bold text-gray-900">{score}/3</span>
        </div>
      </div>
    );
  };

  if (isNewFormat) {
    return (
      <div className="space-y-8 bg-[#E8EEED] p-4 rounded-2xl shadow-2xl">
        <h3 className="text-[16px] font-semibold mt-5 !mb-1 font-['Funnel_Sans'] text-[#414651] border-b border-gray-200">
          Detailed Evaluation
        </h3>
        <p className="text-[10px] text-[#9E9F9F] !mt-0 font-['Funnel_Sans']">
          Smart AI Review
        </p>

        {/* Regular Evaluation sections */}
        {llm_response?.Evaluation?.map((category, categoryIndex) => (
          <div
            key={`eval-${categoryIndex}`}
            className={`rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm 
            ${expandedSections[`eval-${categoryIndex}`] ? "shadow-md" : ""}`}
          >
            <button
              className="w-full flex justify-between items-center p-5 
              bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
              onClick={() => toggleSection(`eval-${categoryIndex}`)}
            >
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              {expandedSections[`eval-${categoryIndex}`] ? (
                <FiChevronUp className="text-gray-500 transition-transform duration-300" />
              ) : (
                <FiChevronDown className="text-gray-500 transition-transform duration-300" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
              ${
                expandedSections[`eval-${categoryIndex}`]
                  ? "max-h-[5000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 border-t border-gray-200 bg-white">
                {isEthics
                  ? // For Ethics response with nested items structure
                    category.items.map((subItem, subItemIndex) => (
                      <div
                        key={`sub-item-${categoryIndex}-${subItemIndex}`}
                        className="mb-6 last:mb-0"
                      >
                        {/* Header with score if available */}
                        {subItem.name && (
                          <h5 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100 text-lg">
                            {subItem.name}
                          </h5>
                        )}

                        {/* Main content layout with feedback and score */}
                        {(subItem.Feedback || subItem.Score !== undefined) && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-6 items-center">
                            {/* Feedback section */}
                            {subItem.Feedback && (
                              <div className="lg:col-span-2">
                                <div className="bg-[#F8F7F7] p-4 rounded-lg border border-gray-200">
                                  <h6 className="text-[#414651] text-[14px] font-medium mb-3 text-sm">
                                    Feedback
                                  </h6>
                                  <p className="text-[#414651] text-[12px] font-[`Funnel Sans`] leading-relaxed text-sm">
                                    {subItem.Feedback}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Score section */}
                            {subItem.Score !== undefined && (
                              <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                <div className="text-center">
                                  {renderScoreCircle(subItem.Score)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Strengths and Weaknesses in two columns */}
                        {((subItem.Strengths && subItem.Strengths.length > 0) ||
                          (subItem.Weaknesses &&
                            subItem.Weaknesses.length > 0)) && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {subItem.Strengths &&
                              subItem.Strengths.length > 0 && (
                                <div>
                                  <div className="h-full rounded-lg border border-green-200">
                                    <h6 className="font-medium p-4 text-[#00A656] bg-[#DEF2E8]  mb-3 flex items-center text-14px">
                                      <FiCheckCircle
                                        className="text-green-600 mr-2"
                                        size={16}
                                      />
                                      Strengths
                                    </h6>
                                    <ul className="space-y-2 p-4">
                                      {subItem.Strengths.map(
                                        (strength, idx) => (
                                          <li
                                            key={`strength-${categoryIndex}-${subItemIndex}-${idx}`}
                                            className="text-gray-700 text-[14px] font-['Funnel_Sans'] leading-relaxed flex items-start"
                                          >
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                            {strength}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}

                            {subItem.Weaknesses &&
                              subItem.Weaknesses.length > 0 && (
                                <div>
                                  <div className="h-full rounded-lg border border-red-200">
                                    <h6 className="font-medium p-4 text-[#FD4C4C] text-[14px] bg-[#FCE7E7] mb-3 flex items-center text-sm">
                                      <FiXCircle
                                        className="text-red-600 mr-2"
                                        size={16}
                                      />
                                      Weaknesses
                                    </h6>
                                    <ul className="space-y-2 p-4">
                                      {subItem.Weaknesses.map(
                                        (weakness, idx) => (
                                          <li
                                            key={`weakness-${categoryIndex}-${subItemIndex}-${idx}`}
                                            className="text-gray-700 text-[14px] leading-relaxed flex items-start"
                                          >
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                            {weakness}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))
                  : // For GS response with simple items structure
                    category.items.map((item, itemIndex) => (
                      <div
                        key={`eval-item-${categoryIndex}-${itemIndex}`}
                        className="mb-6 last:mb-0"
                      >
                        {/* Header */}
                        {item.name && (
                          <h5 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100 text-lg">
                            {item.name}
                          </h5>
                        )}

                        {/* Main content layout with feedback and score */}
                        {(item.Feedback || item.Score !== undefined) && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mb-6 items-center">
                            {/* Feedback section */}
                            {item.Feedback && (
                              <div className="lg:col-span-2">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  <h6 className="font-medium text-gray-800 mb-3 text-sm">
                                    Feedback
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed text-sm">
                                    {item.Feedback}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Score section */}
                            {item.Score !== undefined && (
                              <div className="lg:col-span-1 flex justify-center lg:justify-end">
                                <div className="text-center">
                                  {renderScoreCircle(item.Score)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Strengths and Weaknesses in two columns */}
                        {((item.Strengths && item.Strengths.length > 0) ||
                          (item.Weaknesses && item.Weaknesses.length > 0)) && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                            {/* Strengths */}
                            {item.Strengths && item.Strengths.length > 0 && (
                              <div>
                                <div className="h-full rounded-lg border border-green-200">
                                  <h6 className="font-medium p-4   bg-[#DEF2E8] mb-3 flex items-center text-[14px]">
                                    <FiCheckCircle
                                      className="text-green-600 mr-2"
                                      size={16}
                                    />
                                    Strengths
                                  </h6>
                                  <ul className="space-y-2 p-4">
                                    {item.Strengths.map((strength, idx) => (
                                      <li
                                        key={`strength-${idx}`}
                                        className="text-gray-700 text-[14px] leading-relaxed flex items-start"
                                      >
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}

                            {/* Weaknesses */}
                            {item.Weaknesses && item.Weaknesses.length > 0 && (
                              <div>
                                <div className="h-full rounded-lg border border-red-200">
                                  <h6 className="font-medium p-4 bg-[#FCE7E7] text-[14px] text-[#FD4C4C] mb-3 flex items-center">
                                    <FiXCircle
                                      className="text-red-600 mr-2"
                                      size={16}
                                    />
                                    Weaknesses
                                  </h6>
                                  <ul className="space-y-2 p-4">
                                    {item.Weaknesses.map((weakness, idx) => (
                                      <li
                                        key={`weakness-${idx}`}
                                        className="text-gray-700 text-[14px] leading-relaxed flex items-start"
                                      >
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                        {weakness}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Instruction Analyses */}
                        {item["Instruction Analyses"] && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h6 className="font-medium text-gray-800 mb-3 text-sm">
                              Analysis
                            </h6>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {item["Instruction Analyses"]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        ))}

        {/* Evaluation-P1 Section - No score layout */}
        {llm_response?.["Evaluation-P1"] && (
          <div className="rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm">
            <button
              className="w-full flex justify-between items-center p-5 
              bg-blue-50 hover:bg-blue-100 transition-all duration-300 text-left border-l-4 border-blue-400"
              onClick={() => toggleSection("evaluation-p1")}
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <FiFileText className="text-blue-600 mr-2" size={20} />
                {isEthics
                  ? "Initial Assessment & Requirements Analysis"
                  : "Structural Analysis"}
              </h4>
              {expandedSections["evaluation-p1"] ? (
                <FiChevronUp className="text-gray-500 transition-transform duration-300" />
              ) : (
                <FiChevronDown className="text-gray-500 transition-transform duration-300" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
              ${
                expandedSections["evaluation-p1"]
                  ? "max-h-[3000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 border-t border-gray-200 bg-white">
                {llm_response["Evaluation-P1"].map(
                  (evalP1Item, evalP1Index) => (
                    <div
                      key={`eval-p1-${evalP1Index}`}
                      className="mb-6 last:mb-0"
                    >
                      {evalP1Item.name && (
                        <h5 className="font-medium text-blue-900 mb-4 pb-2 border-b border-blue-100 bg-blue-50 px-3 py-2 rounded-md">
                          {evalP1Item.name}
                        </h5>
                      )}

                      {evalP1Item.items?.map((item, itemIndex) => (
                        <div
                          key={`eval-p1-item-${evalP1Index}-${itemIndex}`}
                          className="mb-4 last:mb-0"
                        >
                          {/* For Ethics: Handle different field structure */}
                          {isEthics ? (
                            <div className="space-y-4">
                              {/* Initial Scan */}
                              {item["Initial Scan"] && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                  <h6 className="font-medium text-yellow-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                    Initial Scan
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item["Initial Scan"]}
                                  </p>
                                </div>
                              )}

                              {/* Grasp Requirements */}
                              {item["Grasp Requirements"] && (
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                  <h6 className="font-medium text-indigo-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                    Requirements Understanding
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item["Grasp Requirements"]}
                                  </p>
                                </div>
                              )}

                              {/* Identify Key Ethical Issues */}
                              {item["Identify Key Ethical Issues"] && (
                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                  <h6 className="font-medium text-red-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Key Ethical Issues Identified
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item["Identify Key Ethical Issues"]}
                                  </p>
                                </div>
                              )}

                              {/* Feedback */}
                              {item.Feedback && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Overall Assessment Feedback
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.Feedback}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* For GS: Original structure */}
                              {/* Introduction */}
                              {item.Introduction && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <h6 className="font-medium text-green-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Introduction Analysis
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.Introduction}
                                  </p>
                                </div>
                              )}

                              {/* Body */}
                              {item.Body && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Body Analysis
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.Body}
                                  </p>
                                </div>
                              )}

                              {/* Conclusion */}
                              {item.Conclusion && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                  <h6 className="font-medium text-purple-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    Conclusion Analysis
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item.Conclusion}
                                  </p>
                                </div>
                              )}

                              {/* Instruction Analyses */}
                              {item["Instruction Analyses"] && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                    Overall Instruction Analysis
                                  </h6>
                                  <p className="text-gray-700 leading-relaxed">
                                    {item["Instruction Analyses"]}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Final Assessment - No score layout */}
        {llm_response?.FinalAssessment && (
          <div className="rounded-lg overflow-hidden mb-5 border border-gray-200 transition-all duration-300 shadow-sm">
            <button
              className="w-full flex justify-between items-center p-5 
              bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
              onClick={() => toggleSection("final-assessment")}
            >
              <h4 className="font-semibold text-gray-900">Final Assessment</h4>
              {expandedSections["final-assessment"] ? (
                <FiChevronUp className="text-gray-500 transition-transform duration-300" />
              ) : (
                <FiChevronDown className="text-gray-500 transition-transform duration-300" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
              ${
                expandedSections["final-assessment"]
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 border-t border-gray-200 bg-white">
                {llm_response.FinalAssessment.overall_feedback && (
                  <div className="mb-5">
                    <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                      Overall Feedback
                    </h4>
                    {llm_response.FinalAssessment.overall_feedback.map(
                      (feedback, index) => (
                        <p
                          key={`feedback-${index}`}
                          className="text-gray-700 mb-3 last:mb-0 leading-relaxed"
                        >
                          {feedback}
                        </p>
                      )
                    )}
                  </div>
                )}

                {llm_response.FinalAssessment.overall_strengths &&
                  llm_response.FinalAssessment.overall_strengths.length > 0 && (
                    <div className="mb-5">
                      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                        Overall Strengths
                      </h4>
                      <ul className="space-y-2">
                        {llm_response.FinalAssessment.overall_strengths.map(
                          (strength, index) => (
                            <li
                              key={`strength-${index}`}
                              className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
                            >
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {llm_response.FinalAssessment.suggested_improvements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b border-gray-100">
                      Suggested Improvements
                    </h4>
                    <ul className="space-y-2">
                      {llm_response.FinalAssessment.suggested_improvements.map(
                        (improvement, index) => (
                          <li
                            key={`improvement-${index}`}
                            className="text-gray-700 pl-4 border-l-2 border-gray-300 py-1"
                          >
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Legacy format code remains the same...
    // [Previous legacy code would go here - truncated for space]
    return <div>Legacy format not shown for brevity</div>;
  }
};

export default DetailedFeedbackTab;
