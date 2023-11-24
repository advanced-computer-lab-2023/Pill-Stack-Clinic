import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react';
import './Styles/DoctorInfoCard.css';

function PatientInfoCard(props) {
  const { title, username, name, email, DateOfBirth, Gender,MobileNumber,EmergencyContact_Name,EmergencyContact_MobileNumber,WalletBalance, DeliveryAddress } = props;

  return (
    <Card>
      <div className="header-image">
      <CardHeader>
        <Heading size='md'>{title}</Heading>
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
              Name:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {name}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Email:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {email}
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
              Gender:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {Gender}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Mobile Number:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {MobileNumber}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Emergency Contact Name:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {EmergencyContact_Name}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Emergency Contact Number:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {EmergencyContact_MobileNumber}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Wallet Balance:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {WalletBalance}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              My Delivery Address:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {DeliveryAddress}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default PatientInfoCard;
