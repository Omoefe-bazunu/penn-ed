// src/pages/Dashboard/Portfolio.jsx
import { Link } from "react-router-dom";
import Card from "../../components/ui/card";

// Dummy portfolio items
const dummyPortfolio = [
  {
    id: "1",
    title: "Epic Adventure Series",
    excerpt: "A multi-part saga of courage and mystery.",
    date: "March 2025",
    image: "https://via.placeholder.com/400x200?text=Adventure",
  },
  {
    id: "2",
    title: "Short Stories",
    excerpt: "Bite-sized tales for quick reads.",
    date: "February 2025",
    image: "https://via.placeholder.com/400x200?text=Stories",
  },
  {
    id: "3",
    title: "Poetry Anthology",
    excerpt: "A collection of heartfelt poems.",
    date: "January 2025",
    image: "https://via.placeholder.com/400x200?text=Poetry",
  },
];

function Portfolio() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold font-poppins text-slate-800 mb-6">
        Your Portfolio
      </h1>

      {/* Portfolio Items */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Published Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dummyPortfolio.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              excerpt={item.excerpt}
              date={item.date}
              image={item.image}
              link={`/posts/${item.id}`} // Placeholder for future post links
            />
          ))}
        </div>
      </section>

      {/* Add New Work */}
      <section>
        <h2 className="text-xl font-semibold font-poppins text-slate-800 mb-4">
          Add New Work
        </h2>
        <Link
          to="/posts/new" // Placeholder for new post route
          className="inline-block bg-teal-600 text-white font-inter font-semibold py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
        >
          Create New Work
        </Link>
      </section>
    </div>
  );
}

export default Portfolio;
