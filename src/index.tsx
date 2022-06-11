import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from "notistack";
import { Slide } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      maxSnack={10}
      hideIconVariant={false}
      TransitionComponent={Slide}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SnackbarProvider>
  </BrowserRouter>
);

reportWebVitals();
