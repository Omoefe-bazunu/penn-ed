// src/components/ui/Card.jsx
import { Link } from "react-router-dom";

function Card({ title, excerpt, author, date, image, link }) {
  return (
    <Link to={link}>
      <div className=" bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-xl font-semibold font-poppins text-slate-800 mb-2">
            {title}
          </h3>
          <p className="text-slate-600 font-inter text-sm mb-4 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex justify-between text-xs text-slate-500 font-inter">
            <span>{author}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
