import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket/socket";
import api from "../utils/api";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const TiptapEditor = ({ documentId, shareMode }) => {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const { ydoc, provider } = useMemo(() => {
    const doc = new Y.Doc();
    const wsUrl =
  import.meta.env.VITE_API_URL.replace(/^http/, "ws") + "/collab";

    const wsProvider = new WebsocketProvider(wsUrl, documentId, doc);

    return { ydoc: doc, provider: wsProvider };
  }, [documentId]);

  const editor = useEditor({
    extensions: [
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      StarterKit.configure({ history: true }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user?.username || "Anonymous",
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-full outline-none",
      },
    },
    editable: shareMode !== "public_view",
  });

  // Presence + Typing
  useEffect(() => {
    socket.emit("join-document", {
      documentId,
      username: user?.username || "Anonymous",
    });

    socket.on("collaborators-update", (list) => {
      setCollaborators(list);
    });

    socket.on("show-typing", ({ username }) => {
      setTypingUser(`${username} is typing...`);
    });

    socket.on("hide-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("collaborators-update");
      socket.off("show-typing");
      socket.off("hide-typing");
    };
  }, [documentId, user?.username]);

  // Auto-save
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(async () => {
      try {
        const html = editor.getHTML();
        await api.put(`/documents/${documentId}`, { content: html });
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [editor, documentId]);

  const handleTyping = () => {
    if (!user || shareMode === "public_view") return;

    socket.emit("typing-start", {
      documentId,
      username: user.username,
    });

    setTimeout(() => {
      socket.emit("typing-stop", {
        documentId,
        username: user.username,
      });
    }, 700);
  };

  // Toolbar helper
  const setHeading = (level) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  if (!editor) return null;

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="flex flex-1 flex-col bg-slate-900">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded px-2 py-1 ${
              editor.isActive("bold") ? "bg-slate-700" : ""
            }`}
          >
            B
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded px-2 py-1 italic ${
              editor.isActive("italic") ? "bg-slate-700" : ""
            }`}
          >
            I
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`rounded px-2 py-1 underline ${
              editor.isActive("underline") ? "bg-slate-700" : ""
            }`}
          >
            U
          </button>

          <button
            onClick={() => setHeading(1)}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 1 }) ? "bg-slate-700" : ""
            }`}
          >
            H1
          </button>

          <button
            onClick={() => setHeading(2)}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 2 }) ? "bg-slate-700" : ""
            }`}
          >
            H2
          </button>

          <button
            onClick={() => setHeading(3)}
            className={`rounded px-2 py-1 ${
              editor.isActive("heading", { level: 3 }) ? "bg-slate-700" : ""
            }`}
          >
            H3
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded px-2 py-1 ${
              editor.isActive("bulletList") ? "bg-slate-700" : ""
            }`}
          >
            • List
          </button>

          <button
            onClick={() => editor.chain().focus().setColor("#e11d48").run()}
            className="rounded px-2 py-1"
          >
            Red
          </button>

          <button
            onClick={() => editor.chain().focus().setColor("#22c55e").run()}
            className="rounded px-2 py-1"
          >
            Green
          </button>

          <div className="ml-auto text-xs text-slate-400">
            {typingUser}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto p-6" onKeyDown={handleTyping}>
          <div className="mx-auto max-w-4xl rounded-xl bg-slate-950/40 p-6">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Collaborators */}
      <div className="w-56 border-l bg-white px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-800">
          Collaborators
        </h4>

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

export default TiptapEditor;
