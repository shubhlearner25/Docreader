import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../utils/api";

const Navbar = ({ documentId, shareId, accessMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);
  const [mode, setMode] = useState(accessMode || "private");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const editLink = documentId ? `${origin}/documents/${documentId}` : "";
  const viewLink = shareId ? `${origin}/view/${shareId}` : "";

  const updateShareMode = async (newMode) => {
    if (!documentId) return;
    try {
      setMode(newMode);
      await api.put(`/documents/${documentId}/share`, {
        accessMode: newMode,
      });
    } catch (err) {
      console.error("Update share mode error", err);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <Link to="/dashboard" className="text-lg font-semibold text-slate-800">
          RealTime Docs
        </Link>
        <div className="flex items-center gap-3">
          {documentId && shareId && (
            <button
              onClick={() => setShowShare(true)}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
            >
              Share
            </button>
          )}
          {user && (
            <>
              <span className="text-xs text-slate-600">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {showShare && documentId && shareId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-900">
              Share this document
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose how people with the link can access this document.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="font-medium text-slate-800">
                    Public edit link
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Anyone with this link can edit & view.
                  </p>
                  <p className="mt-1 break-all text-[11px] text-slate-700">
                    {editLink}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editLink);
                    updateShareMode("public_edit");
                  }}
                  className="ml-2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white"
                >
                  Copy
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <div>
                  <p className="font-medium text-slate-800">
                    View-only link
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Anyone with this link can only view.
                  </p>
                  <p className="mt-1 break-all text-[11px] text-slate-700">
                    {viewLink}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(viewLink);
                    updateShareMode("public_view");
                  }}
                  className="ml-2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  updateShareMode("private");
                  setShowShare(false);
                }}
                className="rounded-md border px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
              >
                Make private
              </button>
              <button
                onClick={() => setShowShare(false)}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
