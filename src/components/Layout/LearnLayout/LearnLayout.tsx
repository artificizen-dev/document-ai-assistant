import React, { useState } from "react";
import ChatArea from "../../Learn/ChatArea";
import ChatSidebar from "../../Learn/ChatSidebar";
import ReferencePanel from "../../Learn/ReferencePanel";

const LearnLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showReferencePanel, setShowReferencePanel] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full bg-white border-b border-gray-200 p-4">
        <h2 className="text-2xl font-medium">Document Chat</h2>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat list */}
        <ChatSidebar
          isVisible={showSidebar}
          onClose={() => setShowSidebar(false)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          <ChatArea
            toggleSidebar={() => setShowSidebar(!showSidebar)}
            toggleReferencePanel={() =>
              setShowReferencePanel(!showReferencePanel)
            }
          />
        </div>

        {/* Right panel - References */}
        <ReferencePanel
          isVisible={showReferencePanel}
          onClose={() => setShowReferencePanel(false)}
        />
      </div>
    </div>
  );
};

export default LearnLayout;
