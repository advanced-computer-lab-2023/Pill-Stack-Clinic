import React, { useState, useEffect } from 'react';
import {
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
  chakra,
} from '@chakra-ui/react';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchSpeciality, setSearchSpeciality] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availability, setAvailability] = useState([]); // Add a state for availability

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axios.get("http://localhost:8000/patient/viewDoctors", {
          withCredentials: true
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
      searchSpeciality === '' || doctor.speciality.toLowerCase().includes(searchSpeciality.toLowerCase());

    // Filter doctors by date and time
    const dateMatch = (searchDate && doctor.availability.find((a) => a.StartDate.includes(searchDate))) || !searchDate;
    const timeMatch = (searchTime && doctor.availability.find((a) => a.StartDate.includes(searchDate) && a.StartDate.includes(searchTime))) || !searchTime;

    return nameMatch && specialityMatch && dateMatch && timeMatch;
  });

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleViewAvailability = async (doctor) => {
    try {
      const response = await axios.get(`http://localhost:8000/patient/viewDoctorAppointments/${doctor.username}`, {
        withCredentials: true
      });
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <Input
        type="text"
        placeholder="Search for a doctor by name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        mb={2}
      />
      <Select
        placeholder="Search for a doctor by speciality"
        value={searchSpeciality}
        onChange={(e) => setSearchSpeciality(e.target.value)}
        mb={2}
      >
        <option value="">All Specialities</option>
        <option value="ENT">ENT</option>
        <option value="Nervous System">Nearvous System</option>
        <option value="Plastic Surgery">Plastic Surgery</option>
        <option value="Death">Death</option>
        {/* Add other speciality options as needed */}
      </Select>
      <Input
        type="date"
        placeholder="Search by Date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        mb={2}
      />
      <Input
        type="time"
        placeholder="Search by Time"
        value={searchTime}
        onChange={(e) => setSearchTime(e.target.value)}
        mb={2}
      />
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
                handleViewAvailability(doctor); // Fetch availability when clicking on a doctor
              }}
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
            {/* Add more doctor details here */}
            {selectedDoctor?.availability.length > 0 && (
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
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DoctorList;
