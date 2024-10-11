import { useEffect, useState } from "react";
import { storage } from "../../Firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { dbase } from "../../Firebase";

export const SideBar = () => {
  const [adsData, setAdsData] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const adsCollectionRef = collection(dbase, "ads");
      const querySnapshot = await getDocs(adsCollectionRef);
      const ads = [];
      querySnapshot.forEach((doc) => {
        ads.push({ id: doc.id, data: doc.data() });
      });
      setAdsData(ads);
    };
    fetchAds();
  }, []);

  return (
    <div className="sideBar w-96 h-fit rounded-md px-4 py-5">
      <div className="ads w-full h-fit flex flex-col justify-start mt-8">
        <p className="  text-white text-center text-sm">SPONSORED ADS</p>
        <p className="border-b-2 pb-1 border-white text-orange-300 text-center text-xs w-full mb-5">
          - Click the Image -{" "}
        </p>
        <div className="adsbox flex flex-col justify-start items-center gap-5 h-full">
          {adsData.map((ad) =>
            ad.data &&
            ad.data.ads.some((individualAd) => individualAd.imageurl) ? (
              <div key={ad.id} className="ad-card">
                {ad.data.ads.map(
                  (individualAd, index) =>
                    individualAd.imageurl && ( // Check for imageurl before rendering
                      <a
                        key={index}
                        className="ad relative cursor-pointer"
                        href={individualAd.link}
                        // target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={individualAd.imageurl}
                          alt="Ad Image"
                          className=" w-full"
                        />
                        <p className=" absolute bottom-0 bg-secondary text-white text-xs py-2 px-2 ">
                          Ad {index + 1}
                        </p>
                      </a>
                    )
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
