import React from "react";
import { PiUserCircleLight } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width = 100, height = 100 }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUsers);

  const isOnline = onlineUser.includes(userId);

  return (
    <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="rounded-full overflow-hidden object-cover"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      ) : (
        <PiUserCircleLight size={width} />
      )}

      {isOnline && (
        <div className="bg-green-700 w-3 h-3 rounded-full absolute bottom-0 right-0 "></div>
      )}
    </div>
  );
};

export default Avatar;
