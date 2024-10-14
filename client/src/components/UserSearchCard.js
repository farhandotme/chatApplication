import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";


const UserSearchCard = ({ user ,onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className="flex items-center p-4 rounded-lg gap-3 lg-p-4 border border-transparent border-b-slate-200 hover:bg-slate-200 hover:rounded cursor-pointer ">
      {/* Avatar Section */}
      <div className="mr-4">
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          profilePic={user?.profilePic}
          userId={user?._id}
          
        />
      </div>

      {/* User Information Section */}
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">{user.name || "Unknown User"}</div>
        <p className="text-slate-700 text-sm text-ellipsis line-clamp-1">{user.email || "No Email Provided"}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
