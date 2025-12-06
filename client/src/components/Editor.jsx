import { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Editor = ({ documentId }) => {
  const [text, setText] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const { user } = useAuth();
  const saveTimer = useRef(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/documents/${documentId}`);
        setText(res.data.content || "");
      } catch (err) {
        console.error("Error loading document:", err);
      }
    };
    fetchDoc();
  }, [documentId]);

  useEffect(() => {
    socket.emit("join-document", {
      documentId,
      username: user?.username || "Anonymous",
    });

    socket.on("receive-text", (content) => {
      setText(content);
    });

    socket.on("collaborators-update", (list) => {
      setCollaborators(list);
    });

    return () => {
      socket.off("receive-text");
      socket.off("collaborators-update");
    };
  }, [documentId, user?.username]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    socket.emit("typing", { documentId, content: value });
  };

  useEffect(() => {
    if (saveTimer.current) clearInterval(saveTimer.current);

    saveTimer.current = setInterval(async () => {
      try {
        await api.put(`/documents/${documentId}`, { content: text });
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }, 10000);

    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, [documentId, text]);

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="flex-1">
        <textarea
          value={text}
          onChange={handleChange}
          className="h-full w-full resize-none bg-slate-900 p-4 font-mono text-sm text-slate-50 outline-none"
          placeholder="Start typing..."
        />
      </div>
      <div className="w-56 border-l bg-white px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-800">Collaborators</h4>
        <div className="mt-2 space-y-1 text-xs text-slate-600">
          {collaborators.map((c, idx) => (
            <div key={idx}>• {c.username}</div>
          ))}
          {collaborators.length === 0 && (
            <p className="text-slate-400">No one else is here yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
