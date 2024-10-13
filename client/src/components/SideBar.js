import React, { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { TiUserAdd } from "react-icons/ti";
import { TbLogout2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";

const SideBar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  return (
    <div className="w-full h-full">
      <div className="bg-slade-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-700 flex flex-col justify-between">
        <div>
          <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title="Chat">
            <IoMdChatbubbles size={25} />
          </NavLink>
          <div className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded" title="Add Friend">
            <TiUserAdd size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button className="mx-auto" title={user?.name} onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={40}
              height={40}
              name = {user?.name}
              imageUrl={user?.profilePic}

            />
          </button>

          <button className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded" title="Logout">
            <span className="-ml-1">
            <TbLogout2 size={25} />
            </span>
          </button>
        </div>
      </div>  


      {/* Edit User Details */}

      {
        editUserOpen &&  (
          <EditUserDetails onClose={() => setEditUserOpen(false)} user={user}/>
        )
      }
    </div>
  );
};

export default SideBar;
