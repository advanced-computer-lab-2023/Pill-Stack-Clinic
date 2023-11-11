import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Text,
} from '@chakra-ui/react';

const MyHealthRecords = () => {
  const { patientUsername, patientName } = useParams();
  const [healthRecords, setHealthRecords] = useState([]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/patient/viewMyHealthRecords/${patientUsername}/${patientName}`, { withCredentials: true });
        if (response.status === 200) {
          setHealthRecords(response.data.healthRecords);
        } else {
          console.error('Failed to fetch health records');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHealthRecords();
  }, [patientUsername]);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold">
        Health Records for {patientUsername}
      </Text>
      <Table variant="simple" mt={4}>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Record Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {healthRecords.map((record, index) => (
            <Tr key={index}>
              <Td>{new Date(record.RecordDate).toLocaleDateString()}</Td>
              <Td>{record.RecordDetails}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MyHealthRecords;
