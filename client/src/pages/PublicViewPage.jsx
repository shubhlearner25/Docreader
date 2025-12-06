import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TiptapEditor from "../components/TiptapEditor";
import api from "../utils/api";

const PublicViewPage = () => {
  const { shareId } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/documents/share/${shareId}`);
        setDoc(res.data);
      } catch (err) {
        console.error("Load public doc error", err);
      }
    };
    load();
  }, [shareId]);

  if (!doc) return null;

  return (
    <div className="flex h-screen flex-col bg-slate-900">
      <div className="border-b bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-100">
        {doc.title} (View only)
      </div>
      <TiptapEditor documentId={doc.id} shareMode="public_view" />
    </div>
  );
};

export default PublicViewPage;
