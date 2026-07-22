import "./Spinner.css";
import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="typing-wrapper">

      <div className="typing-card">

        {[0,1,2].map((dot)=>(
          <motion.div
            key={dot}
            className="dot"
            animate={{
              y:[0,-8,0],
            }}
            transition={{
              repeat:Infinity,
              duration:.8,
              delay:dot*.15,
            }}
          />
        ))}

      </div>

    </div>
  );
}