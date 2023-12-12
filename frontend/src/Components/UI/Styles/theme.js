import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(accordionAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    bg: 'rgba(0, 0, 0, 0.0)',
    padding: '0px',
    borderColor: 'rgba(0, 0, 0, 0.0)',
  },
  button: {
    bg: 'rgba(0, 0, 255, 0)',
    color: 'cyan.500',
    height: '60px',
    margin: '0px',
    width: '100%',
    _hover: {bg: 'linear-gradient(45deg, #1E9AFE, #60DFCD)',color: 'white',},
  },
});

export const accordionTheme = defineMultiStyleConfig({ baseStyle });
