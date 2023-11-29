import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'; 

import {
  faCubesStacked,
  faCapsules,
  faArrowRightFromBracket,
  faListCheck 
 } from "@fortawesome/free-solid-svg-icons";
import {
  Flex,
  Text,
  Spacer,
  Avatar,
  Badge,
  Button,
  useDisclosure,
  Divider,
  SimpleGrid,
  Grid,
  Box,
} from "@chakra-ui/react";

import Shortcut from "../UI/Shortcut";

function PharmaHome() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure(); // useDisclosure hook for managing modal state
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [fullUser, setFullUser] = useState("");
  const [isChangePassOpen, setisChangePassOpen] = useState(false);

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
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  useEffect(() => {
    const fetchFullUser = async () => {
      if (username) {
        const { data } = await axios.get(`http://localhost:8000/pharmacist/myInfo/${username}`);
        setFullUser(data);
        console.log(fullUser);
      }
    };
    fetchFullUser();
  }, [username]);

  const openViewFamilyModal = () => {
    onOpen(); // Use onOpen to open the modal
    setisChangePassOpen(true);
  };

  const closeViewFamilyModal = () => {
    onClose(); // Use onClose to close the modal
    setisChangePassOpen(false);
  };
  

  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };
  const handleChangePass = async () => {
    const oldPassword = document.querySelector('#oldPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const confirmNewPassword = document.querySelector('#confirmNewPassword').value;
  
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords don\'t match', {
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
      } else {
        toast.error('An error occurred while processing your request', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };


  return (
    <>
      <ToastContainer/>
      <Flex bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
          <Text fontSize={'3xl'} color={'white'} >Welcome To Pill lorem </Text>
          <Spacer/>
          <Button onClick={openViewFamilyModal} style={{ color: 'Black', marginRight: '10px', textDecoration: 'none', cursor: 'pointer', marginBottom: '2px', ':hover': { color: 'black' } }}>ChangePass</Button>


          <Button onClick={Logout}> Logout <FontAwesomeIcon icon={faArrowRightFromBracket} style={{marginLeft:"7px"}}/> </Button>
        </Flex>
        <Box  m={10}>
          <Flex m={5}>
              <Avatar src='https://bit.ly/sage-adebayo' />
              <Box ml='3'>
                  <Text fontWeight='bold'>
                  {fullUser && fullUser.Name}
                  <Badge ml='1' colorScheme='green'>
                      Active
                  </Badge>
                  </Text>
                  <Text fontSize='sm'> {username} </Text>
              </Box>
              <Spacer/>
              <Text >Wallet: </Text>
              <Text m={2} fontSize={'3xl'}> 
                $0.00
              </Text>
          </Flex>
          <Divider orientation="horizontal" />
          <Grid templateColumns='repeat(2, 1fr)'>
            <Flex m={5} flexDirection={'column'} borderRight='1px solid gray'>
              <Text fontSize={'3xl'}> Account Details </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Email: {fullUser.Email} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Affiliation: {fullUser.affiliation} </Text>
              <Text fontSize={'xl'} bg={"#fcfafc"} m={2} p={2}> Educational Background: {fullUser.education_background} </Text>
            </Flex>
            <SimpleGrid minChildWidth='150px' spacing='1px' m={5} >
              <Shortcut 
                link={'/medicine/sales'} 
                icon={<FontAwesomeIcon icon={faListCheck} fontSize={'35px'}/>} 
                text={'Stock Management'}/> 
              <Shortcut 
                link={'/addMed'} 
                icon={<FontAwesomeIcon icon={faCapsules} fontSize={'35px'}/>} 
                text={'Add Meds'}/>
              <Shortcut 
                link={'/medicineControl'} 
                icon={<FontAwesomeIcon icon={faCubesStacked}  fontSize={'35px'}/>} 
                text={'Med Stock'}/>
            </SimpleGrid>
          </Grid>
        </Box>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen} 
          onClose={closeViewFamilyModal} 
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
              <Button onClick={closeViewFamilyModal}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
       
    </>
  );
}

export default PharmaHome;
