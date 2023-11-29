import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../UI/button.css'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Box,
  Container,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Stack
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useDisclosure } from "@chakra-ui/react";
import Prescription from './Prescription';


const DoctorPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newRecordInput, setNewRecordInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [followUpPatient, setFollowUpPatient] = useState('');
  const [availability, setAvailability] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [isOpenPrescriptions, setIsOpenPrescriptions] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navigate = useNavigate();
  const back =()=>  navigate(-1);

  const onClosePrescriptions = () => setIsOpenPrescriptions(false);

  useEffect(() => {
    console.log('Patients:', patients);
  }, [patients]);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get('http://localhost:8000/doctor/myPatients', {
          withCredentials: true,
        });

        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const statusMatches = statusFilter === 'All' || patient.Status === statusFilter;
    const nameMatches = patient.PatientName && patient.PatientName.toLowerCase().includes(searchInput.toLowerCase());
    const dateMatches = (
      startDate === null ||
      endDate === null ||
      (new Date(patient.StartDate) >= startDate && new Date(patient.StartDate) <= endDate)
    );

    return statusMatches && nameMatches && dateMatches;
  });

  const openPatientDetails = async (patient) => {
    const response = await axios.post('http://localhost:8000/doctor/myPatients/viewPatient',{username:patient.PatientUsername}, {
      withCredentials: true, // Include credentials if necessary
    });

    setSelectedPatient(response.data);
  };

  const closePatientDetails = () => {
    setSelectedPatient(null);
  };

  const openModal = async (patient) => {
    setIsModalOpen(true);
    setConfirmationMessage('');
    setErrorMessage('');
    setFollowUpPatient(patient);

    try {
      setIsLoadingAvailability(true);
      const response = await axios.get(
        'http://localhost:8000/doctor/availability',
        { withCredentials: true }
      );
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const scheduleFollowUp = async () => {
    if (appointment !== null) {
      const response = await axios.post('http://localhost:8000/doctor/scheduleFollowUp', { oldAppointment: followUpPatient, newAppointment: appointment }, {
        withCredentials: true,
      });

      if (response.data === 'follow up booked successfully') {
        setConfirmationMessage(response.data);
        setIsModalOpen(false);
      } else {
        setIsError(true);
        setErrorMessage(response.data);
      }
    } else {
      setIsError(true);
      setErrorMessage('Please select an appointment');
    }
  };

  const addHealthRecord = async (patient) => {
    try {
      const response = await axios.post('http://localhost:8000/doctor/addHealthRecord', {
        PatientUsername: patient.PatientUsername,
        PatientName: patient.PatientName,
        RecordDetails: newRecordInput,
      },
        { withCredentials: true });

      if (response.status === 201) {
        alert('Health record added successfully!');
      } else {
        alert('Failed to add health record. Please try again.');
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      alert('Failed to add health record. Please try again.');
    }
  };
  const openUploadDocModal = (patient) => {
    setPatientData(patient);
    setIsUploadDocModalOpen(true);
  };

  const closeUploadDocModal = () => {
    setIsUploadDocModalOpen(false);
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

  const handleAddPrescription = () => {
    // Add a new prescription to the patient's prescriptions array
    const newPrescription = {
      name: '',
      dosage: '',
      instructions: '',
    };

    const updatedPrescriptions = [...patientData.Prescriptions, newPrescription];

    setPatientData({
      ...patientData,
      Prescriptions: updatedPrescriptions,
    });
  }
  


  return (
    <>
    <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>My Patients</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
    <Box m={10} p={4} borderWidth="1px" borderRadius="md" shadow="md">
      {confirmationMessage && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle>Confirmation</AlertTitle>
          <AlertDescription>{confirmationMessage}</AlertDescription>
        </Alert>
      )}
      <h1>My Patients</h1>
      <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">completed</option>
        <option value="cancelled">cancelled</option>
        <option value="rescheduled">rescheduled</option>
      </Select>
      <Input
        type="text"
        placeholder="Search by Patient Name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)} />
      <Text fontSize="md" mb="2">Filter by Date Range:</Text>
      <Flex justifyContent="space-between" mb="4">
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select Start Date"
            dateFormat="MMMM d, yyyy" />
        </FormControl>
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select End Date"
            dateFormat="MMMM d, yyyy" />
        </FormControl>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Status</Th>
            <Th>Start Date</Th>
            <Th>End Date </Th>
            <Th> </Th>
            <Th> </Th>
            <Th> </Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPatients.map((patient, index) => (
            <Tr key={index}>
              <Td>{patient.PatientName}</Td>
              <Td>{patient.Status}</Td>
              <Td>{new Date(patient.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
              <Td>{new Date(patient.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>

              <Td>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => openPatientDetails(patient)}
                    >
                      View Details
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Patient Details</PopoverHeader>
                    {selectedPatient!==null && ( <PopoverBody>
                    <p>Patient username: {selectedPatient.Username}</p>
                    <p>Email: {selectedPatient.Email}</p>
                    <p>DOB: {new Date(selectedPatient.DateOfBirth).toLocaleDateString('en-US')}</p>
                    <p>Phone number: {selectedPatient.MobileNumber}</p>
                    <span
                    style={{ color: 'teal', cursor: 'pointer' }}
                    onClick={() => openUploadDocModal(selectedPatient)}
                    >
                    View Medical History
                    </span>

                  </PopoverBody>)}
                      
                  </PopoverContent>
                </Popover>
              </Td>
              <Td>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => openPatientDetails(patient)}
                    >
                      Add Health Record
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Health Record</PopoverHeader>
                    <PopoverBody>
                      <Input
                        type="text"
                        placeholder='Input Record Here'
                        value={newRecordInput}
                        onChange={(e) => setNewRecordInput(e.target.value)} />
                      <Button
                        marginTop="10px"
                        size="sm"
                        alignSelf="end"
                        onClick={() => addHealthRecord(patient)}
                      >
                        Save
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => openModal(patient)}
                >
                  Schedule a follow up
                </Button>
              </Td>
              <Td>
                <Link to={`/my-health-records/${patient.PatientUsername}/${patient.PatientName}`}>
                  <Button size="sm" colorScheme="teal">
                    View Health Records
                  </Button>
                </Link>
              </Td>
              <Td>
                <Button size="sm" colorScheme="teal"
                  onClick={() => {
                    // setPatientData(patient);
                    // setIsOpenPrescriptions(true)
                    navigate(`/doctor/prescriptions/${patient.PatientUsername}`);
                  }
                  }>
                  Manage Prescriptions
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setFollowUpPatient('');
        setIsError(false);
        setErrorMessage('');
      } }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isError && (<Alert status='error'>
              <AlertIcon />
              <AlertTitle>Missing input</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>)}
            <FormControl>
              <FormLabel>Select appointment</FormLabel>
              <Select
                value={appointment}
                onChange={(e) => {
                  setAppointment(e.target.value);
                } }
              >
                <option value="">Select</option>
                {isLoadingAvailability ? (
                  <option>Loading Appointments..</option>
                ) : (
                  availability.map((appointment) => (
                    <option key={appointment._id} value={appointment._id}>
                      {new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })} {new Date(appointment.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => scheduleFollowUp()}>
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
isOpen={isUploadDocModalOpen}
onClose={closeUploadDocModal}

size="2xl"
>
<ModalOverlay />
<ModalContent h="700px">
  <ModalHeader>Upload Medical Document</ModalHeader>
  <ModalCloseButton />
  <ModalBody pb={9}>
    

    {/* Display existing files in a table */}
    <Stack mt={6} spacing={4}>
<Table variant="striped" colorScheme="teal" size="md">
  <Thead>
    <Tr>
      <Th>File Name</Th>
      <Th>File Path</Th>
      <Th>Action</Th> {/* Add Action header for the View button */}
    </Tr>
  </Thead>
  <Tbody>
    {patientData?.medicalHistory?.map((file, index) => (
      <Tr key={index}>
        <Td>{file.name}</Td>
        <Td>{file.path}</Td>
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
  <Button onClick={closeUploadDocModal}>Cancel</Button>
</ModalFooter>
</ModalContent>
</Modal>

      <Modal onClose={onClosePrescriptions} size={'6xl'} isOpen={isOpenPrescriptions}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {patientData.PatientName}'s Prescriptions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              patientData.Prescriptions ?
              patientData.Prescriptions.map((prescription, index) => (
                <Prescription/>
              ))
              : 
              <Box minH={'200px'}>
                <Text>No current prescriptions found</Text>
              </Box>
            }
            <Button
              colorScheme='teal'
              variant={'outline'}
              onClick={() => handleAddPrescription()}
            >
              Add Prescription
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </>
  );
};

export default DoctorPatientsTable;
