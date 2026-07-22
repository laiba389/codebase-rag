import "./Indexing.css";
import { motion } from "framer-motion";
import {
  LoaderCircle,
  FolderGit2,
  FileCode2,
  Database,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: FolderGit2,
    title: "Reading Repository",
  },
  {
    icon: FileCode2,
    title: "Splitting Code Chunks",
  },
  {
    icon: Database,
    title: "Creating Embeddings",
  },
  {
    icon: Sparkles,
    title: "Building AI Knowledge Base",
  },
];

export default function Indexing({ status }) {
  return (
    <motion.div
      className="indexing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="index-card">

        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        >
          <LoaderCircle size={48} />
        </motion.div>

        <h1>Preparing your Repository</h1>

        <p>
          Sit back while we understand your entire codebase.
        </p>

        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          />
        </div>

        <div className="steps">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                className="step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * .2,
                }}
              >
                <Icon size={20} />

                <span>{step.title}</span>

              </motion.div>
            );

          })}

        </div>

        <div className="status">

          {status}

        </div>

      </div>
    </motion.div>
  );
}