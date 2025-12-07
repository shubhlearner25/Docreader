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
    <div className="animated-bg min-h-screen relative overflow-hidden">

      {/* 🔵 Floating Blur Orbs */}
      <div className="blur-orb bg-purple-500 opacity-30 -top-10 -left-16"></div>
      <div className="blur-orb bg-blue-500 opacity-30 bottom-0 right-0"></div>

      {/* 🔥 Glass Navbar */}
      <div className="glass-card sticky top-0 z-20 p-4 shadow-xl">
        <Navbar />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">

        {/* Glass Dashboard Header */}
        <div className="glass-card p-8 rounded-2xl shadow-2xl mb-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Your Documents 📄
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Create or continue editing your real-time collaborative docs.
          </p>

          {/* ✏ Create Document */}
          <form
            onSubmit={handleCreate}
            className="mt-6 flex items-center gap-3 bg-white/20 p-4 rounded-xl backdrop-blur-md"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new document title..."
              className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-white/30 text-white hover:bg-white/50 font-semibold shadow-md hover:shadow-xl transition-all"
            >
              Create
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

        {/* Documents List */}
        <div className="space-y-4">
          {docs.map((doc) => (
            <div key={doc._id} className="transition-transform hover:scale-[1.02]">
              <DocumentCard doc={doc} />
            </div>
          ))}

          {/* Empty State */}
          {docs.length === 0 && (
            <div className="glass-card p-10 text-center rounded-2xl text-white shadow-xl">
              <h3 className="text-lg font-semibold drop-shadow">No documents yet</h3>
              <p className="text-white/80 mt-1 text-sm">
                Create your first document using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
