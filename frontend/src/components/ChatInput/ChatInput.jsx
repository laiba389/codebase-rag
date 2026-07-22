import "./ChatInput.css";
import { SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  loading,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <motion.div
        className="chat-input"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask anything about your repository..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          className="send-btn"
          disabled={loading || !input.trim()}
          onClick={sendMessage}
          title="Send (Enter)"
        >
          <SendHorizontal size={18} />
        </motion.button>
      </motion.div>

      <p className="input-hint">Press Enter to send &middot; Shift+Enter for new line</p>
    </div>
  );
}