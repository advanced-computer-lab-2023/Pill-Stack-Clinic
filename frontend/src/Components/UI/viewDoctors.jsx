import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import axios from 'axios';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axios.get('http://localhost:8000/patient/viewDoctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {doctors.map((doctor, index) => (
            <Tr key={index}>
              <Td>
                <Text
                  _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
                  _hover:after={{
                    content: `"Specialty: ${doctor.specialty}, Price: ${doctor.price}"`,
                  }}
                >
                  {doctor.name}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
export default DoctorTable;