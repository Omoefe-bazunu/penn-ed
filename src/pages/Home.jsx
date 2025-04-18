// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Card from "../components/ui/card";

// Dummy data for featured posts
const dummyPosts = [
  {
    id: "1",
    title: "The Art of Storytelling",
    excerpt:
      "Discover how to craft compelling narratives that captivate readers.",
    author: "Richard Owhere",
    date: "April 10, 2025",
    image: "story.jpg",
  },
  {
    id: "2",
    title: "Poetry in Motion",
    excerpt: "Explore the beauty of words through modern poetry techniques.",
    author: "Marvellous Agwu",
    date: "April 8, 2025",
    image: "poem.jpg",
  },
  {
    id: "3",
    title: "Writing for Impact",
    excerpt:
      "Learn to create content that resonates with your audience and speaks to their emotions",
    author: "Blessed Oluwaseyi",
    date: "April 5, 2025",
    image: "wrting.jpg",
  },
];

function Home() {
  return (
    <div className="bg-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-400 text-white py-20 ">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
            Penned
          </h1>
          <p className="text-lg md:text-xl font-inter mb-8 max-w-2xl mx-auto">
            Share your stories, build your portfolio, connect with writers, and
            grow your craft in a vibrant community.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-teal-600 font-inter font-semibold py-3 px-6 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-poppins text-slate-800 mb-8 text-center">
            Hub of Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyPosts.map((post) => (
              <Card
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                date={post.date}
                image={post.image}
                link={`#`}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/posts"
              className="inline-block text-teal-600 font-inter font-semibold hover:underline"
            >
              Explore All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-poppins mb-4">
            Join Our Community
          </h2>
          <p className="text-lg font-inter mb-8 max-w-xl mx-auto">
            Whether you are a seasoned writer or just starting, our platform
            offers tools, inspiration, and connections to elevate your work.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-teal-600 text-white font-inter font-semibold py-3 px-6 rounded-lg hover:bg-teal-500 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
