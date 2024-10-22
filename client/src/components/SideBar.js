import React, { useEffect, useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { TiUserAdd } from "react-icons/ti";
import { TbLogout2 } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";

const SideBar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navgate = useNavigate();

  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handelLogout = () => {
    dispatch(logout());
    navgate("/email");
    localStorage.clear();
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slade-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-700 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
          >
            <IoMdChatbubbles size={25} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="Add Friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <TiUserAdd size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profilePic}
              userId={user?._id}
            />
          </button>

          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="Logout"
            onClick={handelLogout}
          >
            <span className="-ml-1">
              <TbLogout2 size={25} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center ">
          <h2 className="text-xl font-bold p-4 ">Messages</h2>
        </div>

        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto">
          {allUser.length === 0 && (
            <div className="mt-20">
              <p className="text-lg text-center text-slate-700">
                Explore users to start New Conversation
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            console.log("User Details:", conv?.userDetails);
            return (
              <NavLink
                to={`/${conv.userDetails?._id}`}
                className="flex items-center gap-3 p-4 hover:bg-slate-200 cursor-pointer"
                key={conv?._id}
              >
                {/* Avatar */}
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profilePic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>

                {/* User Details */}
                <div className="flex-1 overflow-hidden">
                  <h1 className="text-lg font-bold">
                    {conv?.userDetails?.name}
                  </h1>

                  {/* Last Message (Truncated) */}
                  <p className="text-sm text-gray-600 truncate max-w-[180px]">
                    {conv?.lastMsg?.text}
                  </p>
                </div>

                {/* Unseen Messages */}
                {conv?.unSeenMsg > 0 && (
                  <div className="ml-2 flex items-center justify-center">
                    <p className="text-white bg-black rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {conv?.unSeenMsg}
                    </p>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Edit User Details */}

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search user */}

      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default SideBar;
