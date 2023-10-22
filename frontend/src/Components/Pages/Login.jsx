import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box,
 } from "@chakra-ui/react";


export const Login = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
      username: "",
      password: "",
    });
    const { username, password } = inputValue;
    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    };
  
    const handleError = (err) =>
      toast.error(err, {
        position: "bottom-left",
      });
    const handleSuccess = (msg) =>
      toast.success(msg, {
        position: "bottom-left",
      });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          "http://localhost:8000/login",
          {
            ...inputValue,
          },
          { withCredentials: true }
        );
        console.log(data);
        const { success, message ,role} = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            if (role === 'patient') {
              navigate('/');
            } else if (role === 'doctor') {
              navigate('/doctor-home');
            } else if (role === 'admin') {
              navigate('/admin-home');
            }
          }, 1000);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.log(error);
      }
      setInputValue({
        ...inputValue,
        username: "",
        password: "",
      });
    };
  
    return (
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Already have an account? <Link to={"/signup"}>Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
      // <>
      //   <Box display='flex' justifyContent={'center'} alignItems={'center'}>

      //   </Box>
      // </>
    );
};

