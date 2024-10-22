import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { dbase } from "../../../Firebase";
import { Link } from "react-router-dom";

export const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSeries, setExpandedSeries] = useState({}); // Object to store expanded series titles

  const toggleSeries = (seriesTitle) => {
    setExpandedSeries({
      ...expandedSeries,
      [seriesTitle]: !expandedSeries[seriesTitle],
    });
  };

  const contentStyle = (isSeriesExpanded) => ({
    maxHeight: isSeriesExpanded ? "unset" : "0",
    overflow: isSeriesExpanded ? "visible" : "hidden",
    transition: "max-height 0.3s ease-in-out",
  });

  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        const q = query(collection(dbase, "series"), orderBy("seriesTitle"));
        const querySnapshot = await getDocs(q);
        const seriesData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const seriesTitle = data.seriesTitle;

          // Find or create a series object in seriesData
          const existingSeries = seriesData.find(
            (series) => series.title === seriesTitle
          );
          if (existingSeries) {
            existingSeries.episodes.push(data);
          } else {
            seriesData.push({ title: seriesTitle, episodes: [data] });
          }
        });

        setSeriesData(seriesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching series data:", error);
      }
    };

    fetchSeriesData();
  }, []);

  return (
    <div className=" w-full h-fit rounded-md flex justify-start gap-3 flex-col">
      {isLoading ? (
        <div className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm">
          {" "}
          Loading...
        </div>
      ) : (
        <div className=" text-white w-5/6  mx-auto">
          <div className="header w-full border-b-2 border-white h-fit py-4  text-white text-xl items-center flex">
            SERIES: Multiple Episodes
          </div>
          {seriesData.map((series) => (
            <div key={series.title} className=" my-8 py-0 relative">
              <h2 className="bg-tet px-5 py-2 rounded">{series.title}</h2>
              <div className=" w-full flex flex-row justify-end items-center">
                <button
                  className="expand-button absolute top-1 right-4"
                  onClick={() => toggleSeries(series.title)}
                >
                  {!expandedSeries[series.title] && (
                    <p className=" text-2xl text-white">+</p>
                  )}
                  {expandedSeries[series.title] && (
                    <p className=" text-3xl text-white">-</p>
                  )}
                </button>
              </div>
              <div style={contentStyle(expandedSeries[series.title])}>
                {series.episodes.map((episode) => (
                  <Link
                    key={episode.episodeTitle}
                    to={`/Series/${episode.eId}`}
                  >
                    <div className=" bg-tet my-2 px-5 py-6 rounded">
                      {" "}
                      <p className=" mb-2 border-b-2 border-slate-300 pb-2">
                        {episode.episodeTitle}
                      </p>
                      <div className="author text-xs">
                        Author: {episode.authorName} {episode.eId}
                      </div>
                      <p className="postBody text-white whitespace-pre-wrap text-sm my-4">
                        {episode.body.slice(0, 200)} ...
                      </p>
                      <p className=" text-yellow-300 text-sm mt-2 mb-4">
                        Read Full Content ...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
