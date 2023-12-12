import React, { useState } from 'react';
import '../UI/Styles/Sidebar.css'; 
import { accordionTheme } from '../UI/Styles/theme.js';
import { HamburgerIcon } from "@chakra-ui/icons";
import { extendTheme } from '@chakra-ui/react'; // Add this import
import pillstackLogo from '../UI/Images/pillstackLogo.png';
import pillstackMini from '../UI/Images/pillstackMini.png';  

import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    AccordionIcon,
  } from '@chakra-ui/react'

function Sidebar() {
  const [isExpanded, setExpanded] = useState(false);

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  const sidebarStyle = {
    width: isExpanded ? '17%' : '65px',
    // marginTop: '70px'
    paddingTop: '7px',
    borderTopRightRadius: '30px', 
     borderBottomRightRadius: '30px', 
  };

  const customAccordionTheme = extendTheme({
    components: {
      Accordion: accordionTheme,
    },
  });
  
  return (
    <div
      className="sidebar"
      style={sidebarStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
         <Box textAlign="center" p={4} mb={4}>
        {isExpanded ? (
          <img src={pillstackLogo} alt="Logo" width="300" height="15" />
        ) : (
            <img
            src={pillstackMini}
            alt="Mini Logo"
            width="60"
            height="15"
            style={{ transform: 'rotate(-90deg) scale(1.5, 1.5)' }}
          />
        )}
      </Box>

   <Accordion defaultIndex={[0]} allowToggle={true} allowMultiple={false} theme={customAccordionTheme}>
   <AccordionItem>
    <h2>
      <AccordionButton>
        <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
        {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Personal
        </Box>
        <AccordionIcon />
        </>
        }
        
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    {isExpanded && 
        <>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          My Prescriptions 
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          My Health Records 
        </Box>
      </AccordionButton>
        </>
        }
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Packages
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
         Subscribe
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
         My Packages
        </Box> 
      </AccordionButton>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Appointments
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          Book
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          My Appointments
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          Family Appointments
        </Box>
      </AccordionButton>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Family
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    {isExpanded && 
        <>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          Manage 
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          View Members
        </Box>
      </AccordionButton>
        </>
        }
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Medical Documents
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    {isExpanded && 
        <>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          Upload 
        </Box>
      </AccordionButton>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          View 
        </Box>
      </AccordionButton>
        </>
        }
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Doctors
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    {isExpanded && 
        <>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          View Available Doctors 
        </Box>
      </AccordionButton>
        </>
        }
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
      <HamburgerIcon w={7} h={7} mr={3}></HamburgerIcon>
      {isExpanded && 
        <>
        <Box as="span" flex='1' textAlign='left'>
          Address
        </Box>
        <AccordionIcon />
        </>
        }
      </AccordionButton>
    </h2>
    <AccordionPanel p={0}>
    {isExpanded && 
        <>
    <AccordionButton>
        <Box as="span" flex='1' textAlign='left' ml={10}>
          Add Delivery Address
        </Box>
      </AccordionButton>
        </>
        }
    </AccordionPanel>
  </AccordionItem>
</Accordion>
    </div>
  );
}

export default Sidebar;
