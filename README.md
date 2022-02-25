# Getting Started 

This project is a guided walkthrough on how to integrate MetaMask into an existing application, bootstraped from create-react-app. These same steps should work on any react-based codebase.

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
```
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

### Copy Set up useDApp (https://usedapp.io/)

Replace the existing main index.tsx file with the following:
```
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
