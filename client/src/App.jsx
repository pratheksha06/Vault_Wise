import {
  BellRing,
  FileText,
  ShieldCheck,
  Clock3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Electronics from "./pages/Electronics";
import Vehicles from "./pages/Vehicles";
import PersonalDocuments from "./pages/PersonalDocuments";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path='/dashboard' element={<Dashboard />} />

        <Route path="/electronics" element={<Electronics />} />

        <Route path="/vehicles" element={<Vehicles />} />

        <Route path="/personal-documents" element={<PersonalDocuments />}/>

      </Routes>
    </BrowserRouter>
  );
}

function LandingPage() {
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">

        {/* Background decoration */}
        <div className="absolute left-1/2 top-20 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto max-w-4xl text-center">

            {/* Small badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck size={16} />
              Your personal digital vault
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Never miss an
              <span className="block text-blue-600">
                important deadline.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Vault_Wise keeps your important documents, assets, warranties,
              insurance policies and renewal dates organized in one secure
              place.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

              <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <button className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100">
                See how it works
              </button>

            </div>

          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-5xl">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40">

              {/* Fake browser bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />
                <div className="h-3 w-3 rounded-full bg-slate-300" />

                <div className="ml-4 h-7 flex-1 rounded-md bg-white" />
              </div>

              {/* Dashboard */}
              <div className="grid min-h-[400px] grid-cols-12">

                {/* Sidebar */}
                <div className="col-span-3 hidden border-r border-slate-200 bg-slate-950 p-5 sm:block">

                  <div className="mb-8 flex items-center gap-2 text-white">
                    <ShieldCheck size={20} />
                    <span className="font-semibold">Vault_Wise</span>
                  </div>

                  <div className="space-y-2">

                    <div className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">
                      Dashboard
                    </div>

                    <div className="px-3 py-2 text-sm text-slate-400">
                      Assets
                    </div>

                    <div className="px-3 py-2 text-sm text-slate-400">
                      Documents
                    </div>

                    <div className="px-3 py-2 text-sm text-slate-400">
                      Reminders
                    </div>

                  </div>

                </div>

                {/* Main dashboard */}
                <div className="col-span-12 p-6 sm:col-span-9">

                  <div className="mb-6">
                    <p className="text-sm text-slate-500">
                      Welcome back 👋
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Your Vault Overview
                    </h2>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                    <StatCard
                      icon={<FileText size={20} />}
                      title="Documents"
                      value="24"
                    />

                    <StatCard
                      icon={<ShieldCheck size={20} />}
                      title="Assets"
                      value="12"
                    />

                    <StatCard
                      icon={<BellRing size={20} />}
                      title="Reminders"
                      value="5"
                    />

                    <StatCard
                      icon={<Clock3 size={20} />}
                      title="Expiring"
                      value="3"
                    />

                  </div>

                  {/* Upcoming */}
                  <div className="mt-8">

                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold">
                        Upcoming Deadlines
                      </h3>

                      <span className="text-sm text-blue-600">
                        View all
                      </span>
                    </div>

                    <div className="space-y-3">

                      <Deadline
                        name="Vehicle Insurance"
                        date="20 Oct 2026"
                        days="40 days left"
                      />

                      <Deadline
                        name="Laptop Warranty"
                        date="15 Nov 2026"
                        days="66 days left"
                      />

                      <Deadline
                        name="Driving License"
                        date="12 Dec 2026"
                        days="93 days left"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-slate-200 bg-white py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold text-blue-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Stay organized. Stay ahead.
            </h2>

            <p className="mt-4 text-slate-600">
              Vault_Wise helps you manage the things you don't want to forget.
            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <FeatureCard
              icon={<FileText />}
              title="Centralized Documents"
              description="Keep invoices, certificates, insurance papers and important documents organized in one secure vault."
            />

            <FeatureCard
              icon={<BellRing />}
              title="Smart Reminders"
              description="Get reminded before warranties, subscriptions, licenses and insurance policies expire."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Secure & Private"
              description="Your personal records are protected with secure authentication and controlled access."
            />

          </div>

        </div>

      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-slate-50 py-24"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="font-semibold text-blue-600">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Your important records, simplified.
            </h2>

          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">

            <Step
              number="01"
              title="Add your records"
              description="Add your assets, documents and important expiry dates."
            />

            <Step
              number="02"
              title="Set reminders"
              description="Choose when you want Vault_Wise to remind you."
            />

            <Step
              number="03"
              title="Stay ahead"
              description="Get notified before important deadlines arrive."
            />

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-24 text-white">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-bold sm:text-5xl">
            Take control of your important records.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            Organize your documents today and never worry about missing an
            important renewal again.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-700">
            Create your vault
            <ArrowRight size={18} />
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-sm text-slate-500">
        © 2026 Vault_Wise. Your personal digital vault.
      </footer>

    </div>
  );
}


/* ---------- Components ---------- */

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p className="text-xl font-bold">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}


function Deadline({ name, date, days }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <CheckCircle2 size={20} />
        </div>

        <div>
          <p className="font-medium">
            {name}
          </p>

          <p className="text-sm text-slate-500">
            {date}
          </p>
        </div>

      </div>

      <span className="text-sm font-medium text-orange-600">
        {days}
      </span>

    </div>
  );
}


function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}


function Step({ number, title, description }) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}


export default App;