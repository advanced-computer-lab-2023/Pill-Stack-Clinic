import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Box, Text, Icon } from '@chakra-ui/react';
import { Heading, Stack, StackDivider } from '@chakra-ui/react';
import { EditIcon, CheckCircleIcon } from '@chakra-ui/icons';
import './Styles/DoctorInfoCard.css';
import { ToastContainer, toast } from "react-toastify";


function DoctorInfoCard(props) {
  const { title, username, email, HourlyRate, affiliation, name, DateOfBirth, EducationalBackground,WalletBalance,id } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    email,
    HourlyRate,
    affiliation,
  });

  // Set the initial state based on props
  useEffect(() => {
    setEditedData({
      email,
      HourlyRate,
      affiliation,
    });
  }, [email, HourlyRate, affiliation]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:8000/doctor/profile/edit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });
  
      if (response.ok) {
        toast.success('Information Updated Successfully', {
          position: 'top-right',
          autoClose: 3000, // 3 seconds
        });
        setIsEditing(false);
      } else {
        // Handle error response
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      // Handle network-related errors
      console.error('Network Error:', error.message);
    }
  };
  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  return (
    <Card w='700px'>
      <div className="header-image">
        <CardHeader h='80px' display="flex" justifyContent="space-between">
          <Heading size='md'>{title}</Heading>
          {isEditing ? (
            <CheckCircleIcon 
              color="white"
              boxSize={6}
              cursor="pointer"
              _hover={{ color: 'grey' }}
              onClick={handleSaveClick}
            />
          ) : (
            <EditIcon
              color="white"
              boxSize={6}
              cursor="pointer"
              _hover={{ color: 'grey' }}
              onClick={handleEditClick}
            />
          )}
        </CardHeader>
      </div>

      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Username:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {username}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Email:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {isEditing ? (
                <input
                  type="text"
                  name="email"
                  value={editedData.email}
                  onChange={handleInputChange}
                  style={{ color: 'blue' }}
                />
              ) : (
                editedData.email
              )}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Hourly Rate:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {isEditing ? (
                <input
                  type="text"
                  name="HourlyRate"
                  value={editedData.HourlyRate}
                  onChange={handleInputChange}
                  style={{ color: 'blue' }}
                />
              ) : (
                editedData.HourlyRate
              )}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Affiliation:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {isEditing ? (
                <input
                  type="text"
                  name="affiliation"
                  value={editedData.affiliation}
                  onChange={handleInputChange}
                  style={{ color: 'blue' }}
                />
              ) : (
                editedData.affiliation
              )}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Name:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {name}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Date Of Birth:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {DateOfBirth}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Educational Background:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {EducationalBackground}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Wallet
            </Heading>
            <Text pt='2' fontSize='sm'>
              {WalletBalance}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default DoctorInfoCard;
