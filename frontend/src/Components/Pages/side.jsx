import React from 'react';
import '../UI/Styles/Sidebar.css'; 
import { accordionTheme } from '../UI/Styles/theme.js';
import { HamburgerIcon,SettingsIcon,ArrowRightIcon } from "@chakra-ui/icons";
import { extendTheme } from '@chakra-ui/react'; // Add this import
import pillstackLogo from '../UI/Images/pillstackLogo.png';
import pillstackMini from '../UI/Images/pillstackMini.png';  
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  AccordionIcon,
} from '@chakra-ui/react';

function Sidebar(props) {
  const {
    openSecondModal,
    openAddFamilyModal,
    openViewFamilyModal,
    openUploadDocModal,
    navigate,
    username,
    name,
    onOpenModal,
    onLogout,
    openAddDeliveryModal,
  } = props;

  const sidebarStyle = {
    width: '15%',
    paddingTop: '7px',
    borderTopRightRadius: '0px', 
    borderBottomRightRadius: '0px', 
  };

  const customAccordionTheme = extendTheme({
    components: {
      Accordion: accordionTheme,
    },
  });

  return (
    <div className="sidebar" style={sidebarStyle}>
      <Link to="/home">
      <Box textAlign="center" p={5} mb={1} mr={1}>
        <img src={pillstackLogo} alt="Logo" width="220" />
      </Box>
    </Link>

     <br />
      <Accordion defaultIndex={[0]} allowToggle={true} allowMultiple={false} theme={customAccordionTheme}>
        <AccordionItem  >
          <h2>
            <AccordionButton>
              <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
              <Box as="span" flex='1' textAlign='left'>
                Personal
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={0}>
          <Link to="/home/prescriptions" style={{ textDecoration: 'none', color: 'inherit' }}> 
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10}>
              
                My Prescriptions 
                
              </Box>
            </AccordionButton>
            </Link>
            <Link to={`/my-health-records/${username}/${name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <AccordionButton>
              
              <Box as="span" flex='1' textAlign='left' ml={10}>
                My Health Records 
              </Box>
            </AccordionButton>
            </Link>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
              <Box as="span" flex='1' textAlign='left'>
                Packages
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel p={0}>
          <Link to={`/home/viewPackages/${username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10}>
                Subscribe
              </Box>
            </AccordionButton>
            </Link>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' ml={10} onClick={openSecondModal}>
                My Packages
              </Box> 
            </AccordionButton>
          </AccordionPanel>
        </AccordionItem>

        
<AccordionItem>
  <h2>
    <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      <Box as="span" flex='1' textAlign='left'>
        Appointments
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel p={0}>
  <Link to="/home/viewDoctors">
    <AccordionButton>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        Book
      </Box>
    </AccordionButton>
    </Link>
    <Link to="/home/apptsP">
    <AccordionButton>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        My Appointments
      </Box>
    </AccordionButton>
    </Link>

    
    <Link to="/home/familyAppointments">
    <AccordionButton>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        Family Appointments
      </Box>
    </AccordionButton>
    </Link>
  </AccordionPanel>
</AccordionItem>

<AccordionItem>
  <h2>
    <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      <Box as="span" flex='1' textAlign='left'>
        Family
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel p={0}>
    <AccordionButton onClick={openAddFamilyModal}>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        Manage 
      </Box>
    </AccordionButton>
    <AccordionButton onClick={openViewFamilyModal}>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        View Members
      </Box>
    </AccordionButton>
  </AccordionPanel>
</AccordionItem>

<AccordionItem>
  <h2>
    <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      <Box as="span" flex='1' textAlign='left'>
        Medical Documents
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel p={0}>
    <AccordionButton onClick={openUploadDocModal}>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        Upload 
      </Box>
    </AccordionButton>
    <AccordionButton onClick={openUploadDocModal}>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        View 
      </Box>
    </AccordionButton>
  </AccordionPanel>
</AccordionItem>
<AccordionItem>
  <h2>
    <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      <Box as="span" flex='1' textAlign='left'>
        Doctors
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>

  <AccordionPanel p={0}>

  
  <Link to="/home/viewDoctors">
    <AccordionButton>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        View Available Doctors 
      </Box>
    </AccordionButton>
    </Link>
  </AccordionPanel>
</AccordionItem>

<AccordionItem>
  <h2>
    <AccordionButton >
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      <Box as="span" flex='1' textAlign='left'>
        Address
      </Box>
      <AccordionIcon />
    </AccordionButton>
  </h2>
  <AccordionPanel p={0}>
    <AccordionButton onClick={openAddDeliveryModal}>
      <Box as="span" flex='1' textAlign='left' ml={10}>
        Add Delivery Address
      </Box>
    </AccordionButton>
  </AccordionPanel>
</AccordionItem>

<AccordionItem style={{ position: 'fixed', bottom: 10, marginTop: 'auto' }}>
  <AccordionButton
    onClick={onLogout}
    _hover={{
      textDecoration: 'underline',
    }}
  >
    <ArrowRightIcon w={4} h={4} mr={4}></ArrowRightIcon>
    <Box  flex="1" textAlign="left">
      Log Out
    </Box>
  </AccordionButton>
</AccordionItem>

      </Accordion>
    </div>
  );
}

export default Sidebar;
