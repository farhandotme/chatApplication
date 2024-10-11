import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const fetchUserDetails = async () => {
    try {
      const { data: response } = await axios({
        url: "http://localhost:8080/api/userDetails",
        withCredentials: true,
      });
      console.log("Current User", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div>
      <h1>Home page</h1>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
