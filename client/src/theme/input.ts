import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    border: '1px solid',
    borderColor: 'lightGreen',
    background: 'none',


    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: 'lightGreen',
    background: 'none',
    },
    color: 'teal.500', // change the input text color
    _placeholder: {
      color: 'teal.500',
    }
  },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })