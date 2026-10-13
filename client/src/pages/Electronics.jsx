
import { useEffect, useState } from "react";
import {
  Plus,
  Laptop,
  CalendarDays,
  Trash2,
  Pencil,
} from "lucide-react";
import api from "../services/api";

export default function Electronics() {
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    invoiceUrl: "",
  });

  // Fetch saved electronics
  const fetchElectronics = async () => {
    try {
      const response = await api.get("/electronics");
      setElectronics(response.data.electronics || []);
      setError("");
    } catch (err) {
      console.error(
        "Electronics error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to load electronics. Please log in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectronics();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      deviceType: "",
      brand: "",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiry: "",
      invoiceUrl: "",
    });
    setEditingId(null);
  };

  // Submit new or updated electronics
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await api.put(`/electronics/${editingId}`, formData);
        setSuccess("Electronics updated successfully!");
      } else {
        await api.post("/electronics", formData);
        setSuccess("Electronics added successfully!");
      }

      resetForm();
      setShowForm(false);
      await fetchElectronics();
    } catch (err) {
      console.error(
        "Save electronics error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to save electronics."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit existing device
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      deviceType: item.deviceType || "",
      brand: item.brand || "",
      model: item.model || "",
      serialNumber: item.serialNumber || "",
      purchaseDate: item.purchaseDate
        ? item.purchaseDate.split("T")[0]
        : "",
      warrantyExpiry: item.warrantyExpiry
        ? item.warrantyExpiry.split("T")[0]
        : "",
      invoiceUrl: item.invoiceUrl || "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete device
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this device?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/electronics/${id}`);

      setSuccess("Electronics deleted successfully!");
      setError("");

      await fetchElectronics();
    } catch (err) {
      console.error(
        "Delete error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete electronics."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Electronics
            </h1>
            <p className="mt-2 text-slate-500">
              Manage your devices and warranty details.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
                setShowForm(false);
              } else {
                resetForm();
                setShowForm(true);
              }

              setError("");
              setSuccess("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {showForm ? "Cancel" : "Add Electronics"}
          </button>
        </div>

        {/* Success message */}
        {success && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Add/Edit Electronics Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {editingId ? "Edit Device" : "Add a New Device"}
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Device Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Device Type *
                </label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select device type</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="TV">TV</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="Washing Machine">
                    Washing Machine
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Dell, Samsung"
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Model */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Inspiron 15"
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Enter serial number"
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Warranty Expiry */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Warranty Expiry *
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Invoice URL */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">
                Invoice URL (Optional)
              </label>
              <input
                type="url"
                name="invoiceUrl"
                value={formData.invoiceUrl}
                onChange={handleChange}
                placeholder="Paste invoice link if available"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Device"
                  : "Save Device"}
              </button>
            </div>
          </form>
        )}

        {/* Electronics List */}
        <div className="mt-8">
          {loading ? (
            <p className="text-slate-500">
              Loading electronics...
            </p>
          ) : electronics.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Laptop
                className="mx-auto text-blue-600"
                size={40}
              />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                No electronics added yet
              </h2>
              <p className="mt-2 text-slate-500">
                Add your first device to start tracking its warranty.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {electronics.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {/* Device Header */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <Laptop size={24} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        {item.brand} {item.model}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {item.deviceType}
                      </p>
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <p>
                      <strong>Serial Number:</strong>{" "}
                      {item.serialNumber || "Not provided"}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>
                        <strong>Purchase:</strong>{" "}
                        {new Date(
                          item.purchaseDate
                        ).toLocaleDateString()}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>
                        <strong>Warranty Expiry:</strong>{" "}
                        {new Date(
                          item.warrantyExpiry
                        ).toLocaleDateString()}
                      </span>
                    </p>

                    {item.invoiceUrl && (
                      <p>
                        <a
                          href={item.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View Invoice
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}