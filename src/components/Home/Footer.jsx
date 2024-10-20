import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className="Footer w-full py-8 flex justify-center items-center  flex-col">
      <div className="FooterInner flex justify-center items-center gap-4 w-5/6">
        <a href="https://web.facebook.com/efe.bazunu/" target="_blank">
          <div className="socialIcons button w-8 h-8 flex justify-center items-center rounded-full bg-white">
            <FaFacebookF />
          </div>
        </a>
        <a href="https://x.com/raniem57" target="_blank">
          <div className="socialIcons button w-8 h-8 flex justify-center items-center bg-white rounded-full">
            <FaXTwitter />
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/omoefe-bazunu-651b72203/"
          target="_blank"
        >
          <div className="socialIcons button w-8 h-8 flex justify-center items-center bg-white rounded-full">
            <FaLinkedinIn />
          </div>
        </a>
      </div>
      <p className="text-xs text-white text-center w-full mt-4 leading 6">
        Designed By: HIGH-ER ENTERPRISES <br /> +2349043970401
      </p>
    </div>
  );
};
