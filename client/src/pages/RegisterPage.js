import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState();

  const handelOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handelUploadPhoto = (e) => {
    const file = e.target.files[0];
    setUploadPhoto(file);
  };

  const handelClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("data", data);
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm my-2 rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Sync Talk!</h3>
        <form className="grid gap-3 mt-5" onSubmit={handelSubmit}>
          {/* NAME */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Your Name"
              className="bg-slate-100 px-2 py-1"
              value={data.name}
              onChange={handelOnChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              className="bg-slate-100 px-2 py-1"
              value={data.email}
              onChange={handelOnChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              className="bg-slate-100 px-2 py-1"
              value={data.password}
              onChange={handelOnChange}
              required
            />
          </div>

          {/* PROFILE PIC */}
          <div className="flex flex-col gap-1">
            <label htmlFor="profilePic">
              Profile Pic
              <div className="h-14 cursor-pointer bg-slate-200 flex justify-center items-center rounded hover:bg-slate-300">
                <p className="text-sm max max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto
                    ? uploadPhoto.name
                    : uploadPhoto
                    ? uploadPhoto?.name
                    : "Upload Profile Picture"}
                </p>
                {uploadPhoto && uploadPhoto.name && (
                  <buttion
                    className="text-lg ml-2 hover:text-red-500"
                    onClick={handelClearUploadPhoto}
                  >
                    <IoCloseSharp />
                  </buttion>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              className="bg-slate-100 px-2 py-1 hidden"
              onChange={handelUploadPhoto}
            />
          </div>
          <button className="bg-black text-lg px-4 py-1 text-white rounded mt-2 font-bold">
            <input type="submit" value="Register" />
          </button>
        </form>
        <p className="mt-2">
          Already have an account?
          <Link to={"/email"} className="mt-4 font-semibold hover:underline ">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;