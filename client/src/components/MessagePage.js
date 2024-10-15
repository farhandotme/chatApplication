import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";
import backgroundImage from "../assets/wallapaper.jpeg";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profilePic: "",
    online: false,
  });

  const [message, setMessage] = useState({
    text : "",

  });

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params.userId);

      socketConnection.on("messageUser", (data) => {
        setDataUser(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <div style={{backgroundImage : `url(${backgroundImage})`}} className="bg-no-repeat bg-cover">
      {/* Header section */}

      <header className="sticky top-0 h-16 bg-white flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-4">
          <Link to={"/"}>
            <MdOutlineArrowBackIos size={25} />
          </Link>
          <div className="flex items-center gap-4">
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profilePic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
            <div className="flex flex-col">
              <h3 className="font-medium">{dataUser?.name}</h3>
              <span
                className={`text-sm ${
                  dataUser?.online ? "text-green-500" : "text-red-500"
                }`}
              >
                {dataUser?.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <button className="hover:bg-slate-100 p-2 rounded-full">
            <BsThreeDotsVertical className="cursor-pointer" size={25} />
          </button>
        </div>
      </header>

      {/* Show all message Here */}

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll">
        {
          message.text ? (
            <div className="w-full h-full "></div>
          ) : null
        }
        <div className="w-full h-full ">

        </div>
      </section>

      {/* Send Message */}

      <section className="h-16 bg-white flex items-center p-4">
        Send Message
      </section>
    </div>
  );
};

export default MessagePage;
