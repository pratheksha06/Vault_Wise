
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ArrowLeft,
  Plus,
  FileText,
  Pencil,
  Trash2,
  CalendarDays,
  CreditCard,
  X,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  documentType: "",
  documentName: "",
  documentNumber: "",
  issueDate: "",
  expiryDate: "",
  documentUrl: "",
};

const documentTypes = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "College ID",
  "Employee ID",
  "Other",
];

// These document types do not normally have an expiry date.
const noExpiryDocuments = [
  "Aadhaar Card",
  "PAN Card",
  "Voter ID",
];

function PersonalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setError("");
      const response = await api.get("/personal-documents");
      setDocuments(response.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load personal documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Update form fields and clear expiry date when it does not apply.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (
        name === "documentType" &&
        noExpiryDocuments.includes(value)
      ) {
        updated.expiryDate = "";
      }

      return updated;
    });
  };

  const handleAdd = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const handleEdit = (document) => {
    setForm({
      documentType: document.documentType || "",
      documentName: document.documentName || "",
      documentNumber: document.documentNumber || "",
      issueDate: document.issueDate
        ? document.issueDate.split("T")[0]
        : "",
      expiryDate: document.expiryDate
        ? document.expiryDate.split("T")[0]
        : "",
      documentUrl: document.documentUrl || "",
    });

    setEditingId(document._id);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        documentName: form.documentName.trim(),
        documentNumber: form.documentNumber.trim(),
        documentUrl: form.documentUrl.trim(),
        issueDate: form.issueDate || null,
        expiryDate: noExpiryDocuments.includes(form.documentType)
          ? null
          : form.expiryDate || null,
      };

      if (editingId) {
        await api.put(
          `/personal-documents/${editingId}`,
          payload
        );
      } else {
        await api.post("/personal-documents", payload);
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchDocuments();
    } catch (err) {
      console.error("Failed to save document:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save document."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/personal-documents/${id}`);

      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete document."
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <h1 className="text-lg font-bold text-slate-900">
            Vault<span className="text-blue-600">_Wise</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Manage your important identity records
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Personal Documents
            </h1>

            <p className="mt-2 text-slate-500">
              Store and manage your personal document details in one place.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Document
          </button>
        </div>

        {/* Error message */}
        {error && !showForm && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Documents count */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <CreditCard size={24} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Personal Documents
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {documents.length}
              </p>
            </div>
          </div>
        </div>

        {/* Documents list */}
        {loading ? (
          <p className="py-16 text-center text-slate-500">
            Loading personal documents...
          </p>
        ) : documents.length === 0 ? (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="rounded-full bg-blue-50 p-5 text-blue-600">
              <FileText size={32} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No personal documents yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Add your Aadhaar, PAN, Passport, Driving License, or
              other personal documents to keep their details organized.
            </p>

            <button
              onClick={handleAdd}
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Your First Document
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <div
                key={document._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <FileText size={24} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(document)}
                      title="Edit document"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => handleDelete(document._id)}
                      title="Delete document"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {document.documentType}
                  </span>

                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    {document.documentName}
                  </h2>

                  {document.documentNumber && (
                    <p className="mt-2 break-all text-sm text-slate-500">
                      Document No: {document.documentNumber}
                    </p>
                  )}
                </div>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  {document.issueDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={16} />
                      <span>
                        Issued:{" "}
                        {new Date(
                          document.issueDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {document.expiryDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={16} />
                      <span>
                        Expires:{" "}
                        {new Date(
                          document.expiryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {document.documentUrl && (
                    <a
                      href={document.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      View Document
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Document" : "Add Personal Document"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Document type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Type *
                </label>

                <select
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select document type</option>

                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Name *
                </label>

                <input
                  type="text"
                  name="documentName"
                  value={form.documentName}
                  onChange={handleChange}
                  placeholder="e.g. My Aadhaar Card"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Document number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document Number (optional)
                </label>

                <input
                  type="text"
                  name="documentNumber"
                  value={form.documentNumber}
                  onChange={handleChange}
                  placeholder="Enter document number (optional)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Issue and expiry dates */}
              <div
                className={`grid gap-4 ${
                  noExpiryDocuments.includes(form.documentType)
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Issue Date (optional)
                  </label>

                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                {!noExpiryDocuments.includes(form.documentType) && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expiry Date (if applicable)
                    </label>

                    <input
                      type="date"
                      name="expiryDate"
                      value={form.expiryDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Document URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document URL (optional)
                </label>

                <input
                  type="url"
                  name="documentUrl"
                  value={form.documentUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/document.pdf"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Optional. Add a link to a stored document.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Document"
                    : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalDocuments;
