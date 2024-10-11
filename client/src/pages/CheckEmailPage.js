import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CiUser } from "react-icons/ci";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const nevigate = useNavigate();

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

    const URL = `http://localhost:8080/api/email`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({
          email: "",
        });

        nevigate("/password", {
          state: response?.data.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("Error", error);
    }
    console.log("data", data);
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md my-2 rounded overflow-hidden p-4 md:mx-auto">
        <div className="w-fit mx-auto mb-2">
          <CiUser size={80} />
        </div>

        <h3>Welcome to Sync Talk!</h3>
        <form className="grid gap-3 mt-5" onSubmit={handelSubmit}>
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
          <button className="bg-black text-lg px-4 py-1 text-white rounded mt-2 font-bold">
            <input type="submit" value="lets gooo" />
          </button>
        </form>
        <p className="mt-2">
          Don't have an account?
          <Link
            to={"/register"}
            className="mt-4 font-semibold hover:underline "
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
