import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Badge,
    Flex,
    Avatar,
    Heading,
    Box,
    Text,
    Button,
    Stack,
} from '@chakra-ui/react';



function PatientCard({patient}) {
    
  return (
    <>
        <Card maxW='md'
            as={'button'}
            variant={'elevated'}
            onClick={() => {
            } }
            minW={'100%'}
            minH={'100%'}

            >
            
            <CardHeader>
            {/* <Flex justifyContent={'flex-end'}>
            {doctor.availability[0] ? <Badge colorScheme='green'
            >Available</Badge> : <Badge colorScheme='red'>Unavailable</Badge>}
            </Flex> */}
            <Flex>
            <Avatar name={patient.PatientName} />
            <Box ml='3'>
                <Text fontWeight='bold' mb={0}>
                {patient.PatientName}
                </Text>
                <Text fontSize='sm'>{patient.PatientUsername}</Text>
            </Box>
            </Flex>
            </CardHeader>
            <CardBody>
            <Stack spacing={2}>
                {
                patient.isUpcoming &&
                <Badge ml='1' colorScheme='green' w={'fit-content'}>
                    Has Upcoming Appointment
                </Badge>
                }


            <Flex alignItems={'center'}>
                {/* <Text fontSize={'sm'} fontWeight={'bold'} mx={1}> Specialty </Text>
                <Text fontSize={'lg'}>{doctor.speciality}</Text> */}
            </Flex>
            <Flex alignItems={'center'}>
                {/* <Text fontSize={'sm'} fontWeight={'bold'} mx={1}> Affiliation </Text>
                <Text fontSize={'lg'}>{doctor.affiliation}</Text> */}
            </Flex> 
            </Stack>
            </CardBody>
        </Card>
    </>
  )
}

export default PatientCard
