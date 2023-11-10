import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text } from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Center,AbsoluteCenter , Square, Circle } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon, AddIcon, EmailIcon ,EditIcon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom'; // Import the Link component

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'


function ShortcutsCard(props) {
  const { title, username, name, email} = props;

  return (
    <Card>

<CardHeader h='80px'>
          <Heading size='md'>Shortcuts</Heading>
          </CardHeader>
<Grid
  h='300px'
  w='400px'
  templateRows='repeat(2, 1fr)'
  templateColumns='repeat(2, 1fr)'
  gap={1}
>
  <Card _hover={{ bg: '#d8d8d8' }}> <AbsoluteCenter > <a href="/admin-users"><AddIcon boxSize={5}/> </a><br /></AbsoluteCenter >  </Card>
  <Card _hover={{ bg: '#d8d8d8' }}> <AbsoluteCenter > <a href="/bla"> <DeleteIcon boxSize={5} /> </a></AbsoluteCenter >  </Card>
  <Card _hover={{ bg: '#d8d8d8' }}> <AbsoluteCenter > <a href="admin-requests"><EmailIcon boxSize={5}/> </a></AbsoluteCenter >  </Card>
  <Card _hover={{ bg: '#d8d8d8' }}> <AbsoluteCenter > <a href="/bla"><EditIcon boxSize={5}/> </a></AbsoluteCenter >  </Card>

</Grid>
</Card>
  );
}

export default ShortcutsCard;
