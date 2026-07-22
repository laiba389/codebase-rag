import "./Snippet.css";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  FileCode2,
} from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Snippet({

  snippet,

  open,

  onToggle,

}) {

  const copyCode = () => {
    navigator.clipboard.writeText(snippet.text);
  };

  return (

    <div className="snippet">

      <div className="snippet-header">

        <div className="snippet-title">

          <FileCode2 size={16}/>

          {snippet.file}

        </div>

        <div className="snippet-actions">

          <button onClick={copyCode}>

            <Copy size={16}/>

          </button>

          <button onClick={onToggle}>

            {

              open

              ?

              <ChevronUp size={18}/>

              :

              <ChevronDown size={18}/>

            }

          </button>

        </div>

      </div>

      {

        open && (

          <SyntaxHighlighter

            language="javascript"

            style={oneDark}

            customStyle={{

              margin:0,

              borderRadius:"0 0 18px 18px",

              fontSize:"13px",

            }}

          >

            {snippet.text}

          </SyntaxHighlighter>

        )

      }

    </div>

  );
}