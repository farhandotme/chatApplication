import React from "react";
import { CiUser } from "react-icons/ci";

const Avatar = ({ userId, name, imageUrl, width = 100, height = 100 }) => {
  return (
    <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
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
        <CiUser size={width} />
      )}
    </div>
  );
};

export default Avatar;
