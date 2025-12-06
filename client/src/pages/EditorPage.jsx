import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TiptapEditor from "../components/TiptapEditor";
import api from "../utils/api";

const EditorPage = () => {
  const { id } = useParams();
  const [docMeta, setDocMeta] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/documents/${id}`);
        setDocMeta(res.data);
      } catch (err) {
        console.error("Load document error:", err);
      }
    };
    load();
  }, [id]);

  if (!docMeta) return null;

  return (
    <div className="flex h-screen flex-col">
      <Navbar
        documentId={id}
        shareId={docMeta.shareId}
        accessMode={docMeta.accessMode}
      />

      <TiptapEditor
        documentId={id}
        shareMode={docMeta.accessMode}
      />
    </div>
  );
};

export default EditorPage;
