import React from "react";
import { FiBookOpen } from "react-icons/fi";
import { useAppContext } from "../../Providers/AppContext";
import Avatar from "boring-avatars";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ChatMessageProps, SimpleCodeProps } from "../../interfaces";

const ChatMessage: React.FC<ChatMessageProps> = ({ type, content }) => {
  const isUser = type === "user";
  const { user, getUserProfileImage } = useAppContext();
  const profileImage = getUserProfileImage ? getUserProfileImage() : "";

  return (
    <div className={`flex mb-4 ${isUser ? "" : "bg-gray-50 py-4"}`}>
      <div className="flex-shrink-0 mr-3 ml-2">
        {isUser ? (
          <div className="w-8 h-8 overflow-hidden rounded-full">
            {profileImage ? (
              <img
                src={profileImage}
                alt="User Profile"
                className="w-8 h-8 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Avatar
                size={32}
                name={user?.username || user?.email || "User"}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white">
            <FiBookOpen size={16} />
          </div>
        )}
      </div>

      <div className="flex-1 mr-4">
        <div className="font-medium mb-1">
          {isUser ? user?.username || "You" : "AI Assistant"}
        </div>
        {isUser ? (
          <div className="text-gray-800">{content}</div>
        ) : (
          <div className="text-gray-800 markdown-content">
            {/* @ts-ignore - Skip type checking for ReactMarkdown */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({
                  node,
                  inline,
                  className,
                  children,
                  ...props
                }: SimpleCodeProps) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      PreTag="div"
                      {...props}
                      // @ts-ignore - Ignore style type issues
                      style={oneDark}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children, ...props }: any) => (
                  <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }: any) => (
                  <h2 className="text-xl font-bold mt-3 mb-2" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }: any) => (
                  <h3 className="text-lg font-bold mt-3 mb-1" {...props}>
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }: any) => (
                  <h4 className="text-base font-bold mt-2 mb-1" {...props}>
                    {children}
                  </h4>
                ),
                p: ({ children, ...props }: any) => (
                  <p className="my-2" {...props}>
                    {children}
                  </p>
                ),
                ul: ({ children, ...props }: any) => (
                  <ul className="list-disc pl-5 my-2" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }: any) => (
                  <ol className="list-decimal pl-5 my-2" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }: any) => (
                  <li className="my-1" {...props}>
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }: any) => (
                  <blockquote
                    className="pl-4 border-l-4 border-gray-300 italic my-2"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
                a: ({ children, ...props }: any) => (
                  <a
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
