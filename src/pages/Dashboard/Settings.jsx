// src/pages/Dashboard/Settings.jsx
function Settings() {
  // Dummy user data
  const dummyUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    bio: "Passionate writer and storyteller.",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Account Settings
      </h1>

      {/* Profile Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Profile
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Name
            </label>
            <input
              type="text"
              defaultValue={dummyUser.name}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={dummyUser.email}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-inter text-slate-600 mb-1">
              Bio
            </label>
            <textarea
              defaultValue={dummyUser.bio}
              className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
              rows="4"
              disabled
            ></textarea>
          </div>
          <button
            className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            disabled
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Placeholder for more settings */}
      <section>
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Preferences
        </h2>
        <p className="text-slate-600 font-inter">
          Coming soon: Notification settings, theme preferences, and more.
        </p>
      </section>
    </div>
  );
}

export default Settings;
