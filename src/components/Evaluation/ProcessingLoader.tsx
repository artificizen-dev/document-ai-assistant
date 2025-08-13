// import { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// import videoJson from "../../assets/Loader.json";

// const ProcessingLoader: React.FC<{ documents: any }> = ({ documents }) => {
//   const [, forceUpdate] = useState({});
//   const processingDocs = Object.values(documents).filter(
//     (doc: any) => doc.status === "processing"
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       forceUpdate({});
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   console.log("Processing documents:", processingDocs);

//   return (
//     <div className="flex overflow-hidden relative">
//       <Lottie
//         animationData={videoJson}
//         loop
//         className="w-full max-h-[80vh] object-cover"
//       />
//       <p className="absolute md:text-[15px] text-[12px] z-10 top-[75%] md:left-12 text-lg max-w-xl text-center text-gray-600 p-4">
//         The document processing can take some time. In the meantime, you can
//         navigate to other parts of the application. We’ll let you know once the
//         processing is done.
//       </p>
//     </div>
//   );
// };

// export default ProcessingLoader;

import React, { useEffect, useState, Suspense } from "react";
const Lottie = React.lazy(() => import("lottie-react"));
import videoJson from "../../assets/Loader.json";

const ProcessingLoader: React.FC<{ documents: any }> = ({ documents }) => {
  const [, forceUpdate] = useState({});
  const processingDocs = Object.values(documents).filter(
    (doc: any) => doc.status === "processing"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  console.log("Processing documents:", processingDocs);

  return (
    <div className="flex overflow-hidden relative">
      <Suspense fallback={null}>
        <Lottie
          animationData={videoJson}
          loop
          className="w-full max-h-[80vh] object-cover"
        />
      </Suspense>
      <p className="absolute md:text-[15px] text-[12px] z-10 top-[75%] md:left-12 text-lg max-w-xl text-center text-gray-600 p-4">
        The document processing can take some time. In the meantime, you can
        navigate to other parts of the application. We’ll let you know once the
        processing is done.
      </p>
    </div>
  );
};

export default ProcessingLoader;
