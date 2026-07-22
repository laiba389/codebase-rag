import "./UploadScreen.css";
import { UploadCloud, FileArchive, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function UploadScreen({ uploadRepo, fileInputRef, status }) {
  return (
    <motion.div
      className="upload-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Glow */}
      <div className="background-blur blur1"></div>
      <div className="background-blur blur2"></div>

      {/* Upload Card */}
      <motion.div
        className="upload-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        {/* Floating Upload Icon */}
        <motion.div
          className="icon-wrapper"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <UploadCloud size={42} />
        </motion.div>

        <h1>Upload Repository</h1>

        <p>
          Upload a ZIP of any GitHub repository and start chatting with your
          code using AI.
        </p>

        <label className="upload-btn">
          <FileArchive size={18} />
          Choose ZIP

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            hidden
            onChange={uploadRepo}
          />
        </label>

        {status && status.startsWith("Error:") && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {status.replace("Error: ", "")}
          </div>
        )}

        <div className="divider" />

        <div className="supported">
          <Sparkles size={16} />

          <strong>Supports</strong>

          <span>Python</span>
          <span>JavaScript</span>
          <span>TypeScript</span>
          <span>Java</span>
          <span>C++</span>
          <span>Go</span>
          <span>Rust</span>
        </div>
      </motion.div>
    </motion.div>
  );
}