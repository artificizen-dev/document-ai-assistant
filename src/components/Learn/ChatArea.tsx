import React, { useState } from "react";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatNavbar from "./ChatNavbar";
import CategorySelector from "./CategorySelector";
import ChatInput from "./ChatInput";

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

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "AI (Artificial Intelligence) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      toggleReferencePanel();
    }, 1000);
  };

  const handleSelectCategory = (category: string) => {
    console.log("Selected category:", category);
  };

  return (
    <>
      <ChatNavbar
        toggleSidebar={toggleSidebar}
        onGeneratePodcast={() => console.log("Generate podcast")}
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
