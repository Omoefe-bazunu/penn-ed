// src/pages/About.jsx
function About() {
  // Social links (placeholders)
  const socialLinks = [
    {
      name: "Twitter/X",
      href: "https://twitter.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        About Penned
      </h1>

      {/* Description */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Our Story
        </h2>
        <p className="text-slate-600 font-inter leading-relaxed">
          Penned is a vibrant platform dedicated to empowering writers
          worldwide. Whether you're crafting a single post, a sprawling series,
          or engaging with our creative community, Penned provides the tools and
          inspiration to bring your stories to life.
        </p>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Our Mission
        </h2>
        <p className="text-slate-600 font-inter leading-relaxed">
          We believe every voice deserves to be heard. Our mission is to foster
          creativity, connect writers with opportunities, and build a supportive
          community where ideas flourish. From courses to competitions, Penned
          is your home for storytelling.
        </p>
      </section>

      {/* Social Icons & Contact */}
      <section className="text-center">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Connect with Us
        </h2>
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-teal-600 transition-colors p-4 rounded-full bg-gray-200"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
        <p className="text-slate-600 font-inter">
          Contact us at:{" "}
          <a
            href="tel:+2349043970401"
            className="text-teal-600 hover:underline"
          >
            +2349043970401
          </a>
        </p>
      </section>
    </div>
  );
}

export default About;
