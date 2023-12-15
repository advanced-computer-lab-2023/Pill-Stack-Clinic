import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Sidebar from './side';
import { ToastContainer, toast } from "react-toastify";
import { AddIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { saveAs } from 'file-saver';
import { Link } from "react-router-dom";
import { ChatIcon, Icon, EmailIcon,PhoneIcon,BellIcon } from "@chakra-ui/icons";
import '../UI/Styles/home.css';
import RR from './RR'

import { Box, Flex, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Select,
  Stack,
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
import ShortcutsCard from "../UI/DoctorShortcuts";
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
  const [isAddDeliveryModalOpen, setisAddDeliveryModalOpen] = useState(false);
  const [isViewFamilyModalOpen, setIsViewFamilyModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [tab, setTab] = useState('newMem')
   const [inputs, setInputs] = useState({})
   const [streetName, setStreetName] = useState("");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [addressName, setAddressName] = useState("");
  const [selectedTab, setSelectedTab] = useState("one");

  const handleRatingTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };


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
  const openAddDeliveryModal = () => {
    setisAddDeliveryModalOpen(true);
  };
  const closeAddDeliveryModal = () => {
    setisAddDeliveryModalOpen(false);
  };
  
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { status, user} = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();

    
    
    getPatientData();
  }, [cookies, navigate, removeCookie]);


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

  const uploadDocument = async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
  
      await axios.post('http://localhost:8000/patient/upload-document', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Call getPatientData after a successful document upload
      await getPatientData();
  
      // Handle success, e.g., show a success toast
      toast.success('Document uploaded successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      // Handle error, e.g., show an error toast
      toast.error('Failed to upload document. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const removeDocument = async (documentId) => {
    try {
      // Replace the following line with the actual endpoint for removing a document
      await axios.delete(`http://localhost:8000/patient/remove-document/${documentId}`, {
        withCredentials: true,
      });
  
      // Call getPatientData after a successful document removal
      await getPatientData();
  
      // Handle success, e.g., show a success toast
      toast.success('Document removed successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error removing document:', error);
      // Handle error, e.g., show an error toast
      toast.error('Failed to remove document. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const viewDocument = async (filePath) => {
    try {
      // Replace this URL with the endpoint that serves the file
      const fileEndpoint = `http://localhost:8000/serve-file?filePath=${encodeURIComponent(filePath)}`;
  
      // Fetch the file
      const response = await fetch(fileEndpoint);
  
      if (!response.ok) {
        // Handle the case where the file couldn't be fetched
        throw new Error('Failed to fetch the document.');
      }
  
      // Get the blob representing the file data
      const fileBlob = await response.blob();
  
      // Determine the file extension from the file path
      const fileExtension = filePath.split('.').pop().toLowerCase();
  
      // Set the content type based on the file extension
      let contentType = 'application/octet-stream'; // Default to binary data
  
      if (fileExtension === 'pdf') {
        contentType = 'application/pdf';
      } else if (['jpeg', 'jpg', 'png'].includes(fileExtension)) {
        contentType = `image/${fileExtension}`;
      }
  
      // Use FileSaver.js to trigger the download
      saveAs(fileBlob, `document.${fileExtension}`, { type: contentType });
    } catch (error) {
      console.error('Error opening the document:', error);
      // Handle error, e.g., show an error toast
      toast.error('Failed to open the document. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  

  
  
  const cancelSubscription = async (index) => {
    try {
      const packageID = patientData.healthPackage[index]._id;
  
      const response = await axios.post(
        'http://localhost:8000/patient/cancelSubs',
        {
          userId: patientData._id,
          packageID: packageID,
        },
        { withCredentials: true }
      );
  
      // Handle the response as needed
      console.log(response.data);
  
      // Update the state with the canceled status
      setPatientData((prevData) => {
        const updatedData = { ...prevData };
        updatedData.healthPackage[index].status = 'canceled'; // Assuming there's a status field
        return updatedData;
      });
      await getPatientData();
  
      toast.success('Cancelled successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error.message);
      toast.error('Failed to cancel subscription. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
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
          toast.success('Added Successfuly', {
            position: 'top-right',
          });
          await getPatientData();
          closeAddFamilyModal(); // Close the modal on success
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
    navigate("/");
  };
  const addAddress = async () => {
    try {
      if (!addressName.trim() || !streetName.trim() || !buildingNumber.trim() || !floor.trim() || !apartment.trim()) {
        toast("Please fill in all fields", {
          position: "top-right",
        });
        return;
      }
      // Send the address to the backend
      const newAddress = `${addressName},${streetName},${buildingNumber},${floor},${apartment}`.replaceAll(' ', '');
      const response = await axios.post(
        `http://localhost:8000/patient/addDeliveryAddress/${username}`,
        { address:newAddress },
        { withCredentials: true }
      );
        console.log(response.data)
        
      if (response.data === "Delivery address added successfully") {
        toast("Delivery address added successfully", {
          position: "top-right",
        });

        setAddressName("");
        setStreetName("");
        setBuildingNumber("");
        setFloor("");
        setApartment("");
       // add the address to the list of addresses
        setPatientData((prev) => ({
          ...prev,
          DeliveryAddress: [...prev.DeliveryAddress, newAddress],
        }));

        closeAddDeliveryModal();
            } else {
        toast("Could not add the delivery address", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding the delivery address:", error);
      toast("Internal server error", {
        position: "top-right",
      });
    }
  };

  return (
    <> 
    
     <div style={{ position: 'fixed', top: '0', left: '0', right: '0', zIndex: '1000'}}>

      <WithSubnavigation
        username={patientData.Name}
        onOpenModal={onOpen}
        onLogout={Logout}
        notifications={patientData.Notifications}
        mb={5}
      />
    </div>
    <Sidebar
        openSecondModal={openSecondModal}
        openAddFamilyModal={openAddFamilyModal}
        openViewFamilyModal={openViewFamilyModal}
        openUploadDocModal={openUploadDocModal}
        navigate={navigate}
        username={username}
        name={patientData.Name}
        onOpenModal={onOpen}
        onLogout={Logout}
        openAddDeliveryModal={openAddDeliveryModal}
      />
      
      <div className="home_page">
      <div className="home_page_content" >
        
        <h4>
          {/* Welcome 3ayan  <span>{username}</span> */}
        </h4> 
        <Flex>
        {/* <Box style={{ margin: "0 10px", flex: 1 }}>
  
            <PatientInfoCard
            title={`Masa2 el anwar ya ${username}`}
            username={patientData.Username}
            name={patientData.Name}
            email={patientData.Email}
            DateOfBirth={patientData.DateOfBirth} <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            Gender={patientData.Gender}
            MobileNumber={patientData.MobileNumber}
            EmergencyContact_Name={patientData.EmergencyContact_Name} <<<<<<<<<<<<<<<<<<<<<<<<<<<
            EmergencyContact_MobileNumber = {patientData.EmergencyContact_MobileNumber}
            WalletBalance = {patientData.WalletBalance}
            DeliveryAddress={patientData. DeliveryAddress}   <<<<<<<<<<<<<<<<<<<<<<<<<<<

           
            />
</Box> */}
        <div className="BigContainer">
          <div className="Container1">
            <Box className="boxW" >
               <div className="boxT">Wallet</div>
               <div className="square">$</div>
                <div className="balance">{`$ ${patientData.WalletBalance}`}</div>
                <div className="square2">Total Balance</div>
            </Box>
            <Box className="box1" >
              <div className="boxT">Information</div>
            <div className="line">
              <EmailIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Email:  ${patientData.Email}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 19px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Mobile:  ${patientData.MobileNumber}`}</div>
            </div>
            <div className="line">
              <PhoneIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
              <div className="info1" style={{ margin: '0px 0px 0px 18px', padding: 0, display: "inline-block", transform: 'translateY(-5px)' }}>{`Emergency Mobile:  ${patientData.EmergencyContact_MobileNumber}`}</div>
            </div>
            </Box>

            <Box className="box1" >
            <div className="boxT">Recent</div>
            <div className="line" style={{ marginTop: '0px' }}>
          <BellIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
          <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-45px)' }}>
            {patientData.Notifications && patientData.Notifications.length > 0 ? `${patientData.Notifications[0]}` : "None"}
          </div>
        </div>

        <div className="line" style={{ marginTop: '-50px'}}>
          <BellIcon color='#2CAED8' boxSize={6} style={{ margin: 0, padding: 0, display: "inline-block" }} />
          <div className="info1" style={{ margin: '0px 0px 0px 33px', padding: 0, display: "inline-block", transform: 'translateY(-45px)' }}>
            {patientData.Notifications && patientData.Notifications.length > 1 ? `${patientData.Notifications[1]}` : "None"}
          </div>
        </div>


    
            </Box>
          </div>

          
          <div className="Container2">
            <Box className="box3" ></Box>
            {patientData.Gender && (patientData.Gender.toLowerCase() === 'male' ? (
              <Box className="ppM" ></Box>
            ) : patientData.Gender.toLowerCase() === 'female' ? (
              <Box className="ppF" ></Box>
            ) : (
              <Box className="ppM"></Box>
            ))}

            <Box className="Details" style={{ overflow: 'hidden' }}>
            <Box style={{ textAlign: 'center' }}>{patientData.Name}</Box>
              <Box className="GenderB">
              {patientData.Gender && (patientData.Gender.toLowerCase() === 'male' ? (
                <Box className="Male">
                  Male
                </Box>
              ) : patientData.Gender.toLowerCase() === 'female' ? (
                <Box className="Female">
                  Female
                </Box>
              ) : (
                <Box className="Male"> 
                  Male
                </Box>
              ))}
            </Box>
            <Box className='infoI' style={{ transform: 'translate(-30%, 395%)' }}>
              Username
            </Box>
            <Box className="RoundBox" style={{ marginTop: '5px' }}>
            {patientData.Username}
            </Box>
            {selectedTab === 'one' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-35%, 750%)' , textAlign: 'center' }}>
            Email
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {patientData.Email}
          </Box>
        </div>
      )}
            {selectedTab === 'two' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-28%, 750%)' }}>
            Date Of Birth
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {patientData.DateOfBirth}
          </Box>
        </div>
      )}

      {selectedTab === 'three' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-16%, 750%)' }}>
            Emergency Contact Name
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {patientData.EmergencyContact_Name}
          </Box>
        </div>
      )}

      {selectedTab === 'four' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-25%, 750%)' }}>
            Delivery Address
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {patientData.DeliveryAddress}
          </Box>
        </div>
      )}
      {selectedTab === 'five' && (
        <div>
          <Box className='infoI' style={{ transform: 'translate(-34%, 750%)' }}>
            Mobile
          </Box>
          <Box className="RoundBox" style={{ marginTop: '5px', transform: 'translate(0%, 195%)' }}>
            {patientData.MobileNumber}
          </Box>
        </div>
      )}
      <Box style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, textAlign: 'center' }}>More</Box>

<RR onRatingTabClick={handleRatingTabClick} setSelectedTab={setSelectedTab} style={{ marginTop: '-10px',transform: 'translate(-35%, 345%)' }}></RR>

            </Box>
            
          </div>
          <div className="Container3">
            <Box className="box2" onClick={openSecondModal}>Packages</Box>
            <Link to="doctor-home/apptsD" className="box21" style={{ color: '#4C4C4C', textDecoration: 'none' }}>Appointments</Link>
            <Box className="box22" onClick={openViewFamilyModal}>Family</Box>

          </div>
        </div>
          <Box style={{ margin: "0 10px", flex: 1 }}>
            {/* <PatientShortcuts class="patientsshortcut" openAddFamilyModal={openAddFamilyModal} openSecondModal={openSecondModal} setTab={setTab}
            setInput={setInputs} openViewFamilyModal= {openViewFamilyModal} openUploadDocModal= {openUploadDocModal} openAddDeliveryModal={openAddDeliveryModal}
            navigate={navigate} username={username} name={patientData.Name} style={{ height: "100%" }} /> */}
          </Box>
        </Flex>

        
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
                    isDisabled={packageitem.Status === 'Cancelled'}
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
        <Input type="file" onChange={(e) => uploadDocument(e.target.files[0])} />
      </Center>

      {/* Display existing files in a table */}
      <Stack mt={6} spacing={4}>
  <Table variant="striped" colorScheme="teal" size="md">
    <Thead>
      <Tr>
        <Th>File Name</Th>
        <Th>File Path</Th>
        <Th>Action</Th> {/* Add Action header for the Remove button */}
        <Th>Action</Th> {/* Add Action header for the View button */}
      </Tr>
    </Thead>
    <Tbody>
      {patientData?.medicalHistory?.map((file, index) => (
        <Tr key={index}>
          <Td>{file.name}</Td>
          <Td>{file.path}</Td>
          <Td>
            <Button colorScheme="red" size="sm" onClick={() => removeDocument(file._id)}>
              Remove
            </Button>
          </Td>
          <Td>
            {/* Add a View button that triggers a function to handle viewing the document */}
            <Button colorScheme="teal" size="sm" onClick={() => viewDocument(file.path)}>
              View
            </Button>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</Stack>

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
          backdropFilter='blur(10px)' 
        />
        <ModalContent>
          <ModalHeader>Add Family Members To my Account </ModalHeader>
          <ModalCloseButton/>
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
            <Button colorScheme='blue' mr={3} onClick={closeAddFamilyModal}>
              Close
            </Button>
            <Button variant='outline'
              onClick={handleAddFamilyMember}
              colorScheme='green'
            >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
        <Modal isOpen={isAddDeliveryModalOpen} onClose={closeAddDeliveryModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="addressName">Address Name:</label>
                <input
                  type="text"
                  id="addressName"
                  placeholder="Enter Address Name"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="streetName">Street Name:</label>
                <input
                  type="text"
                  id="streetName"
                  placeholder="Enter Street Name"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="buildingNumber">Building Number:</label>
                <input
                  type="text"
                  id="buildingNumber"
                  placeholder="Enter Building Number"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="floor">Floor:</label>
                <input
                  type="text"
                  id="floor"
                  placeholder="Enter Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="apartment">Apartment:</label>
                <input
                  type="text"
                  id="apartment"
                  placeholder="Enter Apartment"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                />
              </div>
            </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeAddDeliveryModal}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addAddress}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#005660",
            borderRadius: "100px",
            cursor: "pointer",
          }}
        >
          <Link to={`/chatwithdoctor/${username}`}>
          <Center>
          <Icon as={ChatIcon} boxSize={6} m={5} style={{ color: 'white' }} />  
          </Center>          
          </Link>
        </motion.div>


        </div>     
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
















