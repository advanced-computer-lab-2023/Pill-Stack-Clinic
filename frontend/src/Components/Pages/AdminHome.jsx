import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Box, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import AdminShortcuts from "../UI/AdminShortcuts";
import AdminInfoCard from "../UI/AdminInfoCard";
import WithSubnavigation from "../UI/navbar";
import { Link } from "react-router-dom";
import { ChatIcon, Icon, EmailIcon,PhoneIcon,BellIcon } from "@chakra-ui/icons";
import '../UI/Styles/home.css';
import RR from './RR'
import SidebarAdmin from './sideAdmin';


export const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [adminData, setadminData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("one");

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

    // Fetch the admin's data
    const getadminData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/profile", {
          withCredentials: true,
        });
        setadminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    getadminData();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    // Check if adminData is not null and log it
    if (adminData !== null) {
      console.log("admin Data:", adminData);
    }
  }, [adminData]);

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
        onClose();
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
      <WithSubnavigation username={adminData.Username} onOpenModal={onOpen} onLogout={Logout} />
      <SidebarAdmin
      />
      </div>
      <div className="home_page">
      <div className="home_page_content" >
        {/* <h4>
          Welcome Admin {adminData[0]?.Email} <span>{username}</span>
        </h4>
        <Flex>
          <Box style={{ margin: "0 10px", flex: 1 }}>
            <AdminInfoCard
              title={`Masa2 el anwar ya ${username}`}
              username={adminData.Username}
              name={adminData.Username}
              email={adminData.Email}
            />
          </Box>

          <Box style={{ margin: "0 10px", flex: 1 }}>
            <AdminShortcuts style={{ height: "100%" }} />
          </Box>
        </Flex> */}

        {/* <DrawerExample isOpen={true} /> Set isOpen prop to true */}

        <div className="BigContainer">
          <div className="Container1">
            <Box className="boxW" >
               <div className="boxT">Wallet</div>
               <div className="square">$</div>
                <div className="balance">Private Account</div>
                <div className="square2">Total Balance</div>
            </Box>
            <Box className="box1" >
              <div className="boxT">Information</div>
            <div className="line">
              <EmailIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Email:  ${adminData.Email}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Mobile: Private Number`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 18px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Emergency Mobile: Private Number`}</div>
            </div>
            </Box>

            <Box className="boxL1" >
            {/* <div className="boxT">Recent</div> */}
            <Link to="pharmaRequests" className="box23" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Pharmacists Requests</Link>
            <Link to="/medicineControl" className="box24"style={{ color: '#4C4C4C', textDecoration: 'none' }} >Medicine Control</Link>
            
            </Box>
          </div>

          
          <div className="Container2">
            <Box className="box3" ></Box>
            {/* {adminData.Gender && (adminData.Gender.toLowerCase() === 'male' ? (
              <Box className="ppM" ></Box>
            ) : adminData.Gender.toLowerCase() === 'female' ? (
              <Box className="ppF" ></Box>
            ) : (
              <Box className="ppM"></Box>
            ))} */}
            <Box className="ppF"></Box>
            <Box className="Details" style={{ overflow: 'hidden' }}>
            <Box style={{ textAlign: 'center' }}>{adminData.Username}</Box>
              <Box className="GenderB">
              {/* {adminData.Gender && (adminData.Gender.toLowerCase() === 'male' ? (
                <Box className="Male">
                  Male
                </Box>
              ) : adminData.Gender.toLowerCase() === 'female' ? (
                <Box className="Female">
                  Female
                </Box>
              ) : (
                <Box className="Male"> 
                  Male
                </Box>
              ))} */}

                <Box className="Male"> 
                  Admin
                </Box>
            </Box>
            <Box className='infoI' style={{ transform: 'translate(-30%, 395%)' }}>
              Username
            </Box>
            <Box className="RoundBox" style={{ marginTop: '5px' }}>
            {adminData.Username}
            </Box>
            {selectedTab === 'one' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-35%, 750%)' , textAlign: 'center' }}>
            Email
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {adminData.Email}
          </Box>
        </div>
      )}
            {selectedTab === 'two' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Date Of Birth
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {adminData.DateOfBirth}
          </Box>
        </div>
      )}

      {selectedTab === 'three' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-16%, 750%)' }}>
            Emergency Contact Name
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {adminData.EmergencyContact_Name}
          </Box>
        </div>
      )}

      {selectedTab === 'four' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-25%, 750%)' }}>
            Delivery Address
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {adminData.DeliveryAddress}
          </Box>
        </div>
      )}
      {selectedTab === 'five' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-34%, 750%)' }}>
            Mobile
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {adminData.MobileNumber}
          </Box>
        </div>
      )}
      <Box style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>More</Box>

<RR onRatingTabClick={handleRatingTabClick} setSelectedTab={setSelectedTab} style={{ marginTop: '-10px',transform: 'translate(-35%, 345%)' }}></RR>

            </Box>
            
          </div>
          <div className="Container3">
         
      
          <Link to="admin-packs" className="box2" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Packages</Link>
            <Link to="admin-requests" className="box21" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Dr Requests</Link>
            <Link to="admin-users" className="box22" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Users</Link>

          </div>
        </div>
          <Box style={{ margin: "0 10px", flex: 1 }}>
            {/* <PatientShortcuts class="patientsshortcut" openAddFamilyModal={openAddFamilyModal} openSecondModal={openSecondModal} setTab={setTab}
            setInput={setInputs} openViewFamilyModal= {openViewFamilyModal} openUploadDocModal= {openUploadDocModal} openAddDeliveryModal={openAddDeliveryModal}
            navigate={navigate} username={username} name={adminData.Name} style={{ height: "100%" }} /> */}
          </Box>


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
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminHome;
