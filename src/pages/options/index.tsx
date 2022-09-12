import { createRoot } from 'react-dom/client'

import '../../common/i18next'
import { ChakraProvider } from '@chakra-ui/react'

import './index.scss'
import theme from './theme'
import Options from './Options'

(async () => {
  const app = document.querySelector('#app')
  if (!app) return

  const root = createRoot(app)

  root.render(
    <ChakraProvider theme={theme}>
      <Options />
    </ChakraProvider>
  ) 
})()
