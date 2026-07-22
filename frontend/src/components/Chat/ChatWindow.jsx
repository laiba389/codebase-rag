import "./ChatWindow.css";

import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";
import EmptyState from "../EmptyState/EmptyState";

export default function ChatWindow({

    messages,

    loading,

    expandedSnippets,

    explainFile,

    toggleSnippet,

    bottomRef

}) {

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.length === 0 ? (
                    <EmptyState />
                ) : (
                    messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                            index={index}
                            expandedSnippets={expandedSnippets}
                            explainFile={explainFile}
                            toggleSnippet={toggleSnippet}
                        />
                    ))
                )}

                {loading && <Spinner />}

                <div ref={bottomRef} />
            </div>
        </div>
    );

}