import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import logo from "../assets/logo.png";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const loaction = useLocation();

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: "http://localhost:8080/api/userDetails",
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        nevigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = loaction.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px_1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <SideBar />
      </section>

      {/* Message component */}

      <section className={`${basePath && "hidden"}`}>
        <Outlet />Select User to Send Message
      </section>

      <div className="lg:flex justify-center items-center flex-col gap-2 hidden">
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>

        <p className="text-lg mt-2 text-slate-700">Select User to Send Message</p>
      </div>
    </div>
  );
};

export default Home;
