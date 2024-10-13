import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/userSlice";
import SideBar from "../components/SideBar";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  console.log("redux user", user);

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: "http://localhost:8080/api/userDetails",
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        nevigate("/email");
      }
      console.log("Current User", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className="grid lg:grid-cols-[300px_1fr] h-screen max-h-screen">
      <section className="bg-white">
        <SideBar />
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
