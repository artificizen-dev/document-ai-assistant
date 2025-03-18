import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 rounded-r-md px-4 flex items-center justify-center"
          disabled={!message.trim()}
        >
          <FiSend
            size={16}
            className={message.trim() ? "text-gray-800" : "text-gray-400"}
          />
        </button>
      </form>

      <div className="text-xs text-gray-500 mt-2 text-center">
        AI may produce inaccurate information about people, places, or facts.
      </div>
    </div>
  );
};

export default ChatInput;
