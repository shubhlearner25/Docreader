import { useNavigate } from "react-router-dom";

const DocumentCard = ({ doc }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/documents/${doc._id}`);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{doc.title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          Last updated: {new Date(doc.updatedAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleOpen}
        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
      >
        Open
      </button>
    </div>
  );
};

export default DocumentCard;
