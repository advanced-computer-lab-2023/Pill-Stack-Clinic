import React from 'react'
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Text,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Center ,
    Flex,
    Icon,
    Toast


} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserDoctor,
    faBedPulse,
    faUserCog
 } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";


function UserManagement() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
            const { data } = await axios.get("http://localhost:8000/admin/allUsers", {
                withCredentials: true,
            });
            setUsers(data);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, [users]);

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

  return (
    <>
        <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
            <Text fontSize={'3xl'} color={'white'} >Manage Users</Text>
        </Box>
        <Box  display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
        <TableContainer w={'90%'}>
            <Table size='lg'>
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
                                  '#eff30a28' : user.role === "patient" ? '#00f34928' : '#00a6f328'
                              }
                              >
                                <Td w={'20%'} >
                                <Flex align="center"> {/* Use Flex to align the icon and text */}
                                    {
                                    user.role === "doctor" ? <FontAwesomeIcon icon={faUserDoctor} />
                                    : user.role === "patient" ? <FontAwesomeIcon icon={faBedPulse} />
                                    : user.role === "admin" ? <FontAwesomeIcon icon={faUserCog} />: <></>
                                    }
                                    <Text fontSize={'lg'} ml={5}>{user.Username}</Text> 
                                </Flex>
                                </Td>
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
    </>
  )
}

export default UserManagement
