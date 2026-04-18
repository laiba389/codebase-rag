import { useState, useRef, useEffect } from "react"
import axios from "axios"

const API = "https://codebase-rag-api.onrender.com"

const Spinner = () => (
  <div style={{display:"flex",gap:4,padding:"10px 14px"}}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width:7,height:7,borderRadius:"50%",
        background:"#888",
        animation:"bounce 1s infinite",
        animationDelay: i*0.15+"s"
      }}/>
    ))}
    <style>{
      "@keyframes bounce {0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)}}"
    }</style>
  </div>
)

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState("upload")
  const [status, setStatus] = useState("")
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"})
  }, [messages])

  const uploadRepo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const form = new FormData()
    form.append("file", file)
    setStatus("Uploading...")
    setPhase("indexing")
    try {
      await axios.post(API+"/upload", form)
      setStatus("Indexing... (may take 1-2 min)")
      await axios.post(API+"/index")
      setStatus("")
      setPhase("chat")
      setMessages([{
        role:"assistant",
        text:"Repo indexed! Ask me anything about your code.",
        sources:[]
      }])
    } catch (err) {
      setStatus("Upload failed — is the backend running?")
      setPhase("upload")
    }
  }

  const explainFile = async (filename) => {
    setLoading(true)
    setMessages(m => [...m,{
      role:"user",
      text:`Explain the file: ${filename}`,
      sources:[]
    }])
    try {
      const res = await axios.post(API+"/explain-file",{filename})
      setMessages(m => [...m,{
        role:"assistant",
        text: res.data.answer,
        sources: res.data.sources
      }])
    } catch (err) {
      const msg = err.response?.data?.detail ||
                  "Backend error — is the server running?"
      setMessages(m => [...m,{
        role:"assistant", text:msg, sources:[]
      }])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const q = input
    setInput("")
    setMessages(m => [...m,{role:"user", text:q, sources:[]}])
    setLoading(true)
    try {
      const res = await axios.post(API+"/ask",{query:q})
      setMessages(m => [...m,{
        role:"assistant",
        text: res.data.answer,
        sources: res.data.sources
      }])
    } catch (err) {
      const msg = err.response?.data?.detail ||
                  "Backend error — is the server running?"
      setMessages(m => [...m,{
        role:"assistant", text:msg, sources:[]
      }])
    } finally {
      setLoading(false)
    }
  }

  const s = {
    wrap:{maxWidth:680,margin:"0 auto",padding:"24px 16px",
      fontFamily:"system-ui",height:"100vh",
      display:"flex",flexDirection:"column",gap:16},
    msgArea:{flex:1,overflowY:"auto",display:"flex",
      flexDirection:"column",gap:12,padding:"8px 0"},
    msg:(role)=>({alignSelf:role==="user"?"flex-end":"flex-start",
      maxWidth:"80%",padding:"10px 14px",borderRadius:12,
      background:role==="user"?"#185FA5":"#f1f0f0",
      color:role==="user"?"#fff":"#1a1a1a",
      fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap"}),
    sources:{fontSize:11,marginTop:6,opacity:.7},
    inputRow:{display:"flex",gap:8},
    inp:{flex:1,padding:"10px 14px",borderRadius:10,
      border:"1px solid #ccc",fontSize:14,outline:"none"},
    btn:{padding:"10px 20px",borderRadius:10,border:"none",
      background:"#185FA5",color:"#fff",
      fontSize:14,cursor:"pointer"}
  }

  return (
    <div style={s.wrap}>
      <h2 style={{fontSize:18,fontWeight:500,margin:0}}>
        Codebase RAG Assistant
      </h2>

      {phase === "upload" && (
        <div style={{padding:24,border:"2px dashed #ccc",
          borderRadius:12,textAlign:"center"}}>
          <p style={{marginBottom:12,color:"#555"}}>
            Upload your repo as a .zip file
          </p>
          <input type="file" accept=".zip" onChange={uploadRepo}/>
          {status && <p style={{marginTop:8,color:"red"}}>{status}</p>}
        </div>
      )}

      {phase === "indexing" && (
        <div style={{textAlign:"center",padding:32}}>
          <p>{status}</p>
        </div>
      )}

      {phase === "chat" && (
        <>
          <div style={s.msgArea}>
            {messages.map((m,i) => (
              <div key={i} style={s.msg(m.role)}>
                {m.text}
                {m.sources?.length > 0 && (
                  <div style={s.sources}>
                    <span style={{opacity:.8}}>From: </span>
                    {m.sources.map((src,j) => (
                      <span key={j} style={{
                        background:"rgba(255,255,255,.2)",
                        borderRadius:4,padding:"1px 6px",
                        marginRight:4,cursor:"pointer",
                        textDecoration:"underline"
                      }}
                      onClick={() => explainFile(src)}>
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <Spinner />}
            <div ref={bottomRef}/>
          </div>
          <div style={s.inputRow}>
            <input style={s.inp} value={input}
              placeholder="Ask about your code..."
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendMessage()}/>
            <button style={s.btn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )
}