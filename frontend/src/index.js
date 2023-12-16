// import React from 'react';
// import { createRoot } from 'react-dom';

// import ReactDOM from 'react-dom/client';
// import App from './App';
// import'./index.css';
// import{BrowserRouter} from 'react-router-dom'
// import { ChakraProvider } from "@chakra-ui/react"
// import'react-toastify/dist/ReactToastify.css';
// // import reportWebVitals from './reportWebVitals';

// const root = createRoot(document.getElementById('root'));
// root.render(
  
//     <BrowserRouter>
//         <ChakraProvider>

//     <App 
//     />
//     </ChakraProvider>
//     </BrowserRouter>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();

import React from 'react';
import { createRoot } from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </BrowserRouter>
);
