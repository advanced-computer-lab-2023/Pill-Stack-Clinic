import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react';

function DoctorInfoCard(props) {
  const { title, username, name, email, DateOfBirth, HourlyRate,affiliation,EducationalBackground } = props;

  return (
    <Card>
      <CardHeader>
        <Heading size='md'>{title}</Heading>
      </CardHeader>

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
              Hourly Rate:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {HourlyRate}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Affiliation:
            </Heading>
            <Text pt='2' fontSize='sm'>
              {affiliation}
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
        </Stack>
      </CardBody>
    </Card>
  );
}

export default DoctorInfoCard;
