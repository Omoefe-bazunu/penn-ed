import { Link } from "react-router-dom";

export const ErrorPage = () => {
  return (
    <div className=" flex flex-col justify-start items-start gap-2 bg-inherit">
      <p className=" text-white">
        Seems you stumbled to a wrong page. No probs
      </p>
      <Link to="/">
        <p className=" text-yellow-300 underline">Return to the Home Page</p>
      </Link>
    </div>
  );
};
