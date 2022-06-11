import "./App.css";
import Home from "./pages/home/Home";
import RootLayout from "./layouts/RootLayout/Layout";
import {
  useRoutes,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Products from "./pages/products/Products";
import Cart from "./pages/cart/Cart";
import ProductDetail from "./pages/products/ProductDetail";
import PageNotFound from "./pages/pageNotFound/pageNotFound";
import WebStoreProvider from "./providers/WebStoreProvider";

function App() {
  const theme = createTheme({ shape: { borderRadius: 8 } });
  theme.components = {
    MuiBadge: {
      styleOverrides: {
        badge: {
          right: 1,
          top: 5,
          border: `2px solid ${theme.palette.background.paper}`,
          backgroundColor: "#4caf50",
          color: "white",
          width: 25,
          height: 25,
          borderRadius: "50%",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {},
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(211, 47, 47)",
        },
        icon: {
          color: "rgb(255, 255, 255) !important",
        },
        message: {
          color: "rgb(255, 255, 255)",
        },
        action: {
          color: "rgb(255, 255, 255)",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        anchorOriginTopRight: {
          top: theme.spacing(15),
          right: "0px",
          left: "auto",
        },
        root: {
          anchorOriginTopRight: {
            top: theme.spacing(15),
            right: "0px",
            left: "auto",
          },
        },
        [theme.breakpoints.down("xs")]: {
          top: "115px",
          right: "0px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          ":last-child": {
            paddingBottom: 0,
          },
        },
      },
    },
  };

  //https://typescript.tv/react/upgrade-to-react-router-v6/
  const mainRoutes = {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "home", element: <Home /> },
      {
        path: "/",
        children: [
          {
            path: "products",
            element: <Products />,
            children: [{ path: ":category", element: <Products /> }],
          },
          {
            path: "products/:category/:id",
            element: <ProductDetail />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
        ],
      },
      { path: "*", element: <PageNotFound /> },
    ],
  };

  const routing = useRoutes([mainRoutes]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <WebStoreProvider>
          {routing}
        </WebStoreProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
