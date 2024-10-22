import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineArrowBackIos } from "react-icons/md";
import backgroundImage from "../assets/wallapaper.jpeg";
import { IoSend } from "react-icons/io5";
import moment from "moment";

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
    text: "",
  });

  const [allMessage, setAllMessage] = useState([]);

  const currentMessage = useRef();

  useEffect(() => {
    currentMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessage]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", params.userId);

      socketConnection.emit("seen", params.userId)

      socketConnection.on("messageUser", (data) => {
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("message", data);
        setAllMessage(data);
      });


    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handelSendMessage = async (e) => {
    e.preventDefault();
    if (message.text) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          messageBy: user?._id,
        });
        setMessage({
          text: "",
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
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
      <section className="flex-1 h-[calc(100vh-128px)] overflow-y-auto p-4">
        <div className="flex flex-col gap-4 py-2">
          {(allMessage || []).map((msg, index) => (
            <div ref={currentMessage}
              className={`flex ${
                user._id === msg.messageBy ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={` p-3 rounded-xl shadow-md ${
                  user._id === msg.messageBy
                    ? "bg-gray-300 text-black"
                    : "bg-slate-700 text-gray-300"
                }`}
              >
                <p className="">{msg.text}</p>
                <p className="text-xs ml-auto w-fit text-slate-500">
                  {moment(msg.createdAt).format("hh:mm A")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Send Message */}
      <section className="h-16 bg-white flex items-center p-4 shadow-md sticky bottom-0">
        <form
          className="h-full w-full flex items-center gap-5"
          onSubmit={handelSendMessage}
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="py-2 px-4 w-full text-base border border-gray-300 rounded-full focus:outline-none"
            value={message.text}
            onChange={handleOnChange}
          />
          <button type="submit" className="text-slate-700">
            <IoSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
