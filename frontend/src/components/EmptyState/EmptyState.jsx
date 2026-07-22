import "./EmptyState.css";

import { Sparkles, Search, FolderGit2, ShieldCheck } from "lucide-react";

import { motion } from "framer-motion";

export default function EmptyState() {
  const suggestions = [
    {
      icon: <ShieldCheck size={17} />,
      text: "Explain the authentication flow",
    },
    {
      icon: <Search size={17} />,
      text: "Where is JWT generated?",
    },
    {
      icon: <FolderGit2 size={17} />,
      text: "Explain the project structure",
    },
  ];

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="empty-logo"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <Sparkles size={36} />
      </motion.div>

      <h1>RepoSense</h1>

      <p>
        Your repository is indexed. Ask me anything — from architecture
        overviews to specific function explanations.
      </p>

      <div className="suggestion-list">
        {suggestions.map((item, index) => (
          <motion.button
            key={index}
            className="suggestion-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.08 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("fillPrompt", { detail: item.text })
              )
            }
          >
            {item.icon}
            <span>{item.text}</span>
          </motion.button>
        ))}
      </div>

      <span className="ready-text">Repository ready · Ask anything</span>
    </motion.div>
  );
}