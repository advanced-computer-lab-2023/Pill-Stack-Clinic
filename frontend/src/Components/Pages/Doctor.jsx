import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import DoctorShortcuts from "../UI/DoctorShortcuts";
import DoctorInfoCard from "../UI/DoctorInfoCard";
import WithSubnavigation from "../UI/navbar";


export const Doctor = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [doctorData, setDoctorData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post("http://localhost:8000", {}, { withCredentials: true });
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();

    // Fetch the doctor's data
    const getDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/doctor/profile", {
          withCredentials: true,
        });
        setDoctorData(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    getDoctorData();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    // Check if doctorData is not null and log it
    if (doctorData !== null) {
      console.log("Doctor Data:", doctorData);
    }
  }, [doctorData]);

  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };

  const handleChangePass = async () => {
    const oldPassword = document.querySelector('#oldPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const confirmNewPassword = document.querySelector('#confirmNewPassword').value;
  
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords dont match', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/changePassword', data, {
        withCredentials: true,
      });
  
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error(response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Log the detailed error response for debugging
      if (error.response) {
        console.error('Response Data:', error.response.data);
        toast.error(error.response.data.message, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <>
      <WithSubnavigation username={doctorData.Name} onOpenModal={onOpen} onLogout={Logout} />
      <div className="home_page" style={{ background: "linear-gradient(45deg, #1E9AFE, #60DFCD)" }}>
        <h4>
          Welcome Docc {doctorData[0]?.Email} <span>{username}</span>
        </h4>
        <Flex>
          <Box style={{ margin: "0 10px", flex: 1 }}>
            <DoctorInfoCard
              title={`Masa2 el anwar ya ${username}`}
              username={doctorData.Username}
              name={doctorData.Name}
              email={doctorData.Email}
              DateOfBirth={doctorData.DateOfBirth}
              HourlyRate={doctorData.HourlyRate}
              affiliation={doctorData.Affiliation}
              EducationalBackground={doctorData.EducationalBackground}
              WalletBalance={doctorData.WalletBalance}
              id={doctorData._id}
            />
          </Box>

          <Box style={{ margin: "0 10px", flex: 1 }}>
            <DoctorShortcuts style={{ height: "100%" }} />
          </Box>
        </Flex>

        

        {/* <DrawerExample isOpen={true} /> Set isOpen prop to true */}
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <Input id="oldPassword" type="password" ref={initialRef} placeholder="Old Password" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>New Password</FormLabel>
                <Input id="newPassword" type="password" placeholder="New Password" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input id="confirmNewPassword" type="password" placeholder="Confirm New Password" />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleChangePass} colorScheme="blue" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

export default Doctor;
