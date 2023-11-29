import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex,
  Input,
  Button,
  Text,

 } from "@chakra-ui/react";
 import '../../index.css'


export const Login = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
      username: "",
      password: "",
    });
    const { username, password } = inputValue;

  
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
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;
      try {
        const { data } = await axios.post(
          "http://localhost:8000/login",
          {
            username: user,
            password: pass,
          },
          { withCredentials: true }
        );
        console.log(data);
        const { success, message ,role} = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            if (role === 'patient') {
              navigate('/home');
            } else if (role === 'doctorContractSigned') {
              navigate('/doctor-home');
            } else if (role === 'admin') {
              navigate('/admin-home');
            }else if(role === 'doctorContractUnSigned'){
              navigate('/Unsigned-doctor-home');
            }else if (role === 'pharmacist') { 
              navigate('/pharma-home');
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
  
    return ( <>
      <Box display='flex' justifyContent={'center'} alignItems={'center'} flexDirection={'column'}
        w={'100%'} h={'100%'} height='100vh' className="gradBG">
        
        <Box bg={'#4bbbf3'} p={50} rounded={10} display='flex' justifyContent={'center'} alignItems={'center'} flexDirection={'column'} 
          boxShadow={'2xl'}>
          <Text fontSize={'5xl'} color={'black'} textAlign={'center'}>Login</Text>
          <Flex p={5}>
            <Box display="flex" alignItems="center">
              <Text fontSize={'2xl'} mr={2}>Username</Text>
              <Input placeholder="Username" id={'username'} />
            </Box>
          </Flex>
          <Flex p={5}>
            <Box display="flex" alignItems="center">
              <Text fontSize={'2xl'} mr={2}>Password</Text>
              <Input placeholder="Password" id={'password'} type="password" />
            </Box>
          </Flex>
  
          <Button size="lg" bg={'grey'} m={5} onClick={handleSubmit}>
              Login
          </Button>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Text mt={2}>Don't have an account?</Text>
          <Link to="/patient-register">Register as Patient</Link>
          
          
          <Link to="/doctor-register">Register as Doctor</Link>
          <Link to="/pharmacist-register">Register as a Pharmacist</Link>


        </Box>
        
      </Box>
      <ToastContainer />
      </> ); 
};