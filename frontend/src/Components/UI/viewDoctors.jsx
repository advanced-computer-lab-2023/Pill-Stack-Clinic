import React, { useState, useEffect } from 'react';
import '../UI/button.css'
import { useNavigate } from "react-router-dom";
import {
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  Flex,
  chakra,
} from '@chakra-ui/react';
import { MdClear } from 'react-icons/md';

import axios from 'axios';
import {BookAppointments} from './bookAppointments.jsx'
const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchSpeciality, setSearchSpeciality] = useState('');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchStartTime, setSearchStartTime] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchEndTime, setSearchEndTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookAppointments, setBookAppointments] = useState(false);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axios.get('http://localhost:8000/patient/viewDoctors', {
          withCredentials: true,
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch = doctor.name.toLowerCase().includes(searchName.toLowerCase());
    const specialityMatch =
      searchSpeciality === '' || doctor.speciality && doctor.speciality.toLowerCase().includes(searchSpeciality.toLowerCase());

    // Filter doctors by date and time range
    const dateMatch =
      (searchStartDate &&
        doctor.availability.find(
          (a) =>
            new Date(a.StartDate).toLocaleDateString('en-US') ===
            new Date(searchStartDate).toLocaleDateString('en-US')
        )) ||
      !searchStartDate;

    const timeMatch =
      (searchStartTime &&
        searchEndTime &&
        doctor.availability.find(
          (a) =>
            new Date(a.StartDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) >=
              searchStartTime &&
            new Date(a.EndDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) <=
              searchEndTime
        )) ||
      !searchStartTime || !searchEndTime;

    return nameMatch && specialityMatch && dateMatch && timeMatch;
  });

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    openModal();
  };
  const handleClear = () => {
    setSearchName('');
    setSearchSpeciality('')
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleBookAppointments=(docusername)=>{
    navigate(`/home/bookAppointments/${docusername}`);

  }

  // const handleViewAvailability = async (doctor) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/patient/viewDoctorAppointments/${doctor.username}`, {
  //       withCredentials: true,
  //     });
  //     setAvailability(response.data);
  //   } catch (error) {
  //     console.error('Error fetching availability:', error);
  //   }
  // };

  return (
    <><Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Doctors</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
          <FormControl mb={4}>
          <Flex alignItems="center" mb={2}>
          <Input
          type="text"
          placeholder="Search for a doctor by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          mb={2} />
        <Select
          placeholder="Search for a doctor by speciality"
          value={searchSpeciality}
          onChange={(e) => setSearchSpeciality(e.target.value)}
          mb={2}
        >
          <option value="">All Specialities</option>
          <option value="ENT">ENT</option>
          <option value="Nervous System">Nervous System</option>
          <option value="Plastic Surgery">Plastic Surgery</option>
          <option value="Death">Death</option>
          {/* Add other speciality options as needed */}
        </Select>
          </Flex>
  
  
          <Button 
            colorScheme="teal" 
            onClick={handleClear} 
            size="sm" 
            fontSize="sm" 
            leftIcon={<MdClear />} 
            mt={2}
          >
            Clear Filters
          </Button>
        </FormControl>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Speciality</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredDoctors.map((doctor, index) => (
              <Tr
                key={index}
                onClick={() => {
                  handleSelectDoctor(doctor);
                 // handleViewAvailability(doctor);
                } }
                style={{ cursor: 'pointer' }}
              >
                <Td>{doctor.name}</Td>
                <Td>{doctor.speciality}</Td>
                <Td>{doctor.price}</Td>


              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Doctor Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Name: {selectedDoctor?.name}</p>
              <p>Speciality: {selectedDoctor?.speciality}</p>
              <p>Affiliation: {selectedDoctor?.affiliation}</p>
              <p style={{ marginBottom: '30px' }}>Educational background: {selectedDoctor?.background}</p>
              {/* {selectedDoctor?.availability.length > 0 && (
                <div>
                  <strong style={{ fontWeight: 'bold' }}>Available Appointments</strong>
                  <ul>
                    {selectedDoctor?.availability.map((appointment, index) => (
                      <li key={index}>
                        Start Date: {appointment.StartDate}, End Date: {appointment.EndDate}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
             <Button colorScheme="teal" onClick={() => handleBookAppointments(selectedDoctor?.username)}>
             Book Appointment
            </Button>

             
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box></>
  );
};

export default DoctorList;