import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react"
import { Flex, Image } from '@chakra-ui/react';
import AdminInfoCard from '../UI/AdminInfoCard';
import ShortcutsCard from "../UI/DoctorShortcuts";


export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };
    const handlePacks = () => {
        navigate("/admin-packs");
    };

  const handleUsers = () => {
      navigate("/admin-users");
  };

  const handleReqs = () => {
      navigate("/admin-requests");
  };

  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome Adminnnnn <span>{username}</span>
        </h4>
        <Stack>
          <button onClick={handlePacks}>Manage Packages</button>
          <button onClick={handleUsers}>Manage Users</button>
          <button onClick={handleReqs}> Manage Doctor Requests </button>
        </Stack>


        <AdminInfoCard
        title="Saba7 El Fol"
        username= {username}
        name="{name}"
        email="{email}"
      />

      <ShortcutsCard/>



        <button onClick={Logout}>LOGOUT</button>



      </div>
      <ToastContainer />
    </>
  );
};

export default AdminHome;