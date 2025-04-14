// import React, { useState } from "react";
// import { FiSend } from "react-icons/fi";
// import { ChatInputProps } from "../../interfaces";

// const ChatInput: React.FC<ChatInputProps> = ({
//   onSendMessage,
//   isLoading = false,
//   // disabled = false,
// }) => {
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (message.trim() && !isLoading) {
//       onSendMessage(message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className=" bg-white pt-0 pb-4 px-0">
//       <form onSubmit={handleSubmit} className="flex shadow-2xl rounded-3xl">
//         <input
//           type="text"
//           placeholder="Send a message..."
//           className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           disabled={isLoading}
//         />
//         <button
//           type="submit"
//           className="bg-gray-200 hover:bg-gray-300 rounded-r-md px-4 flex items-center justify-center"
//           disabled={!message.trim() || isLoading}
//         >
//           {isLoading ? (
//             <div className="w-4 h-4 border-t-2 border-gray-600 border-solid rounded-full animate-spin"></div>
//           ) : (
//             <FiSend
//               size={16}
//               className={message.trim() ? "text-gray-800" : "text-gray-400"}
//             />
//           )}
//         </button>
//       </form>

//       {/* <div className="text-xs text-gray-500 mt-2 text-center">
//         AI may produce inaccurate information about people, places, or facts.
//       </div> */}
//     </div>
//   );
// };

// export default ChatInput;

import React, { useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { ChatInputProps } from "../../interfaces";

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-white pt-0 pb-4 px-0">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Send a message..."
          className="w-full border border-gray-300 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            <FiArrowUp size={16} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
