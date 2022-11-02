import { extendTheme } from '@chakra-ui/react'

const theme = {
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },

  styles: {
    global: {
      body: {
        bg: '',
      },
    },
  },
}

export default extendTheme(theme)
