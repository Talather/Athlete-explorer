import { useState } from "react";

function SettingsPage() {
    const [profileImage, setProfileImage] = useState("/sixer.gif");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    return (
        <div className="p-6 md:p-10 w-[95%] max-w-4xl mx-auto text-gray-800 bg-white rounded-lg my-3 border">
            <h1 className="text-3xl font-semibold mb-4 pb-4 border-b">Settings</h1>

            <form action="" className="w-full">
                {/* Profile Section */}
                <section className="mb-10 w-full">
                    <h2 className="text-xl font-bold mb-4">Profile</h2>
                    <div className="flex items-center gap-6 w-full">
                        <div className="relative group shrink-0">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="size-20 rounded-full object-cover border border-gray-300"
                            />
                            <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition">
                                Change
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-bold mb-1">Username</label>
                            <input
                                type="text"
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                                placeholder="yourusername"
                            />
                        </div>
                    </div>
                </section>

                {/* Language & Currency */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Language</label>
                            <select className="border border-gray-300 px-4 py-2 rounded w-full">
                                <option>English</option>
                                <option>Bangla</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Currency</label>
                            <select className="border border-gray-300 px-4 py-2 rounded w-full">
                                <option>USD</option>
                                <option>BDT</option>
                                <option>EUR</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-1">Email</label>
                            <input
                                type="email"
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Phone</label>
                            <input
                                type="tel"
                                className="border border-gray-300 px-4 py-2 rounded w-full"
                                placeholder="+0123456789"
                            />
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Notifications</h2>
                    <div className="flex flex-col items-start gap-4">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="form-checkbox" defaultChecked />
                            Receive email updates
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" className="form-checkbox" />
                            SMS notifications
                        </label>
                    </div>
                </section>

                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                    Save Changes
                </button>
            </form>

            {/* Delete Account */}
            <section className="mt-12 border-t pt-6">
                <h2 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h2>
                <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
                    Delete My Account
                </button>
            </section>
        </div>
    );
}

export default SettingsPage;
