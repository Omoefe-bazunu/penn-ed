import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { dbase } from "../../Firebase";

export const Messages = () => {
  const [message, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(dbase, "messages"),
        orderBy("createdAt", "desc")
      );
      onSnapshot(q, async (snapshot) => {
        const messages = [];
        for (const doc of snapshot.docs) {
          const messageItem = { ...doc.data(), id: doc.id };
          messageItem.formattedDate = formatDate(
            messageItem.createdAt.toDate()
          );
          messages.push(messageItem);
        }
        setMessages(messages);
      });
    };

    fetchMessages();
  }, []);

  // Helper function to format date
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];
    const year = date.getFullYear();
    return `${day} ${monthName}, ${year}`;
  };

  return (
    <div className="MessagesWrapper w-5/6 h-fit gap-4">
      <div className="message-inner w-full h-fit rounded-md flex  gap-3 flex-col">
        <div className="header W-full h-fit rounded-md py-4 px-5 text-white font-bold text-2xl">
          Messages
        </div>
        {message &&
          message.map((message) => (
            <div
              key={message.id}
              className="messages w-full h-fit py-5 px-5 mb-5"
            >
              <h2 className=" text-lg text-yellow-300 text-wrap leading-2">
                {message.name}
              </h2>
              <div className="author text-white">{message.formattedDate} </div>
              <p className=" text-white text-sm">{message.senderEmail}</p>
              <p className="postBody text-white whitespace-pre-wrap mt-2">
                {message.message}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
