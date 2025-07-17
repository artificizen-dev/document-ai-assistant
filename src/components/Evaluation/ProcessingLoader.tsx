// import { useEffect, useState } from "react";
// import { FiClock } from "react-icons/fi";
// import { HiOutlineCloudUpload } from "react-icons/hi";

// const ProcessingLoader: React.FC<{ documents: any }> = ({ documents }) => {
//   const [, forceUpdate] = useState({});
//   const processingDocs = Object.values(documents).filter(
//     (doc: any) => doc.status === "processing"
//   );

//   // Force component to update every second to refresh the time display
//   useEffect(() => {
//     const interval = setInterval(() => {
//       forceUpdate({});
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Format time since upload started
//   const formatTimeSince = (startTime: number) => {
//     const seconds = Math.floor((Date.now() - startTime) / 1000);
//     if (seconds < 60) return `${seconds} seconds`;
//     if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
//     return `${Math.floor(seconds / 3600)} hours`;
//   };

//   return (
//     <div className="flex items-center justify-center px-6">
//       <div className="max-w-lg w-full text-center">
//         {/* Header Text */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-['Grosteque'] font-bold text-[#1F2937] mb-4">
//             Evaluating
//             <br />
//             in progress...
//           </h1>
//         </div>

//         {/* Animated Card Container */}
//         <div
//           className="relative w-[200px] h-[200px] rounded-[10px] overflow-hidden shadow-[16px_16px_20px_#0000008c] before:absolute before:top-[-50%] before:bottom-[-50%] before:right-[-50%] before:left-[-50%]
//         before:bg-[conic-gradient(transparent,transparent,#00a6ff)] before:animate-spin"
//         >
//           <div
//             className="absolute flex justify-center align-middle top-[5px] bottom-[5px] left-[5px] right-[5px] rounded-[10px]
//           px-[4px] bg-[#fff]"
//           ></div>
//         </div>

//         {/* Status Text */}
//         <div className="mb-12">
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <HiOutlineCloudUpload className="w-5 h-5 text-[#6B7280]" />
//             <p className="text-lg font-['Funnel_Sans'] text-[#6B7280]">
//               Please wait...
//             </p>
//           </div>
//         </div>

//         {/* Bottom Text */}
//         <div className="max-w-md mx-auto">
//           <p className="text-[#6B7280] font-['Funnel_Sans'] leading-relaxed">
//             You can navigate to other parts of the application while we process
//             your documents. We'll notify you when they're ready.
//           </p>
//         </div>

//         {/* Processing Documents List (if needed) */}
//         {processingDocs.length > 0 && (
//           <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
//             <h3 className="text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-4">
//               Processing Documents
//             </h3>
//             <div className="space-y-3">
//               {processingDocs.map((doc: any) => (
//                 <div
//                   key={doc.name}
//                   className="flex items-center p-3 bg-white rounded-xl border border-[#E5E7EB]"
//                 >
//                   <FiClock className="text-[#10B981] mr-3 w-4 h-4" />
//                   <div className="flex-1 text-left">
//                     <p className="font-['Funnel_Sans'] font-medium text-sm text-[#1F2937] truncate">
//                       {doc.name}
//                     </p>
//                     <p className="text-xs text-[#6B7280] font-['Funnel_Sans']">
//                       Processing for {formatTimeSince(doc.startTime)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         .animate-border-spin {
//           animation: spin 2s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProcessingLoader;

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { HiOutlineCloudUpload } from "react-icons/hi";

const ProcessingLoader: React.FC<{ documents: any }> = ({ documents }) => {
  const [, forceUpdate] = useState({});
  const processingDocs = Object.values(documents).filter(
    (doc: any) => doc.status === "processing"
  );

  // Force component to update every second to refresh the time display
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time since upload started
  const formatTimeSince = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  return (
    <div className="flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Header Text */}
        <div className="mb-12">
          <h1 className="text-4xl font-['Grosteque'] font-bold text-[#1F2937] mb-4">
            Evaluating
            <br />
            in progress...
          </h1>
        </div>

        {/* Animated Card Container with Side Boxes */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Center Box - Main Animated Box */}
          <div
            className="relative w-[200px] h-[200px] rounded-[10px] overflow-hidden shadow-[16px_16px_20px_#0000008c] before:absolute before:top-[-50%] before:bottom-[-50%] before:right-[-50%] before:left-[-50%]
          before:bg-[conic-gradient(transparent,transparent,#86efac)] before:animate-spin z-10"
          >
            <div
              className="absolute flex justify-center align-middle top-[5px] bottom-[5px] left-[5px] right-[5px] rounded-[10px]
            px-[4px] bg-[#fff]"
            ></div>
          </div>
        </div>

        {/* Status Text */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HiOutlineCloudUpload className="w-5 h-5 text-[#6B7280]" />
            <p className="text-lg font-['Funnel_Sans'] text-[#6B7280]">
              Please wait...
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="max-w-md mx-auto">
          <p className="text-[#6B7280] font-['Funnel_Sans'] leading-relaxed">
            You can navigate to other parts of the application while we process
            your documents. We'll notify you when they're ready.
          </p>
        </div>

        {/* Processing Documents List (if needed) */}
        {processingDocs.length > 0 && (
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <h3 className="text-sm font-['Funnel_Sans'] font-medium text-[#374151] mb-4">
              Processing Documents
            </h3>
            <div className="space-y-3">
              {processingDocs.map((doc: any) => (
                <div
                  key={doc.name}
                  className="flex items-center p-3 bg-white rounded-xl border border-[#E5E7EB]"
                >
                  <FiClock className="text-[#10B981] mr-3 w-4 h-4" />
                  <div className="flex-1 text-left">
                    <p className="font-['Funnel_Sans'] font-medium text-sm text-[#1F2937] truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-[#6B7280] font-['Funnel_Sans']">
                      Processing for {formatTimeSince(doc.startTime)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProcessingLoader;
