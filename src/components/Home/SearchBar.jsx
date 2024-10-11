// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     navigate(`/search?q=${searchTerm}`);
//   };

//   const handleChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <form className="flex flex-col gap-3 justify-start items-center w-full">
//       <input
//         type="search"
//         value={searchTerm}
//         onChange={handleChange}
//         placeholder="Search by title or author"
//         className="bg-slate-100 outline-none py-2 px-3 rounded-md w-full"
//       />
//       <hr className=" w-full h-0.5 bg-white" />
//       <button type="button" onClick={handleSearch}>
//         Search
//       </button>
//     </form>
//   );
// };

// export default SearchBar;
