import "./Message.css";

import { Bot, User } from "lucide-react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";

import SourceChip from "../SourceChip/SourceChip";
import Snippet from "../Snippet/Snippet";

export default function Message({
  message,
  index,
  expandedSnippets,
  explainFile,
  toggleSnippet,
}) {
  const isUser = message.role === "user";

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="bubble">
        <div className="markdown-body">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {message.text}
          </ReactMarkdown>
        </div>

        {message.sources?.length > 0 && (
          <div className="sources">
            {message.sources.map((source, i) => (
              <SourceChip
                key={i}
                source={source}
                explainFile={explainFile}
              />
            ))}
          </div>
        )}

        {message.snippets?.length > 0 &&
          message.snippets.map((snippet, i) => (
            <Snippet
              key={i}
              snippet={snippet}
              open={expandedSnippets[`${index}-${i}`]}
              onToggle={() => toggleSnippet(index, i)}
            />
          ))}
      </div>
    </div>
  );
}