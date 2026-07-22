import "./App.css";
import { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import UploadScreen from "./components/Upload/UploadScreen";
import Indexing from "./components/Indexing/Indexing";
import ChatWindow from "./components/Chat/ChatWindow";
import ChatInput from "./components/ChatInput/ChatInput";

import useChat from "./hooks/useChat";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);

  const {
    messages,
    input,
    loading,
    phase,
    status,
    expandedSnippets,
    bottomRef,
    fileInputRef,
    setInput,
    uploadRepo,
    sendMessage,
    explainFile,
    resetRepo,
    toggleSnippet,
  } = useChat();

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        phase={phase}
        resetRepo={resetRepo}
      />

      <main className="content">
        {phase === "upload" && (
          <UploadScreen
            uploadRepo={uploadRepo}
            fileInputRef={fileInputRef}
            status={status}
          />
        )}

        {phase === "indexing" && (
          <Indexing status={status} />
        )}

        {phase === "chat" && (
          <>
            <ChatWindow
              messages={messages}
              loading={loading}
              expandedSnippets={expandedSnippets}
              explainFile={explainFile}
              toggleSnippet={toggleSnippet}
              bottomRef={bottomRef}
            />

            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              loading={loading}
            />
          </>
        )}
      </main>
    </div>
  );
}