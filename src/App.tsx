import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import theme from './theme';
import Layout from './components/Layout';
import ConnectButton from './components/ConnectButton';
import AccountModal from './components/AccountModal';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <ConnectButton handleOpenModal={onOpen}/>
        <AccountModal isOpen={isOpen} onClose={onClose}/>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
