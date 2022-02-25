# Getting Started 

This project is a guided walkthrough on how to integrate MetaMask into an existing application, bootstraped from create-react-app. These same steps should work on any react-based codebase.

**Note: For the maximum benefit, please try not to clone this repo before completing the tutorial below.**

## Pre-requisites

In order to proceed, you need to:
1. Install the MetaMask browser extension from https://metamask.io/download
2. Check your nodeJS version and ensure it is at least version 14 with: ```node -v```
3. Install yarn globally with: ```npm install -g yarn```

### Let's Begin

Let's use create-react-app to bootstrap our React app:
```npx create-react-app metamask-demo --template typescript```

*Note: Make sure yarn is installed and your nodeJS version is at least 14*.


### Delete the node_modules folder and package-lock.json file.

`rm -rf node_modules package-lock.json`


### Install dependencies using yarn

`yarn install`


### Install a few more libraries

`yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion @usedapp/core`


### Set up useDApp (https://usedapp.io/)

Replace the existing main index.tsx file with the following:
```javascript
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import DAppProvider
import { DAppProvider } from '@usedapp/core';

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={{}}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### Set up App.tsx and Components Folder

Inside your `src` folder, create a new folder called `components`
`mkdir components`

Create a file called `Layout.tsx` inside the `components` folder:
`touch Layout.tsx`

Paste the following code block inside `Layout.tsx`:

```javascript
import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.800"
    >
      {children}
    </Flex>
  )
}
```

Modify App.tsx with the following:
```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Layout from './components/Layout';

function App() {
  return (
    <ChakraProvider>
      <Layout>
        <p style={{ color: "white" }}>Hello world!</p>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
```
### Create the "Connect to Wallet" Button

Inside the `components` folder, we need to create a new file called `ConnectButton.tsx`:
`touch ConnectButton.tsx`

```javascript
// ConnectButton.tsx
import { Button, Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";

export default function ConnectButton() {
  const {activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

	function handleConnectWallet() {
	  activateBrowserWallet();
	}

  return account ? (
    <Box>
      <Text color="white" fontSize="md">
        {etherBalance && JSON.stringify(etherBalance)} ETH
      </Text>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet}>Connect a Wallet</Button>
  );
}
```
At this point the Connect a Wallet button component should work by triggering a prompt from inside your MetaMask wallet.

Hit connect and select the account you wish to use inside your Metamask wallet (if you have more than 1 option).

### Styling the Connect Button Component
We are now going to update the Connect Button Component to properly format the wallet account balance.

Inside the `ConnectButton.tsx` component, add the following:
`import { formatEther } from '@ethersproject/units;`

Replace the `Box` component containing the etherBalance logic with the following:

```javascript
<Box px="3">
  <Text color="white" fontSize="md">
    { etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3) } ETH
  </Text>
</Box>
```

Your ETH balance should now be display with 3 decimal points to make it easier to read.
*Note: If you want to use the Ropsten ETH network, you can grab some free test ETH at https://ropsten.oregonctf.org/*

We are going to now add some additional styles the the `ConnectButton.tsx` component:
```javascript
// ConnectButton.tsx
import { Button, Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

export default function ConnectButton() {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          // check account is defined and then slice the string
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
      </Button>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet}>Connect to a wallet</Button>
  );
}
```

Right now the Styles should be looking much more presentable...

We are going to add an avatar icon next to the account to make it more insync with MetaMask's design.

Let us go back to the terminal and add a new library. Make sure you are back inside the root directory of the project and run the following in your terminal:
`yarn add @metamask/jazzicon`


Let's create a new component in our `components` folder called `Identicon.tsx`:

`touch Identicon.tsx`

Paste the following code block inside `Identicon.tsx`:

```javascript
// Identicon.tsx
import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import styled from "@emotion/styled";
import Jazzicon from '@metamask/jazzicon';

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledIdenticon ref={ref as any}/>
}
```

To prevent a potential Typescript error modify your `react-app-env.d.ts` file inside the root project directory. Add the following code block:
```javascript
declare module "@metamask/jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement;
}
```

Next we are going to create an Account Modal that displays account information and allows you to perform actions on your account such as view on etherscane, disconnect wallet, switch wallet, etc...

### Creating the Account Modal
Next, let us go back to our `components` folder and create a new file called `AccountModal.tsx`:
`touch AccountModal.tsx`

Let us also add a new library from `@chakra-ui`:
`yarn add @chakra-ui/icons`

Now let us paste the following code block into the `AccountModal.tsx` file:
```javascript
import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useEthers } from "@usedapp/core";
import Identicon from "./Identicon";

export default function AccountModal() {
  const { account, deactivate } = useEthers();

  return (
    <Modal isCentered size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="gray.400" fontSize="sm">
                Connected with MetaMask
              </Text>
              <Button
                onClick={handleDeactivateAccount}
                variant="outline"
                size="sm"
                borderColor="blue.800"
                borderRadius="3xl"
                color="blue.500"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "blue.300",
                  textDecoration: "underline",
                }}

              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              <Identicon />
              <Text
                color="white"
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {account &&
                  `${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                  )}`}
              </Text>
            </Flex>
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color="gray.400"
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                  color: "whiteAlpha.800",
                }}
              >
                <CopyIcon mr={1} />
                Copy Address
              </Button>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`https://ropsten.etherscan.io/address/${account}`}
                isExternal
                color="gray.400"
                ml={6}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          background="gray.700"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          <Text
            color="white"
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          >
            Your transactions willl appear here...
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

}
````

We now have to create a way to trigger the AccountModal. Let us modify `App.tsx`. We are going to add a hook from Chakra called useDisclose in order to grab pre-built modal interactions:

We are going to update our import from `@chakra-ui/react` to read:
`import { ChakraProvider, useDisclosure } from '@chakra-ui/react';`

Next we will define our modal action from the `useDisclosure()` hook. This line goes inside the App function but before the return block:
`const { isOpen, onOpen, onClose } = useDisclosure();`

After updating the props on the `ConnectButton` and `AccountModal` components the `App.tsx` file should now look like this:
*Note inside the repo I have a theme folder, but that is not needed here.*


```javascript
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import Layout from './components/Layout';
import ConnectButton from './components/ConnectButton';
import AccountModal from './components/AccountModal';

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider>
      <Layout>
        <ConnectButton handleOpenModal={onOpen}/>
        <AccountModal isOpen={isOpen} onClose={onClose}/>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
```

We now need to update our `ConnectButton` component to handle the new props being passed down. Paste this code block after the imports and before we define the `ConnectButton` component:

```javascript
type Props = {
  handleOpenModal: () => void; // this means the props is expected to be a function
}
```

Inside the first `Button` component declared inside the render function we need to add an `onClick` prop:
`onClick={handleOpenModal}`

Next, we need to declare the new props as an argument where `ConnectButton` is defined. Paste the following code block INSIDE the `ConnectButton` function as an argument:
`{ handleOpenModal }: Props`


The `ConnectButton` component should now look like this:
```javascript
import { Button, Box, Text } from '@chakra-ui/react';
import { useEthers, useEtherBalance } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';
import Identicon from './Identicon';

type Props = {
  handleOpenModal: () => void;
}

export default function ConnectButton({ handleOpenModal }: Props) {
  
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          { etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3) } ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: '1px',
          borderStyle: 'solid',
          borderColor: 'blue.400',
          backgroundColor: 'gray.700'
        }}
        borderRadius='xl'
        m='1px'
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          { account && 
            `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`
          }
        </Text>
        <Identicon/>
        
      </Button>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet}>Connect to a Wallet</Button>
  );
}
```

Inside the `AccountModal.tsx` component we need to define our `Props` here as well. Paste the following code block after the imports and before the `AccountModal` component is defined:

```javascript
type Props = {
  isOpen: boolean;
  onClose: () => void;
}
```

Paste the following argument inside `AccountModal()`:
`{ isOpen, onClose }: Props`

Create a new function inside the `AccountModal` function but before the return block. This will be called `handleDeactivateAccount`:
```javascript
function handleDeactivateAccount() {
    deactivate();
    onClose();
  }
```

Next, add an `onClick` prop to the Disconnect button referencing the function we just crfeated
Next, we need to update the `Modal` component with `isOpen` and `onClose` props.

Your `AccountModal.tsx` file should look like this:

```javascript
import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useEthers } from "@usedapp/core";
import Identicon from "./Identicon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: Props) {
  const { account, deactivate } = useEthers();

  // Add a function to handle deactivating account
  function handleDeactivateAccount() {
    deactivate();
    onClose();
  }

  return (
    <Modal isCentered size="md" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="gray.400" fontSize="sm">
                Connected with MetaMask
              </Text>
              <Button
                onClick={handleDeactivateAccount}
                variant="outline"
                size="sm"
                borderColor="blue.800"
                borderRadius="3xl"
                color="blue.500"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "blue.300",
                  textDecoration: "underline",
                }}

              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              <Identicon />
              <Text
                color="white"
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {account &&
                  `${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                  )}`}
              </Text>
            </Flex>
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color="gray.400"
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                  color: "whiteAlpha.800",
                }}
              >
                <CopyIcon mr={1} />
                Copy Address
              </Button>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`https://ropsten.etherscan.io/address/${account}`}
                isExternal
                color="gray.400"
                ml={6}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          background="gray.700"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          <Text
            color="white"
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          >
            Your transactions willl appear here...
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

}
```

We should now be able to click the Connect a Wallet button and display the wallet address and account balance from your metamask wallet. This can be applied to an existing react app or your can start fresh.

*Note: As of today, you can only truly disconnect your Metamask wallet from a site from inside Metamask. Documentation can be found [here](https://metamask.zendesk.com/hc/en-us/articles/360059535551-Disconnect-wallet-from-a-dapp)*