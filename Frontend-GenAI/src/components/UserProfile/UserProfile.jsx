import { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const UserProfile = () => {
    const { userProfile, updateUserProfile } = useContext(Context);
    const [profileData, setProfileData] = useState(userProfile);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserProfile(profileData); // Update context with new profile data
        alert('Profile updated successfully!');
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Render form fields */}
                {Object.keys(profileData).map((key) => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={key} className="mb-1 text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                        <input
                            id={key}
                            name={key}
                            type="text"
                            value={profileData[key]}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
