import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import UnsignedDoctorShortcuts from "../UI/UnsignedDoctorShortcuts";
import DoctorInfoCard from "../UI/DoctorInfoCard";
import WithSubnavigation from "../UI/navbar";
import { Link } from "react-router-dom";
import '../UI/Styles/home.css';
import RR from './RR'
import SidebarDRU from './sideDRU';
import { ChatIcon, Icon, EmailIcon,PhoneIcon,BellIcon,EditIcon } from "@chakra-ui/icons";


export const UnsignedDoctor = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [doctorData, setDoctorData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("one");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email: doctorData.Email,
    HourlyRate: doctorData.HourlyRate,
    Affiliation: doctorData.Affiliation,
  });


  const handleRatingTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };


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
     <div style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '1000'}}>

<WithSubnavigation
  username={doctorData.Name}
  onOpenModal={onOpen}
  onLogout={Logout}
  notifications={doctorData.Notifications}
  mb={5}
/>
</div>
      <SidebarDRU/>
      <div className="home_page">
      <div className="home_page_content" >
        {/* <h4>
          Welcome Unsigned Docc {doctorData[0]?.Email} <span>{username}</span>
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
            <UnsignedDoctorShortcuts style={{ height: "100%" }} />
          </Box>
        </Flex>

        <button onClick={Logout}>LOGOUT</button> */}

<div className="BigContainer">
          <div className="Container1">
            <Box className="boxW" >
               <div className="boxT">Wallet</div>
               <div className="square">$</div>
                <div className="balance">{`$ ${doctorData.WalletBalance}`}</div>
                <div className="square2">Total Balance</div>
            </Box>
            <Box className="box1" >
              <div className="boxT">Information</div>
            <div className="line">
              <EmailIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Email:  ${doctorData.Email}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Mobile:  ${doctorData.HourlyRate}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 18px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Emergency Mobile:  ${doctorData.Affiliation}`}</div>
            </div>
            </Box>

            {/* <div className="line" style={{ marginTop: '0px' }}>
          <BellIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
          <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-45px)' }}>
            {doctorData.Notifications && doctorData.Notifications.length > 0 ? `${doctorData.Notifications[0]}` : "None"}
          </div>
        </div>

        <div className="line" style={{ marginTop: '-50px'}}>
          <BellIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
          <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-45px)' }}>
            {doctorData.Notifications && doctorData.Notifications.length > 1 ? `${doctorData.Notifications[1]}` : "None"}
          </div>
        </div> */}


    
          </div>

          
          <div className="Container2">
            <Box className="box3" ></Box>
            {/* {doctorData.Gender && (doctorData.Gender.toLowerCase() === 'male' ? (
              <Box className="ppM" ></Box>
            ) : doctorData.Gender.toLowerCase() === 'female' ? (
              <Box className="ppF" ></Box>
            ) : (
              <Box className="ppM"></Box>
            ))} */}
            <Box className="ppM"></Box>
            <Box className="Details" style={{ overflow: 'hidden' }}>
            <Box style={{ textAlign: 'center' }}>{doctorData.Name}</Box>
              <Box className="GenderB">
              {/* {doctorData.Gender && (doctorData.Gender.toLowerCase() === 'male' ? (
                <Box className="Male">
                  Male
                </Box>
              ) : doctorData.Gender.toLowerCase() === 'female' ? (
                <Box className="Female">
                  Female
                </Box>
              ) : (
                <Box className="Male"> 
                  Male
                </Box>
              ))} */}

                <Box className="Male"> 
                  Doctor
                </Box>
            </Box>
            <Box className='infoI' style={{ transform: 'translate(-30%, 395%)' }}>
              Username
            </Box>
            <Box className="RoundBox" style={{ marginTop: '5px' }}>
            {doctorData.Username}
            </Box>
            {selectedTab === 'one' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-35%, 750%)' , textAlign: 'center' }}>
            Email
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {doctorData.Email}
          </Box>
        </div>
      )}
            {selectedTab === 'two' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Date Of Birth
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {doctorData.DateOfBirth}
          </Box>
        </div>
      )}

      {selectedTab === 'three' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-17%, 750%)' }}>
          Educational Background
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {doctorData.EducationalBackground}
          </Box>
        </div>
      )}

      {selectedTab === 'four' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-31%, 750%)' }}>
            Affiliation
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {doctorData.Affiliation}
          </Box>
        </div>
      )}
      {selectedTab === 'five' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Hourly Rate
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {doctorData.HourlyRate}
          </Box>
        </div>
      )}
      <Box style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>More</Box>

<RR onRatingTabClick={handleRatingTabClick} setSelectedTab={setSelectedTab} style={{ marginTop: '-10px',transform: 'translate(-35%, 345%)' }}></RR>

            </Box>
            
          </div>
          <div className="Container3">
          <Link to="contract" className="box2c" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Contract</Link>



            <Box className="box2x" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Locked</Box>



            
            <Box className="box2x" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Locked</Box>

          </div>
        </div>













      
       </div>

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

export default UnsignedDoctor;
