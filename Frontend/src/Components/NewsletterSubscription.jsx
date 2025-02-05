import { useState } from "react";

function NewsletterSubscription() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consent: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.consent) {
      alert("Please fill out all fields and agree to the terms.");
      return;
    }
 
    alert("Thank you for subscribing!");

    setFormData({
      name: "",
      email: "",
      consent: false,
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Get exclusive travel deals, destination guides, and tips straight to
          your inbox!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label
              htmlFor="consent"
              className="ml-2 block text-sm text-gray-600"
            >
              I agree to receive emails and accept the{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                privacy policy
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewsletterSubscription;
