import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";


const SearchUser = ({onClose}) => {
  const [SearchUser, setSearchUser] = useState([]);
  const [loading, setloading] = useState(false);
  const [search, setSearch] = useState("");
  const handelSearchUser = async (e) => {
    const URL = `http://localhost:8080/api/searchUser`;
    try {
      setloading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setloading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handelSearchUser();
  }, [search]);

  console.log("SearchUser", SearchUser);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-500 bg-opacity-30 p-2">
      <div className="w-full max-w-lg mx-auto mt-10 ">
        {/* Input Search */}
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search Users"
            className="w-full outline-none py-1 h-full px-4 rounded "
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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

          {SearchUser.length !== 0 &&
            !loading &&
            SearchUser.map((user, index) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose}/>
            ))}
        </div>
      </div>
      <div>
        <MdOutlineClose
          size={25}
          className="absolute top-2 right-2 cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default SearchUser;
