// ChatArea.tsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { access_token, backendURL } from "../../utils/constants";
import { useAppContext } from "../../Providers/AppContext";
import { FiBookOpen } from "react-icons/fi";
import { ChatThread, Message } from "../../interfaces";
import LoginModal from "./LoginModal";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f1f1f1;
  }
`;

interface ChatAreaProps {
  toggleReferencePanel?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = (
  {
    // toggleReferencePanel,
  }
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const { user, currentChatroomId, createChatroom, selectChatroom } =
    useAppContext();

  const token = access_token();

  useEffect(() => {
    if (!currentChatroomId) {
      const searchParams = new URLSearchParams(location.search);
      const urlChatroomId = searchParams.get("chatroom_id");

      if (urlChatroomId) {
        selectChatroom(urlChatroomId);
      }
    }
  }, [currentChatroomId, location.search, selectChatroom]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  useEffect(() => {
    if (!currentChatroomId || currentChatroomId === "" || !user) {
      setMessages([]);
      return;
    }

    if (loading) {
      return;
    }

    const fetchMessages = async () => {
      setFetchingHistory(true);
      try {
        const response = await axios.get(
          `${backendURL}/api/chat/chat-thread/?chatroom_id=${currentChatroomId}`,
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
        }
        if (messages) {
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setFetchingHistory(false);
      }
    };

    fetchMessages();
  }, [currentChatroomId, user, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !user) {
      setShowLoginModal(true);
      return;
    }

    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    const tempBotMessageId = Date.now() + 1 + "";
    setMessages((prev) => [
      ...prev,
      {
        id: tempBotMessageId,
        type: "bot",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    setLoading(true);

    try {
      let chatId = currentChatroomId;

      if (!chatId) {
        const searchParams = new URLSearchParams(location.search);
        const urlChatroomId = searchParams.get("chatroom_id");

        if (urlChatroomId) {
          chatId = urlChatroomId;
          selectChatroom(urlChatroomId);
        } else {
          chatId = await createChatroom();

          if (!chatId) {
            console.error("Failed to create chatroom");
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== tempBotMessageId)
            );
            setLoading(false);
            return;
          }
        }
      }
      await sendMessageToApi(content, chatId, tempBotMessageId);
    } catch (error) {
      console.error("Error in message flow:", error);
      setLoading(false);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempBotMessageId));
    }
  };

  const sendMessageToApi = async (
    content: string,
    chatroomId: string,
    tempBotMessageId: string
  ) => {
    try {
      const response = await fetch(`${backendURL}/api/chat/chat-thread/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatroom_id: Number(chatroomId),
          query: content,
          // category: selectedCategory || undefined,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let accumulatedContent = "";

      // Update loading state to show "Generating response..." in ChatMessage
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMessageId
            ? {
                ...msg,
                content: "Generating response...",
                isLoading: true,
              }
            : msg
        )
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = new TextDecoder().decode(value);

        // Split the text by data: and process each chunk
        const lines = chunkText.split("data:");
        for (const line of lines) {
          if (line.trim()) {
            try {
              // Find the JSON part starting with {
              const jsonStart = line.indexOf("{");
              if (jsonStart !== -1) {
                const jsonStr = line.substring(jsonStart);
                const data = JSON.parse(jsonStr);

                if (data.type === "chunk" && data.content !== undefined) {
                  accumulatedContent += data.content;

                  // Update the message content with each chunk received
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempBotMessageId
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            isLoading: false,
                          }
                        : msg
                    )
                  );
                }
              }
            } catch (e) {
              console.error("Error parsing chunk:", e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message to API:", error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I couldn't process your request. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
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
      <style>{scrollbarStyles}</style>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white pt-8 flex flex-col md:min-w-[48rem]">
        {fetchingHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="md:max-w-[48rem] md:min-w-[48rem] md:mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
                isLoading={message.isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <div className="mt-auto md:max-w-[48rem] md:min-w-[48rem] md:mx-auto">
        <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
      </div>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
};

export default ChatArea;
