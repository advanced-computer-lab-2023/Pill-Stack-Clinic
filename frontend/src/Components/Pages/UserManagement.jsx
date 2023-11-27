import React from 'react'
import { useEffect, useState } from "react";
import '../UI/button.css'
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Text,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Center ,
    Flex,
    HStack,
    Stack,
    Checkbox,
    CheckboxGroup,
    filter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,





} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor,
    faBedPulse,
    faUserCog,
    faUserNurse,
 } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";


function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mail, setMail] = useState("");
    const navigate = useNavigate();
    const back =()=>  navigate(-1);
  
    // const [filtered , setFiltered] = useState([users]) 
    // const [filter, setFilter] = useState(['admin', 'doctor' ,'patient']);

    useEffect(() => {
        const getUsers = async () => {
            try {
            const { data } = await axios.get("http://localhost:8000/admin/allUsers", {
                withCredentials: true,
            });
            // setFiltered( 
              setUsers(data)
              // );
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, [users]);
    // useEffect(() => {
    //     setUsers(users.filter((user) => filter.includes(user.role)));
    // }, [filter]);

    // const filterUsers = () => {
    //   filtered = users;
    //   filtered.filter((user) => filter.includes(filtered.role));
    // }


    const firstLetterUpper = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
     
    const handleRemove = async (id, role) => {
        try {
            const body = {
                id: id, 
                role: role
            }
          const { data } = await axios.post("http://localhost:8000/admin/removeUser", body ,
            {
              withCredentials: true,
            }
          );
          console.log(data);
          //toast success
          toast.success("User Removed", {
            position: "bottom-left",
          });
        } catch (err) {
          console.log(err);
            //toast error
            toast.error("Error Removing User", {
                position: "bottom-left",
            });
        }
      };

      // const handleFilter = (value) => {
      //   setFilter(value);
      //   console.log("surprise m", value);
      // }

      const openModal = () => setIsOpen(true);
      const closeModal = () => setIsOpen(false);

      const handleAddAdmin = async () => {
        try {
          const body = {
            username: username,
            password: password,
            email: mail,
          };
          const { data } = await axios.post(
            "http://localhost:8000/administration",
            body,
            {
              withCredentials: true,
            }
          );
          console.log(data);
          //toast success
          toast.success("Admin Added", {
            position: "bottom-left",
          });
          
          closeModal();
        } catch (err) {
          console.log(err);
          //toast error
          toast.error("Error Adding Admin", {
            position: "bottom-left",
          });
        }
      }
      

  return (
    <>
        <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
            <Text fontSize={'3xl'} color={'white'} >Manage Users</Text>
            <button className="btn" onClick={back}>back</button>
        </Box>
        <Box  display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
            {/* <HStack m={10}>
              <CheckboxGroup colorScheme='green' defaultValue={['admin', 'doctor' ,'patient']} size={'lg'} 
              onChange={handleFilter}>
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                    <Checkbox value='admin' >Admins</Checkbox>
                    <Checkbox value='doctor'>Doctors</Checkbox>
                    <Checkbox value='patient'>Patients</Checkbox>
                </Stack>
              </CheckboxGroup>
            </HStack> */}
            {/* far right alighnment */}
            <Flex justifyContent={'end'} alignItems={'center'} m={10}>
              <Button colorScheme='blue' variant='solid' size='lg' mr={10}
              onClick={openModal}>
                Add New Admin
              </Button>
            </Flex>
        <TableContainer w={'90%'}>
            <Table size='lg'> 
              <Thead>
                <Tr bg={'#2d2d2e'}>
                  <Th color={'white'}>Userame</Th>
                  <Th color={'white'}>Name</Th>
                  <Th color={'white'}><Center> Role </Center></Th>
                  <Th color={'white'}><Center>Joined </Center></Th>
                  <Th color={'white'}> </Th>

                </Tr>
              </Thead>
                <Tbody>
                    {
                        users &&
                        users.map((user) => {
                            // Check if user.createdAt is a valid date
                            const createdAtDate = user.createdAt instanceof Date
                              ? user.createdAt.toLocaleDateString()
                              : new Date(user.createdAt).toLocaleDateString();
                            return (
                              <Tr key={user._id}
                              bg=
                              {
                                  user.role === "admin" ?
                                  '#eff30a28' : 
                                  user.role === "patient" ?
                                   '#00f34928' : 
                                  user.role === 'pharmacist'
                                  ? '#17fff030'
                                  : '#00a6f328'}
                              >
                                <Td w={'20%'} >
                                <Flex align="center"> 
                                    {
                                    user.role === "doctor" ? <FontAwesomeIcon icon={faUserDoctor} />
                                    : user.role === "patient" ? <FontAwesomeIcon icon={faBedPulse} />
                                    : user.role === "admin" ? <FontAwesomeIcon icon={faUserCog} />
                                    : user.role === "pharmacist" ? <FontAwesomeIcon icon={faUserNurse} />
                                    :<></>

                                    }
                                    <Text fontSize={'lg'} ml={5}>{user.Username}</Text> 
                                </Flex>
                                </Td>
                                <Td w={'20%'}> {user.Name} </Td>
                                <Td w={'20%'}> <Center> {  firstLetterUpper(user.role)} </Center></Td>
                                <Td w={'20%'}> <Center>{createdAtDate}  </Center></Td>
                                <Td w={'20%'}>
                                    <Center>
                                     <Button colorScheme='red' variant='solid' size='sm'
                                     onClick={() => handleRemove(user._id, user.role)}
                                     >Remove User</Button>
                                    </Center>
                                </Td>
                              </Tr>
                            );
                          })
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </Box>
        <ToastContainer />
        {/* add new admin modal */}
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Admin</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Username</Text>
              <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Text mt={5}>Password</Text>
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Text mt={5}>Email</Text>
              <Input
                type="email"
                placeholder="ex@example.com"
                onChange={(e) => setMail(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddAdmin}>
                Add Admin
              </Button>
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  )
}

export default UserManagement

