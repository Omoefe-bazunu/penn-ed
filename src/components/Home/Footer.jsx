export const Footer = () => {
  return (
    <div className="Footer w-full py-8 flex justify-center items-center ">
      <div className="FooterInner flex justify-center items-center gap-4 w-5/6">
        <a href="https://web.facebook.com/efe.bazunu/">
          <div className="socialIcons w-5 h-5 rounded-full">
            <i className="fa-brands fa-facebook text-white"></i>
          </div>
        </a>
        <a href="https://x.com/raniem57">
          <div className="socialIcons w-5 h-5 rounded-full">
            <i className="fa-brands fa-x-twitter text-white"></i>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/omoefe-bazunu-651b72203/">
          <div className="socialIcons w-5 h-5 rounded-full">
            <i className="fa-brands fa-linkedin-in text-white"></i>
          </div>
        </a>
      </div>
    </div>
  );
};
