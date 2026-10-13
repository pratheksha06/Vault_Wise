
import { useEffect, useState } from "react";
import {
  Plus,
  CarFront,
  CalendarDays,
  Trash2,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    vehicleType: "",
    brand: "",
    model: "",
    registrationNumber: "",
    purchaseDate: "",
    insuranceExpiry: "",
    pucExpiry: "",
    rcDocumentUrl: "",
    insuranceDocumentUrl: "",
  });

  // Fetch saved vehicles
  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data.vehicles || []);
      setError("");
    } catch (err) {
      console.error(
        "Vehicles error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to load vehicles. Please log in again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
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
      vehicleType: "",
      brand: "",
      model: "",
      registrationNumber: "",
      purchaseDate: "",
      insuranceExpiry: "",
      pucExpiry: "",
      rcDocumentUrl: "",
      insuranceDocumentUrl: "",
    });
    setEditingId(null);
  };

  // Submit new or updated vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        insuranceExpiry: formData.insuranceExpiry || null,
        pucExpiry: formData.pucExpiry || null,
      };

      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
        setSuccess("Vehicle updated successfully!");
      } else {
        await api.post("/vehicles", payload);
        setSuccess("Vehicle added successfully!");
      }

      resetForm();
      setShowForm(false);
      await fetchVehicles();
    } catch (err) {
      console.error(
        "Save vehicle error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to save vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit existing vehicle
  const handleEdit = (item) => {
    setEditingId(item._id);

    setFormData({
      vehicleType: item.vehicleType || "",
      brand: item.brand || "",
      model: item.model || "",
      registrationNumber: item.registrationNumber || "",
      purchaseDate: item.purchaseDate
        ? item.purchaseDate.split("T")[0]
        : "",
      insuranceExpiry: item.insuranceExpiry
        ? item.insuranceExpiry.split("T")[0]
        : "",
      pucExpiry: item.pucExpiry
        ? item.pucExpiry.split("T")[0]
        : "",
      rcDocumentUrl: item.rcDocumentUrl || "",
      insuranceDocumentUrl: item.insuranceDocumentUrl || "",
    });

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete vehicle
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/${id}`);

      setSuccess("Vehicle deleted successfully!");
      setError("");

      await fetchVehicles();
    } catch (err) {
      console.error(
        "Delete vehicle error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to delete vehicle."
      );
    }
  };

  // Format dates
  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Vehicles
            </h1>
            <p className="mt-2 text-slate-500">
              Manage your vehicles, insurance, and important documents.
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
            {showForm ? "Cancel" : "Add Vehicle"}
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

        {/* Add/Edit Vehicle Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {editingId ? "Edit Vehicle" : "Add a New Vehicle"}
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Vehicle Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select vehicle type</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Scooter">Scooter</option>
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
                  placeholder="e.g. Honda, Hyundai"
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
                  placeholder="e.g. Activa, Creta"
                  required
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. TN XX XX 1234"
                  required
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

              {/* Insurance Expiry */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Insurance Expiry
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* PUC Expiry */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  PUC Expiry
                </label>
                <input
                  type="date"
                  name="pucExpiry"
                  value={formData.pucExpiry}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* RC Document URL */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">
                RC Document URL (Optional)
              </label>
              <input
                type="url"
                name="rcDocumentUrl"
                value={formData.rcDocumentUrl}
                onChange={handleChange}
                placeholder="Paste RC document link"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Insurance Document URL */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">
                Insurance Document URL (Optional)
              </label>
              <input
                type="url"
                name="insuranceDocumentUrl"
                value={formData.insuranceDocumentUrl}
                onChange={handleChange}
                placeholder="Paste insurance document link"
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
                  ? "Update Vehicle"
                  : "Save Vehicle"}
              </button>
            </div>
          </form>
        )}

        {/* Vehicles List */}
        <div className="mt-8">
          {loading ? (
            <p className="text-slate-500">Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <CarFront
                className="mx-auto text-blue-600"
                size={40}
              />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                No vehicles added yet
              </h2>
              <p className="mt-2 text-slate-500">
                Add your first vehicle to start tracking its important dates.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {/* Vehicle Header */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <CarFront size={24} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        {item.brand} {item.model}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {item.vehicleType}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <p>
                      <strong>Registration Number:</strong>{" "}
                      {item.registrationNumber}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>
                        <strong>Purchase:</strong>{" "}
                        {formatDate(item.purchaseDate)}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>
                        <strong>Insurance Expiry:</strong>{" "}
                        {formatDate(item.insuranceExpiry)}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      <span>
                        <strong>PUC Expiry:</strong>{" "}
                        {formatDate(item.pucExpiry)}
                      </span>
                    </p>

                    {item.rcDocumentUrl && (
                      <p>
                        <a
                          href={item.rcDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View RC Document
                        </a>
                      </p>
                    )}

                    {item.insuranceDocumentUrl && (
                      <p>
                        <a
                          href={item.insuranceDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View Insurance Document
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