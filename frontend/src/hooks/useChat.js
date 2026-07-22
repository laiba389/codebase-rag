import { useState, useRef, useEffect } from "react";
import {
  uploadRepository,
  indexRepository,
  askQuestion,
  explainFileAPI,
} from "../services/api";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [phase, setPhase] = useState("upload");
  const [status, setStatus] = useState("");

  const [expandedSnippets, setExpandedSnippets] = useState({});

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const uploadRepo = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setPhase("indexing");
    setStatus("Uploading repository...");

    try {
      await uploadRepository(form);

      setStatus("Indexing repository...");

      const res = await indexRepository();
      if (res.data?.error || !res.data?.indexed) {
        throw new Error(res.data?.error || "No supported code files found in ZIP archive.");
      }

      setPhase("chat");

      setMessages([
        {
          role: "assistant",
          text: "✅ **Repository indexed successfully!**\n\nI've read and understood your entire codebase. You can now ask me anything — explain a function, trace a bug, understand the architecture, or find where something is implemented.\n\nTry asking:\n- *\"Explain the project structure\"*\n- *\"How does authentication work?\"*\n- *\"Where is the database connection set up?\"*",
          sources: [],
          snippets: [],
        },
      ]);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || err.message || "Upload failed.";
      setStatus(`Error: ${msg}`);
      setPhase("upload");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input;

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
        sources: [],
        snippets: [],
      },
    ]);

    setLoading(true);

    try {
      const res = await askQuestion(question);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.answer,
          sources: res.data.sources || [],
          snippets: res.data.snippets || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong.",
          sources: [],
          snippets: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const explainFile = async (filename) => {
    if (loading) return;

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: `Explain ${filename}`,
      },
    ]);

    try {
      const res = await explainFileAPI(filename);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.answer,
          sources: res.data.sources || [],
          snippets: res.data.snippets || [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetRepo = () => {
    setMessages([]);
    setInput("");
    setStatus("");
    setPhase("upload");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleSnippet = (messageIndex, snippetIndex) => {
    const key = `${messageIndex}-${snippetIndex}`;

    setExpandedSnippets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return {
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
  };
}