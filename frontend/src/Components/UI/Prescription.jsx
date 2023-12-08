import React from 'react'
import { useState } from 'react';
import { Box,
    Divider,
    HStack,
    Text,
    Tag,
    TagLabel,
    TagRightIcon,
    Flex,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    Spacer

  
 } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { m } from 'framer-motion';


function Prescription(
    {data, keyId, callback, download}
) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputList, setinputList]= useState([data.Medicine]);

  return (
    <>
    {console.log("initial", inputList)}
        <Box
            w={'40%'}
            rounded={20}
            minH={'200px'}
            bg={'#eeeeee'}
            boxShadow={'xl'}
            p={10}
        >
          {console.log("im id", keyId)}
          {/* top right date */}
          <Flex justifyContent={'space-between'}>
          <Tag size={'lg'} variant='outline' colorScheme='blue' h={'fit-content'}>
            <TagLabel>{data.Status}</TagLabel>
          </Tag>
            <Text
                fontSize={'xl'}
                fontWeight={'bold'}
                textAlign={'right'}
                mb={10}
            >
              {new Date(data.PrecriptionDate).toLocaleDateString()}
            </Text>
          </Flex> 
            {
              //map through prescriptions
              data.Medicine.map((med, index) => (
                <>
                <HStack m={2}>
                <Text
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    textAlign={'left'}
                >
                  {med.MedicineName}
                </Text>
                <Text
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  Quantity: {med.Quantity}
                </Text>
                <Text
                    ml={1}
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  , {med.Dose} {' '}  {med.Instructions}
                </Text>

                </HStack>
                <Divider />
                </>
              ))
            }

            <Flex mt={10} alignItems={'center'}>
            {
              data.Status === 'Unfilled' && 
              <IconButton
              isRound={true}
              variant='solid'
              colorScheme='teal'
              aria-label='Done'
              fontSize='20px'
              icon={<EditIcon />}
                onClick={() => onOpen()}
              />
            }
            <Button colorScheme="teal" left="5%" onClick={() => download(data)}>Download</Button>
         <Spacer></Spacer>


            <Text
                fontSize={'xl'}
                textAlign={'right'}
                // mt={10}
                fontStyle={'italic'}
            >
              by: {data.DocUsername}
            </Text>
            </Flex>
       </Box>
       <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Flex justifyContent={'space-between'} mx={5}>
            <Text>Med Name</Text>
            <Text>Quantity</Text>
            <Text>Dose</Text>
            <Text>Instructions</Text>
          </Flex>
          {
            data.Medicine.map((med, index) => (
              <>
              <Flex justifyContent={'space-between'} alignItems={'center'} mx={5} my={2}>
                <Text mx={2} fontSize={'lg'} fontWeight={'bold'}>{med.MedicineName}</Text>
                <Input value={med.Quantity}
                  onChange={e => {
                    const list = [...inputList];
                    med.Quantity = e.target.value;
                    setinputList(list);
                  }}
                 />
                <Input value={med.Dose} 
                  onChange={e => {
                    const list = [...inputList];
                    med.Dose = e.target.value;
                    setinputList(list);
                  }}
                />
                <Input value={med.Instructions} 
                  onChange={e => {
                    const list = [...inputList];
                    med.Instructions = e.target.value;
                    setinputList(list);
                  }}
                />
              </Flex>
               
              </>
            ))

          }

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3}
              onClick={() => {
                console.log("inputList", inputList);
                callback(inputList, keyId);
                onClose();
              }}
            >

              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Prescription
