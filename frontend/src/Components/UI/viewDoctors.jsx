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
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';

export const DoctorSearchAndTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [specialityNotFound, setSpecialityNotFound] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axios.get(
          "http://localhost:8000/patient/viewDoctors",
          { withCredentials: true }
        );
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
    fetchDoctors();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:8000/patient/searchDoctors", {
        name: searchName,
        speciality: speciality,
        date: date,
        time: time,
      });
      if (response.data.length === 0) {
        setSpecialityNotFound(true);
      } else {
        setSpecialityNotFound(false);
      }
      setSearchResults(response.data);
      setSelectedDoctor(null); // Clear the selected doctor
    } catch (error) {
      console.error('Error searching doctors:', error);
    }
  };

  const handleViewAllDoctors = () => {
    setSearchResults([]); // Clear search results to display all doctors
    setSelectedDoctor(null); // Clear the selected doctor
    setSpecialityNotFound(false);
  };


  const handleViewDetails = async (doctor) => {
    setSelectedDoctor(doctor);
    // Use the doctor's username to fetch details from the server
    try {
      const response = await axios.get(
        `http://localhost:8000/patient/selectedDoctorDetails/${doctor.Username}`
      );
      setSelectedDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  return (
   <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Flex direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl>
            <FormLabel>Search by Name or Speciality</FormLabel>
            <Input
              placeholder="Enter name or speciality"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Select Speciality</FormLabel>
            <Select
              placeholder="All Specialities"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            >
              <option value="">All</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurology">Neurology</option>
              <option value="Internal medicine">Internal medicine</option>
              <option value="Death">Death</option>
              <option value="Plastic Surgery">Plastic Surgery</option>
              <option value="Nervous System">Nervous System</option>
              <option value="ENT">ENT</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Select Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Select Time</FormLabel>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormControl>
        </Flex>
        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" type="submit">
            Search
          </Button>
          <Button colorScheme="teal" onClick={handleViewAllDoctors}>
            View All Doctors
          </Button>
        </HStack>
      </form>

      {specialityNotFound && (
        <Box mt={4}>
          <p>Speciality not found</p>
        </Box>
      )}

{selectedDoctor && (
        <Box mt={4}>
          <h2>Selected Doctor Details</h2>
          <p>Specialty: {selectedDoctor.Speciality}</p>
          <p>Affiliation: {selectedDoctor.Affiliation}</p>
          <p>Educational background: {selectedDoctor.EducationalBackground}</p>
        </Box>
      )}

      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Specialty</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {searchResults.length > 0 ? (
            searchResults.map((doctor, index) => (
              <Tr key={index}>
                <Td>{doctor.Name}</Td>
                <Td>{doctor.Speciality}</Td>
                <Td>{doctor.Price}</Td>
                <Td>
                  <Button colorScheme="teal" onClick={() => handleViewDetails(doctor)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            doctors.map((doctor, index) => (
              <Tr key={index}>
                <Td>{doctor.name}</Td>
                <Td>{doctor.speciality}</Td>
                <Td>{doctor.price}</Td>
                <Td>
                  <Button colorScheme="teal" onClick={() => handleViewDetails(doctor)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
 }

export default DoctorSearchAndTable;