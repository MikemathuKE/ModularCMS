"use client";

import { useEffect, useState } from "react";
import * as Icons from "react-icons/fa"; // FontAwesome icons via react-icons

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Account management state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    fetch("/api/cms/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const saveSettings = async () => {
    await fetch("/api/cms/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    alert("Settings saved!");
  };

  const updateSocialLink = (idx: number, field: string, value: string) => {
    const links = [...settings.socialLinks];
    links[idx][field] = value;
    setSettings({ ...settings, socialLinks: links });
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, { name: "", url: "", icon: "" }],
    });
  };

  const removeSocialLink = (idx: number) => {
    const links = [...settings.socialLinks];
    links.splice(idx, 1);
    setSettings({ ...settings, socialLinks: links });
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordMessage("⚠️ Both fields are required");
      return;
    }

    try {
      const res = await fetch("/api/cms/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMessage("✅ Password updated successfully");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordMessage(`⚠️ ${data.error || "Error changing password"}`);
      }
    } catch (err) {
      console.error(err);
      setPasswordMessage("⚠️ Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!settings) return <p>No settings found</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Site Settings */}
      <div>
        <label className="block mb-2 font-medium">Site Title</label>
        <input
          type="text"
          value={settings.siteTitle}
          onChange={(e) =>
            setSettings({ ...settings, siteTitle: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Site Description</label>
        <input
          type="text"
          value={settings.siteDescription}
          onChange={(e) =>
            setSettings({ ...settings, siteDescription: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Social Links */}
      <div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Social Links</h2>
        {settings.socialLinks.map((link: any, idx: number) => {
          const IconComp = (Icons as any)[link.icon] || null;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 border p-3 mb-2 rounded"
            >
              <input
                type="text"
                placeholder="Name"
                value={link.name}
                onChange={(e) => updateSocialLink(idx, "name", e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <select
                value={link.icon}
                onChange={(e) => updateSocialLink(idx, "icon", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Select Icon</option>
                <option value="FaFacebook">Facebook</option>
                <option value="FaTwitter">Twitter</option>
                <option value="FaGithub">Github</option>
                <option value="FaLinkedin">LinkedIn</option>
                <option value="FaInstagram">Instagram</option>
              </select>
              {IconComp && <IconComp className="w-6 h-6 text-gray-700" />}
              <button
                type="button"
                onClick={() => removeSocialLink(idx)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addSocialLink}
          className="mt-2 px-3 py-2 bg-blue-600 text-white rounded"
        >
          + Add Social Link
        </button>
      </div>

      <button
        type="button"
        onClick={saveSettings}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Settings
      </button>

      {/* Account Management */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Account Management</h2>
        <div className="space-y-2 max-w-md">
          <label className="block font-medium">Current Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <label className="block font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="button"
            onClick={handleChangePassword}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Change Password
          </button>

          {passwordMessage && (
            <p
              className={`mt-2 text-sm ${
                passwordMessage.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
