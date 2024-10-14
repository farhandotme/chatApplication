import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MessagePage = () => {

  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);

  useEffect(() => {
    if(socketConnection) {
      socketConnection.emit("messagePage", params.userId)

      socketConnection.on("messageUser", (data) => {
        console.log("data", data)
      })
    }
  }, [socketConnection, params?.userId])
  
  return (
    <div>
      <h1>MessagePage</h1>
    </div>
  );
};

export default MessagePage;
