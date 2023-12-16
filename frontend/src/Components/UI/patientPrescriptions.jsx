import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Select,
  Input,
  Button,
  Tooltip,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import Prescription from '../UI/Prescription';
import Navigation from "./Navigation";
import '../UI/Styles/innerPages.css';
import Sidebar from '../Pages/side';


const PrescriptionViewer = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([...prescriptions]);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isfalse, setfalse] = useState(false);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);
  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        // Send a GET request to the server to view prescriptions
        const response = await axios.post("http://localhost:8000/patient/prescriptions", {}, {
          withCredentials: true, // Include credentials if necessary
        });

        setPrescriptions(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    }

    fetchPrescriptions();
  }, []);

  useEffect(() => {
    // Implement filtering logic
    let filteredPrescriptions = prescriptions.filter((prescription) => {
      const startDateMatches = !filterStartDate || prescription.Date >= filterStartDate;
      const endDateMatches = !filterEndDate || prescription.Date <= filterEndDate;
      const doctorMatches = !filterDoctor || prescription.DocUsername === filterDoctor;
      const statusMatches = filterStatus === 'All' || prescription.Status === filterStatus;
      return startDateMatches && endDateMatches && doctorMatches && statusMatches;
    });

    setFilteredPrescriptions(filteredPrescriptions);
  }, [filterStartDate, filterEndDate, filterDoctor, filterStatus, prescriptions]);

  const viewDetails = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closeDetails = () => {
    setSelectedPrescription(null);
  };

  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  let i=1;
  const Download=async(prescription)=>{
    try{
    const response=await axios.post("http://localhost:8000/patient/PDF",{prescription:prescription},
    {withCredentials:true},)
    // setTimeout(() => {
    //   setfalse(true);
    // }, 5000);
    // if(!response.ok){
    //   throw new Error('Server response not OK');
    // }
    if(response.status){
    console.log(response.data.file); 
    const base64File = response.data.file;
    const fileType = base64File.substring('data:'.length, ';'.length);
    const fileName = response.data.filename;
   
    const binaryData = atob(base64File.split(',')[1]);
    const length = binaryData.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);
   
    for (let i = 0; i < length; i++) {
       uint8Array[i] = binaryData.charCodeAt(i);
    }
   
    const blob = new Blob([uint8Array], { type: fileType });
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();}}
    catch(err){
      console.log(err);
    }
    // const link = document.createElement('a');
    // link.download = 'Prescription';

    // link.href = '../../../backend/src/'+response.data;

    // link.click();
  }
  return (
    <>
    {/* <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Prescription</Text>
      <button className="btn" onClick={back}>back</button>
    </Box> */}
    <Navigation
      pagetitle={'Prescriptions'}/>
       <Sidebar
      />
      
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
    <div className="content">
        <Box mb={4}>
          <Text mb="2">Filter by Date Time Range:</Text>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="4">
            <Input
              type="datetime-local"
              placeholder="Start Date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)} />
            <Text fontWeight="bold" mx="2">to</Text>
            <Input
              type="datetime-local"
              placeholder="End Date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)} />
          </Box>
          <Select
            placeholder="Filter by Doctor"
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            <option value="Nada">Nada</option>
            <option value="Mariam">Mariam</option>
            <option value="Dareen">Dareen</option>
          </Select>
          <Select
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Filled">Filled</option>
            <option value="Unfilled">Unfilled</option>
          </Select>
        </Box>

        <Box m={7}>
        <Divider my={5}/>
            <SimpleGrid templateColumns={{
                          base: "repeat(auto-fill, minmax( 220px, auto ))",
                          lg: "repeat(auto-fill, minmax( 350px, auto ))",
                        }} columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {
            //if prescriptions > 0 
            filteredPrescriptions &&
            filteredPrescriptions[0] ?
            filteredPrescriptions.map((prescription, index) => (
                <>
                {console.log("presss", prescription)}
                <Prescription data={prescription} keyId={prescription._id} openModal={()=>openModal(prescription)} download={()=>Download(prescription)}/>

                </>
              ))
              : 
              <Box minH={'200px'}>
                <Text>No current prescriptions found</Text>
              </Box>
              
            }
            
            </SimpleGrid>
            </Box>
            </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Prescription Details</ModalHeader>
            <ModalCloseButton />
           
            <ModalBody>
            {selectedPrescription?.Medicine.map((Medicine)=>(
             
               <>
                {console.log(Medicine)}
               <p></p>
               <p>Medicine {i++}</p>
               <p>Medicine Name: {Medicine.MedicineName}</p>
               <p>Medicene Dosage: {Medicine.MedicineDose}</p>
               <p>Quantity: {Medicine.Quantity}</p>
               <p>Instructions: {Medicine.Instructions}</p>
               <br></br>
             
               </>
            ))}
            <p>More Info</p>
            <p>Date: {selectedPrescription?.Date}</p>
               <p>Doctor: {selectedPrescription?.DocUsername}</p>
               <p>Status: {selectedPrescription?.Status}</p>
             
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={closeModal}>
                Close Details
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box></>
  );
};
{/* <Th>Medicine ID</Th>
<Th>Quantity</Th>
<Th>Instructions</Th> 
         <Td>{prescription.Medicine[0].MedicineID}</Td>
                <Td>{prescription.Medicine[0].Quantity}</Td>
                <Td>{prescription.Medicine[0].Instructions}</Td>*/}
export default PrescriptionViewer;
