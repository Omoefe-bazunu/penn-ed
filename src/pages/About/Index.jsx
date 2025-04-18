import { FaFacebookF } from "react-icons/fa";

function About() {
  // Social links (placeholders)
  const socialLinks = [
    {
      name: "Twitter/X",
      href: "https://x.com/raniem57",
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
      name: "Facebook",
      href: "https://www.facebook.com/efe.bazunu/",
      icon: <FaFacebookF className="w-6 h-6" />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/omoefe-bazunu-651b72203/",
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
      <h1 className="text-3xl font-bold font-poppins text-teal-600 mb-6">
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
      </section>
    </div>
  );
}

export default About;
