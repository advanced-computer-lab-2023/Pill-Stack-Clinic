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
    color: 'white',
    height: '60px',
    margin: '0px',
    width: '100%',
  },
});

export const accordionTheme = defineMultiStyleConfig({ baseStyle });
