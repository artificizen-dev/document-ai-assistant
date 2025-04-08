import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatMessage from "./ChatMessage";
import ChatNavbar from "./ChatNavbar";
import CategorySelector from "./CategorySelector";
import ChatInput from "./ChatInput";
import { access_token, backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { FiBookOpen } from "react-icons/fi";
import { ChatAreaProps, ChatThread, Message } from "../../interfaces";

const ChatArea: React.FC<ChatAreaProps> = ({
  toggleSidebar,
  // toggleReferencePanel,
  chatroomId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppContext();
  const token = access_token();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!chatroomId || !user) return;

    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const response = await axios.get(
          `${backendURL}/api/chat/chat-thread/?chatroom_id=${chatroomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let formattedMessages: Message[] = [];

        if (Array.isArray(response.data)) {
          const threads = response.data as ChatThread[];

          threads.forEach((thread: ChatThread) => {
            formattedMessages.push({
              id: `user-${thread.id}`,
              type: "user",
              content: thread.user_response,
              timestamp: new Date(thread.created_at),
            });

            if (thread.ai_response) {
              formattedMessages.push({
                id: `bot-${thread.id}`,
                type: "bot",
                content: thread.ai_response,
                timestamp: new Date(thread.created_at),
              });
            }
          });
        } else {
          console.error("Unexpected response format:", response.data);
        }

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchMessages();
  }, [chatroomId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !chatroomId || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const tempBotMessageId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: tempBotMessageId.toString(),
          type: "bot",
          content: "",
          timestamp: new Date(),
        },
      ]);

      const response = await fetch(`${backendURL}/api/chat/chat-thread/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatroom_id: Number(chatroomId),
          query: content,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = new TextDecoder().decode(value);

        const lines = chunkText.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const jsonStr = line.substring(line.indexOf("{"));
              const data = JSON.parse(jsonStr);

              if (data.type === "chunk" && data.content) {
                accumulatedContent += data.content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempBotMessageId.toString()
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing chunk:", e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (category: string) => {
    console.log("Selected category:", category);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <FiBookOpen size={32} className="text-gray-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome to Document AI Assistant
      </h2>
      <p className="text-gray-600 mb-4 max-w-md">
        Ask questions about your documents and get intelligent answers based on
        the content.
      </p>
      <div className="text-sm text-gray-500 max-w-md">
        <p>
          Select a category and start asking questions to explore your
          documents.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <ChatNavbar
        toggleSidebar={toggleSidebar}
        onGeneratePodcast={() => console.log("Generate podcast")}
      />

      <div className="flex-1 overflow-y-auto bg-white pt-2 flex flex-col">
        {fetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="mt-auto">
        <CategorySelector onSelectCategory={handleSelectCategory} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
      </div>
    </>
  );
};

export default ChatArea;
