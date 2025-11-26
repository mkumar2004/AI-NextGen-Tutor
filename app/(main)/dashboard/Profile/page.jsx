"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@stackframe/stack"; // Stack Auth User
import { Loader2, Pencil, Save } from "lucide-react";

export default function ProfilePage() {
  const user = useUser();

  /* Convex Queries */
  const profile = useQuery(api.users.getProfile, {
    email: user?.email ?? "",
  });

  /* Convex Mutations */
  const updateProfile = useMutation(api.users.updateProfile);

  /* Form States */
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    avatar: "",
  });

  /* Load data to form */
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
        mobile: profile.mobile ?? "",
        address: profile.address ?? "",
        avatar: profile.avatar ?? "/agent-placeholder.svg",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        email: user.email,
        ...form,
      });
      setEdit(false);
    } catch (e) {
      console.error("Update failed:", e);
    }
    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 p-6">

      {/* ───────────────────────── SIDE PROFILE ───────────────────────── */}
      <div className="w-72 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
        <img
          src={form.avatar}
          className="w-32 h-32 rounded-full object-cover border shadow"
        />

        <h2 className="text-xl font-bold mt-4">{form.name}</h2>
        <p className="text-gray-500 text-sm">{form.email}</p>

        <div className="mt-5 w-full space-y-2 text-gray-700">
          <p><span className="font-semibold">Mobile:</span> {form.mobile}</p>
          <p><span className="font-semibold">Address:</span> {form.address}</p>
        </div>

        <button
          className="mt-6 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
          onClick={() => setEdit(true)}
        >
          <Pencil size={18} /> Edit Profile
        </button>
      </div>

      {/* ───────────────────────── MAIN CONTENT (INNER SCROLL) ───────────────────────── */}
      <div className="flex-1 ml-6 bg-white shadow-lg rounded-2xl p-6 overflow-hidden flex flex-col">

        <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>

        <div className="flex-1 overflow-y-auto pr-3">

          {/* EDIT FORM */}
          {edit ? (
            <div className="space-y-4">

              {/* NAME */}
              <div>
                <label className="font-semibold">Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg mt-1"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              {/* EMAIL (readonly) */}
              <div>
                <label className="font-semibold">Email</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg mt-1 bg-gray-100"
                  value={form.email}
                  readOnly
                />
              </div>

              {/* MOBILE */}
              <div>
                <label className="font-semibold">Mobile</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg mt-1"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="font-semibold">Address</label>
                <textarea
                  className="w-full border p-2 rounded-lg mt-1"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                ></textarea>
              </div>

              {/* AVATAR */}
              <div>
                <label className="font-semibold">Avatar URL</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg mt-1"
                  value={form.avatar}
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.value })
                  }
                />
              </div>

              {/* SAVE BUTTON */}
              <button
                className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>

            </div>
          ) : (
            <div className="text-gray-600">
              <p>Edit your information by clicking "Edit Profile".</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
