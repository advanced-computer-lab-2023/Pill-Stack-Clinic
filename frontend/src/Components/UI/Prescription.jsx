import React from 'react'
import { Box,
    Divider,
    HStack,
    Text,
    Tag,
    TagLabel,
    TagRightIcon,
    Flex,
    IconButton,
    Button,
    Spacer

  
 } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';


function Prescription(
    {data, key,download}
)

 {
  return (
    <>
        <Box
            w={'40%'}
            rounded={20}
            minH={'200px'}
            bg={'#eeeeee'}
            boxShadow={'xl'}
            p={10}
        >
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
    </>
  )
}

export default Prescription
