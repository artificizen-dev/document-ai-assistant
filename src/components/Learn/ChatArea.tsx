import React, { useState } from "react";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatNavbar from "./ChatNavbar";
import CategorySelector from "./CategorySelector";
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";

interface ChatAreaProps {
  toggleSidebar: () => void;
  toggleReferencePanel: () => void;
}

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  toggleSidebar,
  toggleReferencePanel,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "What is AI",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "AI (Artificial Intelligence) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      // Trigger reference panel update
      toggleReferencePanel();
    }, 1000);
  };

  const handleSelectCategory = (category: string) => {
    console.log("Selected category:", category);
    // In a real implementation, this would filter or adjust the AI response
  };

  const onClose = () => {
    navigate(ROUTES.default);
  };

  return (
    <>
      <ChatNavbar
        toggleSidebar={toggleSidebar}
        onUploadDocument={() => console.log("Upload document")}
        onGeneratePodcast={() => console.log("Generate podcast")}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto bg-white">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.type}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
      </div>

      <div className="mt-auto">
        <CategorySelector onSelectCategory={handleSelectCategory} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};

export default ChatArea;
