import { useState } from "react";

const AIColdCall = () => {
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    time: "",
    name: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cold Call Details:", formData);
    alert("Cold Call Details Submitted!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          AI Cold Call
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          {/* Day */}
          <div>
            <label htmlFor="day" className="block text-sm font-medium">
              Day
            </label>
            <input
              type="text"
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              placeholder="e.g., Monday"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full mt-1 p-2 bg-black text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIColdCall;
