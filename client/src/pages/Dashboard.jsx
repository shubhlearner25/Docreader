import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchDocs = async () => {
    try {
      const res = await api.get("/documents");
      setDocs(res.data);
    } catch (err) {
      console.error("Load docs error:", err);
      setError("Failed to load documents");
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post("/documents", { title });
      setTitle("");
      setDocs((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Create doc error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your documents
            </h2>
            <p className="text-sm text-slate-500">
              Create a new document or continue editing an existing one.
            </p>
          </div>
          <form
            onSubmit={handleCreate}
            className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New document title"
              className="w-48 border-none text-sm placeholder:text-slate-400 focus:ring-0"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
            >
              Create
            </button>
          </form>
        </div>
        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}
        <div className="space-y-3">
          {docs.map((doc) => (
            <DocumentCard key={doc._id} doc={doc} />
          ))}
          {docs.length === 0 && (
            <p className="text-sm text-slate-500">
              No documents yet. Create your first document above.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
