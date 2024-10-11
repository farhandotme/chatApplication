import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";
const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });
  const nevigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      nevigate("/email");
    }
  }, []);

  const handelOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `http://localhost:8080/api/checkPassword`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        nevigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("Error", error);
    }
    console.log("data", data);
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={80}
            height={80}
            imageUrl={location.state?.profilePic}
          />
          <h2 className="font-semibold text-lg mt-1 ">
            Welcome, {location.state?.name}
          </h2>
        </div>
        <form className="grid gap-3 mt-5" onSubmit={handelSubmit}>
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
          <button className="bg-black text-lg px-4 py-1 text-white rounded mt-2 font-bold">
            <input type="submit" value="Login" />
          </button>
        </form>
        <p className="mt-2">
          <Link
            to={"/register"}
            className="mt-4 font-semibold hover:underline "
          >
            Forgot Password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
