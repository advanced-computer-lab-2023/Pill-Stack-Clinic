



import {

  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Select,
  Stack



  } from "@chakra-ui/react";

// export const Home = () => {
//   const navigate = useNavigate();
//   const [cookies, removeCookie] = useCookies([]);
//   const [username, setUsername] = useState("");
//   const { isOpen, onOpen, onClose } = useDisclosure()
   

//   useEffect(() => {
//     const verifyCookie = async () => {
//       if (!cookies.token) {
//         navigate("/");
//       }
//       const { data } = await axios.post(
//         "http://localhost:8000",
//         {},
//         { withCredentials: true }
//       );
//       const { status, user } = data;
//       setUsername(user);
//       return status
//         ? toast(`Hello ${user}`, {
//             position: "top-right",
//           })
//         : (removeCookie("token"), navigate("/"));
//     };
//     verifyCookie();
//   }, [cookies, navigate, removeCookie]);
//   const Logout = () => {
//     removeCookie("token");
//     navigate("/");
//   };

//   // router.post('/linkPatientAsFamilyMember/:Username/:emailOrPhone/:relation',userVerification,linkPatientAsFamilyMember)

//   /////////
// //   const linkPatientAsFamilyMember = async (req, res) => {
// //     try {
// //        const linkingUserUsername = req.user.Username; // The username of the user initiating the link
// //        const linkTargetEmailOrPhone = req.params.emailOrPhone; // Email or phone number of the user to link
// //        const relation = req.params.relation; // Relation (wife, husband, child, etc.)
// //        console.log('linkTargetEmailOrPhone:', linkTargetEmailOrPhone);
 
 
       
// //        let linkedUser;
// //        if (linkTargetEmailOrPhone.includes('@')) {
          
// //           linkedUser = await userModel.findOne({ Email: linkTargetEmailOrPhone });
// //        } else {
// //           linkedUser = await userModel.findOne({ MobileNumber: linkTargetEmailOrPhone });
// //        }
 
// //        if (!linkedUser) {
// //           return res.status(404).json({ message: 'User to link not found' });
// //        }
 
// //        const linkingUser = await userModel.findOne({ Username: linkingUserUsername });
 
// //        if (!linkingUser) {
// //           return res.status(404).json({ message: 'User not found' });
// //        }
 
// //        if (!isValidRelation(relation)) {
// //           return res.status(400).json({ message: 'Invalid relation' });
// //        }
 
// //        const linkedFamilyMember = {
// //           memberID: linkedUser.id, 
// //           username: linkedUser.Username, 
// //           relation:relation,
// //        };
 
// //        if (!linkingUser.LinkedPatientFam) {
// //           linkingUser.LinkedPatientFam = [];
// //        }
 
// //        linkingUser.LinkedPatientFam.push(linkedFamilyMember);
// //        if(linkingUser.healthPackage.length!=0){
// //           for(let i=0;i<linkingUser.healthPackage.length;i++){
// //              if(linkingUser.healthPackage[i].Status='Subscribed'){
// //                 const userPack=({
// //                    _id:linkingUser.healthPackage[i]._id,
// //                    Package_Name:linkingUser.healthPackage[i].Package_Name,
// //                    Price:linkingUser.healthPackage[i].Price,
// //                    Session_Discount:linkingUser.healthPackage[i].Session_Discount,
// //                    Family_Discount:linkingUser.healthPackage[i].Family_Discount,
// //                    Pharmacy_Discount:linkingUser.healthPackage[i].Pharmacy_Discount,
// //                    Status:'Subscribed',
// //                    Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
// //                    Owner:false,
// //                 });
// //                 linkedUser.healthPackage.push(userPack);
// //                 await linkedUser.save();
// //              }
// //           }
// //        }
 
// //        await linkingUser.save();
// //        res.status(200).send("Family Member linked successfully");
 
// //     } catch (error) {
// //        console.error('Error linking family member:', error);
// //        res.status(500).json({ message: 'Internal server error' });
// //     }
// //  }
  


//   return (
//     <>
//       <div className="home_page">
//         <h4>
//           {" "}
//           Welcome <span>{username}</span>
//         </h4>
//         <Button colorScheme="teal" variant="outline"
//           onClick={() => {
//           setInputs({})
//           onOpen();
//           setTab('newMem')}}
//         > Add Family Members </Button>
//         <Link to={`/my-health-records/${username}`}>
//           <Button colorScheme="teal" variant="outline">View My Health Records</Button>
//         </Link>
//         <button onClick={Logout}>LOGOUT</button>
//          <Link to={`/home/viewPackages/${username}`}>Packages</Link> 
//       </div>
//       <ToastContainer />


//     </>
//   );
// };

























import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AddIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { Box, Flex, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Link,
  ModalFooter,
  TableContainer,
  Tag,
  Table,
  Th,
  Tr,
  Td,
  Thead,
  Tbody,
  Text,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Center
} from "@chakra-ui/react";
import ShortcutsCard from "../UI/ShortcutsCard";
import PatientInfoCard from "../UI/PatientInfoCard";
import WithSubnavigation from "../UI/navbar";
import PatientShortcuts from "../UI/patientShortcuts";


export const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [patientData, setPatientData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [isAddFamModalOpen, setisAddFamModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isViewFamilyModalOpen, setIsViewFamilyModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [tab, setTab] = useState('newMem')
   const [inputs, setInputs] = useState({})


   const openAddFamilyModal = () => {
    setisAddFamModalOpen(true);
    setTab('newMem');  // Set the tab state to 'newMem'
    setInputs({});      // Reset the inputs state
  };

  const closeAddFamilyModal = () => {
    setisAddFamModalOpen(false);
  };

  const openViewFamilyModal = () => {
    setIsViewFamilyModalOpen(true);
  };

  const closeViewFamilyModal = () => {
    setIsViewFamilyModalOpen(false);
  };
  const openUploadDocModal = () => {
    setIsUploadDocModalOpen(true);
  };

  const closeUploadDocModal = () => {
    setIsUploadDocModalOpen(false);
  };

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };
  const onSecondModalClose = () => {
    setIsSecondModalOpen(false);
  };

  
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

    // Fetch the patient's data
    const getPatientData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/patient/profile", {
          withCredentials: true,
        });
        setPatientData(response.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    
    
    getPatientData();
  }, [cookies, navigate, removeCookie]);


  const cancelSubscription = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/patient/cancelSubs',
        {
          userId: patientData._id,
          packageID: patientData.healthPackage[0]._id,
        },
        { withCredentials: true }
      );
  
      // Handle the response as needed
      console.log(response.data);
      toast.success('Cancelled successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log("mfrood cancelled");
    } catch (error) {
      console.error('Error cancelling subscription:', error.message);
      toast.error('Failed to cancel subscription. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  const handleAddFamilyMember = async () => {
    if (tab === 'linkMem') {
      try {
        const response = await axios.post(
          `http://localhost:8000/patient/linkPatientAsFamilyMember/${username}/${inputs.emailOrPhone}/${inputs.relation}`,
          {},
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          toast.success('Family member linked successfully', {
            position: 'top-right',
          });
          onClose(); // Close the modal on success
        } else {
          toast.error('Failed to link family member. Please try again.', {
            position: 'bottom-left',
          });
        }
      } catch (error) {
        console.error('Error linking family member:', error);
        toast.error('Failed to link family member. Please try again.', {
          position: 'bottom-left',
        });
      }
    } else if (tab === 'newMem') {
      try {
        const response = await axios.post(
          'http://localhost:8000/patient/addFamMem',
          inputs,
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          toast.success(response.data.message, {
            position: 'top-right',
          });
          onClose(); // Close the modal on success
        } else {
          toast.error('Failed to add family member. Please try again.', {
            position: 'bottom-left',
          });
        }
      } catch (error) {
        console.error('Error adding family member:', error);
        toast.error('Failed to add family member. Please try again.', {
          position: 'bottom-left',
        });
      }
    }
  };
  




  useEffect(() => {
    // Check if patientData is not null and log it
    if (patientData !== null) {
      console.log("patient Data:", patientData);
    }
  }, [patientData]);

  
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };



  return (
    <> 
    
    <WithSubnavigation
    username={patientData.Name}
    onOpenModal={onOpen}
    />


<Button colorScheme="teal" variant="outline"
          onClick={() => {
          setInputs({})
          onOpen();
          setTab('newMem')}}
        > Add Family Members </Button>
        <Button
  colorScheme="teal"
  variant="outline"
  onClick={() => navigate(`/my-health-records/${username}`)}
>
  View My Health Records
</Button>

        <button onClick={Logout}>LOGOUT</button>
        <Button
  colorScheme="teal"
  variant="outline"
  onClick={() => navigate(`/home/viewPackages/${username}`)}
>
  Packages
</Button>



 
      <div className="home_page" style={{ background: "linear-gradient(45deg, #1E9AFE, #60DFCD)" }}>
        <h4>
          Welcome 3ayan  <span>{username}</span>
        </h4> 
        <Flex>
        <Box style={{ margin: "0 10px", flex: 1 }}>
  
            <PatientInfoCard
            title={`Masa2 el anwar ya ${username}`}
            username={patientData.Username}
            name={patientData.Name}
            email={patientData.Email}
            DateOfBirth={patientData.DateOfBirth}
            Gender={patientData.Gender}
            MobileNumber={patientData.MobileNumber}
            EmergencyContact_Name={patientData.EmergencyContact_Name}
            EmergencyContact_MobileNumber = {patientData.EmergencyContact_MobileNumber}
            WalletBalance = {patientData.WalletBalance}

           
            />
</Box>

          <Box style={{ margin: "0 10px", flex: 1 }}>
            <PatientShortcuts openAddFamilyModal={openAddFamilyModal} openSecondModal={openSecondModal} setTab={setTab}
            setInput={setInputs} openViewFamilyModal= {openViewFamilyModal} openUploadDocModal= {openUploadDocModal} style={{ height: "100%" }} />
          </Box>
        </Flex>

        <button onClick={Logout}>LOGOUT</button>
        <Modal
  isOpen={isSecondModalOpen}
  onClose={onSecondModalClose}
  initialFocusRef={initialRef}
  finalFocusRef={finalRef}
  size="7xl"
>
  <ModalOverlay />
  <ModalContent h="800px">
    <ModalHeader>Health Packages</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={9}>
      <Table variant="striped" colorScheme="teal" size="lg">
        <Thead>
          <Tr>
            <Th>Package Name</Th>
            <Th>Price</Th>
            <Th>Session Discount</Th>
            <Th>Pharmacy Discount</Th>
            <Th>Family Discount</Th>
            <Th>Status</Th>
            <Th>Renewal Date</Th>
            <Th>End Date</Th>
            <Th>Owner</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
        {patientData?.healthPackage && patientData.healthPackage.map((packageitem, index) => (
            <Tr key={index} className={packageitem.Owner ? 'owner-package' : ''}>
              <Td>{packageitem.Package_Name}</Td>
              <Td>{packageitem.Price}</Td>
              <Td>{packageitem.Session_Discount}</Td>
              <Td>{packageitem.Pharmacy_Discount}</Td>
              <Td>{packageitem.Family_Discount}</Td>
              <Td>{packageitem.Status}</Td>
              <Td>{packageitem.Renewl_Date ? packageitem.Renewl_Date : 'None'}</Td>
              <Td>{packageitem.End_Date ? packageitem.End_Date : 'None'}</Td>
              <Td>{packageitem.Owner ? 'Yes' : 'No'}</Td>
              <Td>
                {packageitem.Owner && (
                  <Button
                    colorScheme="red"
                    onClick={() => cancelSubscription(index)}
                  >
                    Cancel
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3}>
        Save
      </Button>
      <Button onClick={onSecondModalClose}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


<Modal
  isOpen={isViewFamilyModalOpen}
  onClose={closeViewFamilyModal}
  initialFocusRef={initialRef}
  finalFocusRef={finalRef}
  size="5xl"
>
  <ModalOverlay />
  <ModalContent h="1000px">
    <ModalHeader>View Family Members</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={9}>
      {patientData.familyMembers && patientData.familyMembers.length > 0 ? (
        <TableContainer w="100%">
          <Table size="lg">
            <Thead>
              <Tr bg="linear-gradient(45deg, #1E9AFE, #60DFCD)" color="white">
                <Th color="white">Member Name</Th>
                <Th color="white">National ID</Th>
                <Th color="white">Age</Th>
                <Th color="white">Gender</Th>
                <Th color="white">Relation</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patientData.familyMembers.map((familyMember) => (
                <Tr key={familyMember._id}>
                  <Td>{familyMember.MemberName}</Td>
                  <Td>{familyMember.NationalID}</Td>
                  <Td>{familyMember.Age}</Td>
                  <Td>{familyMember.Gender}</Td>
                  <Td>{familyMember.Relation}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No family members found.</Text>
      )}

      {patientData.LinkedPatientFam && patientData.LinkedPatientFam.length > 0 ? (
        <TableContainer mt={5} w="100%">
          <Table size="lg">
            <Thead>
              <Tr bg="linear-gradient(45deg, #1E9AFE, #60DFCD)" color="white">
                <Th color="white">Linked Patient Name</Th>
                <Th color="white">Relation</Th>
                <Th color="white"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {patientData.LinkedPatientFam.map((linkedPatient) => (
                <Tr key={linkedPatient._id}>
                  <Td>{linkedPatient.username}</Td>
                  <Td>{linkedPatient.relation}</Td>
                  <Td>
                    <Tag colorScheme="cyan">Linked Patient</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No linked patients found.</Text>
      )}
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3}>
        Save
      </Button>
      <Button onClick={closeViewFamilyModal}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
<Modal
  isOpen={isUploadDocModalOpen}
  onClose={closeUploadDocModal}
  initialFocusRef={initialRef}
  finalFocusRef={finalRef}
  size="2xl"
>
  <ModalOverlay />
  <ModalContent h="700px">
    <ModalHeader>Upload Medical Document</ModalHeader>
    <ModalCloseButton />
    <ModalBody pb={9}>
    <Center>
    <Button
  w="150px"
  h="50px"
  m={3}
  colorScheme="green"
  _hover={{ transform: "scale(1.05)" }}
  onClick={openUploadDocModal} 
>
  Upload Doc
</Button>
  </Center>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3}>
        Save
      </Button>
      <Button onClick={closeUploadDocModal}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


<Modal isOpen={isAddFamModalOpen} onClose={closeAddFamilyModal} size={'xl'} >
        <ModalOverlay 
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)' 
        />
        <ModalContent>
          <ModalHeader>Add Family Members To my Account </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab w={'50%'} onClick={() => {
                setTab('newMem');
                setInputs({});
              }}>Add New Family Member</Tab>
              <Tab w={'50%'} onClick={() => {
                setTab('linkMem');
                setInputs({});
              }}>Link Existing User</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder='First name' onChange={(e) => setInputs({...inputs, username: e.target.value})}
                  />
                </FormControl>

                <HStack>
                <FormControl isRequired>
                  <FormLabel>National ID</FormLabel>
                  <Input placeholder='National ID'  onChange={(e) => setInputs({...inputs, nationalID: e.target.value})}
                  />
                </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input placeholder='Age'  onChange={(e) => setInputs({...inputs, age: e.target.value})}
                    />
                  </FormControl>
                </HStack>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select placeholder='Select Gender'
                    onChange={(e) => setInputs({ ...inputs, gender: e.target.value })} >
                      <option >Male</option>
                      <option>Female</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Relation To You</FormLabel>
                    <Select placeholder='Select Relation'
                    onChange={(e) => setInputs({ ...inputs, relation: e.target.value })}>
                      <option>Wife</option>
                      <option>Husband</option>
                      <option>Child</option>
                    </Select>
                  </FormControl>
                  </HStack>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4} mb={4}>  
                  <FormControl isRequired>
                    <FormLabel>Email or Phone</FormLabel>
                    <Input placeholder='Contact' onChange={(e) => setInputs({...inputs, emailOrPhone: e.target.value})}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Relation To You</FormLabel>
                    <Select placeholder='Select Relation'
                    onChange={(e) => setInputs({ ...inputs, relation: e.target.value.toLowerCase() })}>
                      <option>Wife</option>
                      <option>Husband</option>
                      <option>Child</option>
                    </Select>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='outline'
              onClick={handleAddFamilyMember}
              colorScheme='green'
            >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
















