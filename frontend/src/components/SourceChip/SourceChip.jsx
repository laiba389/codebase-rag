import "./SourceChip.css";
import { FileCode2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SourceChip({ source, explainFile }) {
  return (
    <motion.button
      className="source-chip"
      whileHover={{
        y: -3,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
      onClick={() => explainFile(source)}
    >
      <FileCode2 size={16} />
      <span>{source}</span>
    </motion.button>
  );
}