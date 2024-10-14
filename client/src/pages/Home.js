import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import logo from "../assets/logo.png";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("user ", user)

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: "http://localhost:8080/api/userDetails",
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Socket Connection

  useEffect(() => {
    const socketConnection = io(`http://localhost:8080`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data))
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px_1fr] h-screen max-h-screen">
      {/* Sidebar Section */}
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <SideBar />
      </section>

      {/* Message Component */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      {/* Logo and Message Section */}
      {basePath && (
        <div className="justify-center items-center flex-col gap-2 hidden lg:flex">
          <div>
            <img src={logo} width={250} alt="logo" />
          </div>

          <p className="text-lg mt-2 text-slate-700">
            Select User to Send Message
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
