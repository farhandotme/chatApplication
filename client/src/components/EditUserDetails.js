import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    _id: user?._id,
    name: user?.user,
    profilePic: user?.profilePic,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        _id: user._id,
        name: user.name,        // Update these fields
        profilePic: user.profilePic,
      };
    });
  }, [user]);

  const handelOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handelOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handelUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData((preve) => {
      return {
        ...preve,
        profilePic: uploadPhoto?.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `http://localhost:8080/api/userUpdate`;
      const response = await axios({
        method: "post",
        url: URL,
        data,
        withCredentials: true,
      });
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response?.data?.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-4 py-6 rounded w-full max-w-sm ">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit User Details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="Name">Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter the Name you want to Update"
              value={data.name}
              onChange={handelOnchange}
              className="w-full py-1 px-2 border-2 border-slate-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="profilePic">
              Photo
              <div className="my-1 grid grid-cols-[40px, 1fr] gap-3">
                <Avatar
                  width={60}
                  height={60}
                  imageUrl={data.profilePic}
                  name={data.name}
                />

                <button
                  onClick={handelOpenUploadPhoto}
                  className="font-semibold bg-black text-white px-2 py-1 rounded "
                >
                  Change Photo
                </button>

                <input
                  type="file"
                  className="hidden"
                  onChange={handelUploadPhoto}
                  id="profilePic"
                  ref={uploadPhotoRef}
                />
              </div>
            </label>
          </div>

          <Divider />

          <div className="flex justify-content gap-3">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-2 py-1 border rounded hover:border-1 hover:border-red-500 hover:bg-white hover:text-red-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-1 border rounded hover:border-1 hover:border-green-600 hover:bg-white hover:text-green-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
