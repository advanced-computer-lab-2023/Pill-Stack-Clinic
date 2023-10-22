import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
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
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };
    const handlePacks = () => {
        navigate("/admin-packs");
    };
  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome Adminnnnn <span>{username}</span>
        </h4>
        <button onClick={handlePacks}>Manage Packages</button>




        <button onClick={Logout}>LOGOUT</button>



      </div>
      <ToastContainer />
    </>
  );
};

export default AdminHome;