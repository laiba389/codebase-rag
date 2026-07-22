import "./Sidebar.css";

import {
  FolderGit2,
  MessageSquare,
  BarChart3,
  Database,
  Github,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

export default function Sidebar({
  phase,
}) {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -70 }}
      animate={{ x: 0 }}
    >
<div className="logo">
  <Sparkles size={28} className="logo-icon" />

  <div className="logo-text">
    <h2>RepoSense</h2>
    <span>AI Code Intelligence</span>
  </div>
</div>

<div className="sidebar-section">
  <h4>Workspace</h4>

  <button>
    <FolderGit2 size={18} />
    Repository
  </button>

  <button>
    <MessageSquare size={18} />
    AI Chat
  </button>

  <button>
    <BarChart3 size={18} />
    Insights
  </button>

  <button>
    <Database size={18} />
    Embeddings
  </button>
</div>

      <div className="sidebar-footer">

        <Github size={18}/>

        Built with React + FastAPI

      </div>

    </motion.aside>
  );
}