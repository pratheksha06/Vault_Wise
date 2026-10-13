
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BellRing,
  FileText,
  ShieldCheck,
  Clock3,
  Plus,
  LogOut,
  Car,
  Laptop,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";


function getExpiryStatus(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysRemaining = Math.round(
    (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (Number.isNaN(expiry.getTime())) {
    return {
      label: "Invalid date",
      color: "text-slate-500",
    };
  }

  if (daysRemaining < 0) {
    return {
      label: "Expired",
      color: "text-red-600",
    };
  }

  if (daysRemaining === 0) {
    return {
      label: "Expires today",
      color: "text-red-600",
    };
  }

  if (daysRemaining <= 7) {
    return {
      label: `Expires in ${daysRemaining} ${
        daysRemaining === 1 ? "day" : "days"
      }`,
      color: "text-orange-600",
    };
  }

  return {
    label: `Expires in ${daysRemaining} days`,
    color: "text-green-600",
  };
}


function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [electronics, setElectronics] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [personalDocuments, setPersonalDocuments] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
const [
  electronicsResponse,
  vehiclesResponse,
  personalDocumentsResponse,
] = await Promise.all([
  api.get("/electronics"),
  api.get("/vehicles"),
  api.get("/personal-documents"),
]);

        const electronicsData =
          electronicsResponse.data.electronics || [];

        const vehiclesData =
          vehiclesResponse.data.vehicles || [];

        const personalDocumentsData =
          personalDocumentsResponse.data.documents || [];

        setElectronics(electronicsData);
        setVehicles(vehiclesData);
        setPersonalDocuments(personalDocumentsData);


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30);

        const deadlines = [];

        // Electronics warranty deadlines
        electronicsData.forEach((item) => {
          if (item.warrantyExpiry) {
            deadlines.push({
              id: `${item._id}-warranty`,
              name: `${item.brand} ${item.model}`,
              category: item.deviceType || "Electronics",
              deadlineType: "Warranty",
              expiryDate: item.warrantyExpiry,
              icon: "electronics",
            });
          }
        });

        // Vehicle insurance and PUC deadlines
        vehiclesData.forEach((vehicle) => {
          if (vehicle.insuranceExpiry) {
            deadlines.push({
              id: `${vehicle._id}-insurance`,
              name: `${vehicle.brand} ${vehicle.model}`,
              category: vehicle.registrationNumber,
              deadlineType: "Insurance",
              expiryDate: vehicle.insuranceExpiry,
              icon: "vehicle",
            });
          }

          if (vehicle.pucExpiry) {
            deadlines.push({
              id: `${vehicle._id}-puc`,
              name: `${vehicle.brand} ${vehicle.model}`,
              category: vehicle.registrationNumber,
              deadlineType: "PUC",
              expiryDate: vehicle.pucExpiry,
              icon: "vehicle",
            });
          }
        });

        
        // Personal document expiry deadlines
        const noExpiryTypes = [
          "Aadhaar Card",
          "PAN Card",
          "Voter ID",
        ];

        personalDocumentsData.forEach((document) => {
          if (
            document.expiryDate &&
            !noExpiryTypes.includes(document.documentType)
          ) {
            deadlines.push({
              id: `${document._id}-document-expiry`,
              name: document.documentName,
              category: document.documentType,
              deadlineType: "Document Expiry",
              expiryDate: document.expiryDate,
              icon: "document",
            });
          }
        });


        
        const upcoming = deadlines
          .filter((item) => {
            const expiry = new Date(item.expiryDate);

            if (Number.isNaN(expiry.getTime())) {
              return false;
            }

            expiry.setHours(0, 0, 0, 0);

            // Show expired records and records expiring in the next 30 days.
            return expiry < next30Days;
          })
          .sort(
            (a, b) =>
              new Date(a.expiryDate) - new Date(b.expiryDate)
          );
          


        setUpcomingDeadlines(upcoming);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalAssets = electronics.length + vehicles.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">
              Vault<span className="text-blue-600">_Wise</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Welcome back 👋
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Your Vault Overview
            </h1>

            <p className="mt-2 text-slate-500">
              Keep track of your important records and upcoming deadlines.
            </p>
          </div>

          <Link
            to="/electronics"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Record
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText />}
            title="Documents"
            value={loading ? "..." : personalDocuments.length}
            description="Stored personal documents"
          />

          <StatCard
            icon={<ShieldCheck />}
            title="Assets"
            value={totalAssets}
            description="Electronics and vehicles"
          />

          <StatCard
            icon={<BellRing />}
            title="Reminders"
            value={loading ? "..." : upcomingDeadlines.length}
            description="Upcoming deadlines"
          />

          <StatCard
            icon={<Clock3 />}
            title="Expiring Soon"
            value={
              loading
                ? "..."
                : upcomingDeadlines.filter((item) => {
                    const expiry = new Date(item.expiryDate);
                    const today = new Date();

                    if (Number.isNaN(expiry.getTime())) {
                      return false;
                    }

                    today.setHours(0, 0, 0, 0);
                    expiry.setHours(0, 0, 0, 0);

                    const daysRemaining = Math.floor(
                      (expiry.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return daysRemaining >= 0 && daysRemaining <= 7;
                  }).length
            }
            description="Today or within 7 days"
          />
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Deadlines
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Important dates you should keep an eye on.
                </p>
              </div>

              <BellRing className="text-blue-600" size={22} />
            </div>

            {loading ? (
              <p className="py-12 text-center text-slate-500">
                Loading upcoming deadlines...
              </p>
            ) : upcomingDeadlines.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Clock3 size={26} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No upcoming deadlines
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  No warranties, insurance policies, PUC certificates, or
                  personal documents are expiring within the next 30 days.
                </p>

                <Link
                  to="/vehicles"
                  className="mt-5 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                >
                  View Vehicles
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        {item.icon === "vehicle" ? (
                          <Car size={22} />
                        ) : item.icon === "document" ? (
                          <FileText size={22} />
                        ) : (
                          <Laptop size={22} />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {item.category} · {item.deadlineType}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 sm:items-end">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={16} />
                        <span>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          getExpiryStatus(item.expiryDate).color
                        }`}
                      >
                        {getExpiryStatus(item.expiryDate).label}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organize your records by type.
            </p>

            <div className="mt-6 space-y-3">
              
            <div className="mt-6 space-y-3">
              <Link to="/electronics" className="block">
                <Category
                  icon={<Laptop size={19} />}
                  title="Electronics"
                  count={`${electronics.length} records`}
                />
              </Link>

              <Link to="/vehicles" className="block">
                <Category
                  icon={<Car size={19} />}
                  title="Vehicles"
                  count={`${vehicles.length} records`}
                />
              </Link>

              <Link to="/personal-documents" className="block">
                <Category
                  icon={<CreditCard size={19} />}
                  title="Personal Documents"
                  count={`${personalDocuments.length} records`}
                />
              </Link>

              <Category
                icon={<FileText size={19} />}
                title="Other Documents"
                count="0 records"
              />
            </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 rounded-2xl bg-slate-950 p-8 text-white">
          <div className="max-w-2xl">
            <p className="font-semibold text-blue-400">
              Get started with Vault_Wise
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your digital vault is ready.
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Add your important documents, warranties, insurance policies
              and other records. Vault_Wise will help you keep track of
              important dates and reminders.
            </p>

            <Link
              to="/electronics"
              className="mt-6 flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              <Plus size={18} />
              Add your first record
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Category({ icon, title, count }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="font-medium text-slate-800">
          {title}
        </span>
      </div>

      <span className="text-xs text-slate-500">{count}</span>
    </div>
  );
}

export default Dashboard;