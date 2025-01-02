import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { dbase } from "../../../Firebase";
import { Link } from "react-router-dom";

export const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSeries, setExpandedSeries] = useState({});
  const [lastVisible, setLastVisible] = useState(null); // Keeps track of last fetched document
  const [hasMore, setHasMore] = useState(true); // Determines if there's more data to load

  const ITEMS_PER_PAGE = 5; // Number of series to load per page

  const toggleSeries = (seriesTitle) => {
    setExpandedSeries((prevState) => ({
      ...prevState,
      [seriesTitle]: !prevState[seriesTitle],
    }));
  };

  const contentStyle = (isSeriesExpanded) => ({
    maxHeight: isSeriesExpanded ? "unset" : "0",
    overflow: isSeriesExpanded ? "visible" : "hidden",
    transition: "max-height 0.3s ease-in-out",
  });

  const fetchSeriesData = async () => {
    try {
      setIsLoading(true);
      let q;

      if (lastVisible) {
        q = query(
          collection(dbase, "series"),
          orderBy("seriesTitle"),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        q = query(
          collection(dbase, "series"),
          orderBy("seriesTitle"),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const fetchedData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const seriesTitle = data.seriesTitle;
        const episode = data;

        const existingSeries = fetchedData.find(
          (series) => series.title === seriesTitle
        );
        if (existingSeries) {
          existingSeries.episodes.push(episode);
        } else {
          fetchedData.push({ title: seriesTitle, episodes: [episode] });
        }
      });

      // Add new data while avoiding duplicates
      setSeriesData((prevData) => {
        const titles = new Set(prevData.map((series) => series.title));
        const filteredData = fetchedData.filter(
          (series) => !titles.has(series.title)
        );
        return [...prevData, ...filteredData];
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching series data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeriesData();
  }, []);

  return (
    <div className="w-full h-fit rounded-md flex justify-start gap-3 flex-col">
      {isLoading && seriesData.length === 0 ? (
        <div className="loading-spinner w-32 h-32 pulsate-fwd rounded-full mx-auto p-5 bg-secondary flex justify-center items-center text-white text-sm">
          Loading...
        </div>
      ) : (
        <div className="text-white w-5/6 mx-auto">
          <div className="header w-full border-b-2 border-white h-fit p-4 text-white text-xl items-center flex">
            SERIES: Multiple Episodes
          </div>
          {seriesData.map((series) => (
            <div key={series.title} className="my-8 py-0 relative">
              <h2 className="bg-tet px-5 py-2 rounded">{series.title}</h2>
              <div className="w-full flex flex-row justify-end items-center">
                <button
                  className="expand-button absolute top-1 right-4"
                  onClick={() => toggleSeries(series.title)}
                >
                  {!expandedSeries[series.title] ? (
                    <p className="text-2xl text-white">+</p>
                  ) : (
                    <p className="text-3xl text-white">-</p>
                  )}
                </button>
              </div>
              <div style={contentStyle(expandedSeries[series.title])}>
                {series.episodes.map((episode) => (
                  <Link
                    key={episode.episodeTitle}
                    to={`/Series/${episode.eId}`}
                  >
                    <div className="bg-tet my-2 px-5 py-6 rounded">
                      <p className="mb-2 border-b-2 border-slate-300 pb-2">
                        {episode.episodeTitle}
                      </p>
                      <div className="author text-xs">
                        Author: {episode.authorName}
                      </div>
                      <p className="postBody text-white whitespace-pre-wrap text-sm my-4">
                        {episode.body.slice(0, 200)} ...
                      </p>
                      <p className="text-yellow-300 text-sm mt-2 mb-4">
                        Read Full Content ...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={fetchSeriesData}
              className="load-more-button my-4 py-2 px-4 bg-tet text-white rounded"
            >
              {isLoading ? "Loading..." : "Load More Series"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
