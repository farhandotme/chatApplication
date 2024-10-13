import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";

const SearchUser = () => {
  const [SearchUser, setSearchUser] = useState([]);
  const [loading, setloading] = useState(true);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-500 bg-opacity-30 p-2">
      <div className="w-full max-w-lg mx-auto mt-10 ">
        {/* Inmpt Search */}
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search Users"
            className="w-full outline-none py-1 h-full px-4 rounded "
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={28} />
          </div>
        </div>

        {/* Display Search User */}

        <div className="bg-white mt-2 w-full p-4 rounded">
          {/* No user found */}

          {SearchUser.length === 0 && !loading && (
            <p className="text-center text-slate-700">No user Found!</p>
          )}

          {loading && (
            <p>
              <Loading size={25} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
