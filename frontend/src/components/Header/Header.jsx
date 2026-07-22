import "./Header.css";
import { FolderPlus, Moon, Sun, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ darkMode, setDarkMode, phase, resetRepo }) {
  return (
    <motion.header
      className="header"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Left: logo + wordmark ── */}
      <div className="header-left">
        <motion.div
          className="logo-icon"
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <Sparkles size={18} />
        </motion.div>

        <div className="header-wordmark">
          <h2>RepoSense</h2>
          <span>AI Code Intelligence</span>
        </div>
      </div>

      {/* ── Right: actions ── */}
      <div className="header-right">
        {phase === "chat" && (
          <button className="secondary-btn" onClick={resetRepo}>
            <FolderPlus size={16} />
            New Repository
          </button>
        )}

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </motion.header>
  );
}