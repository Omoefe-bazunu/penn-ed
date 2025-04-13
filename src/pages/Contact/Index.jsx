// src/pages/Contact.jsx
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy submission
    console.log("Contact Form Data:", formData);
    alert("Message sent (dummy)");
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-inter text-slate-600 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-inter text-slate-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-inter text-slate-600 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-md font-inter text-slate-800"
                rows="5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* WhatsApp Option */}
        <section className="flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
            Chat with Us
          </h2>
          <p className="text-slate-600 font-inter mb-6 text-center">
            Prefer a quick chat? Reach out to us on WhatsApp!
          </p>
          <a
            href="https://wa.me/+2349043970401?text=Hi%20Penned%20team%2C%20I%27d%20like%20to%20get%20in%20touch!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-500 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-green-400 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.099-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.452-4.437 9.884-9.885 9.884m6.932-2.045c-.381.114-2.238.711-2.585.794-.346.083-.564.126-.806-.18-.242-.306-.943-1.184-1.153-1.424-.21-.24-.425-.27-.792-.126-.367.144-1.545.567-2.947 1.812-1.092.968-1.825 2.162-2.035 2.528-.21.367-.022.563-.16.746-.125.163-.367.426-.55.638-.183.214-.245.367-.367.61-.122.242-.061.456.031.638.092.183.825 1.984 1.128 2.707.297.712.6.614.806.626.183.01.458.012.703.012.245 0 .638-.092.975-.458.337-.367 1.283-1.246 1.283-3.037 0-1.792-1.31-3.526-1.494-3.794-.183-.245-.022-.563.16-.746.163-.163.458-.426.642-.638.183-.214.245-.367.367-.61.122-.242.061-.456-.031-.638-.092-.183-.825-1.984-1.128-2.707-.297-.712-.6-.614-.806-.626-.183-.01-.458-.012-.703-.012z" />
            </svg>
            Chat on WhatsApp
          </a>
        </section>
      </div>
    </div>
  );
}

export default Contact;
