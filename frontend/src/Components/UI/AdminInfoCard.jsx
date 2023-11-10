import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react';
import './Styles/AdminInfoCard.css';

function AdminInfoCard(props) {
  const { title, username, name, email} = props;

  return (
    <Card w='400px'>
      
      <div className="header-image">
      <CardHeader h='80px'>
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
        </Stack>
      </CardBody>
    </Card>

    

    



  );
}

export default AdminInfoCard;
