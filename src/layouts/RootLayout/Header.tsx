import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import "./RootLayout.css";
import {
  Badge,
  IconButton,
  Container,
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  Avatar,
  Button,
  MenuItem,
  InputBase,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Popover,
  Drawer,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { ShopLogo } from "../../assets/icons/ShopLogo";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindHover,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { NestedMenuItem } from "mui-nested-menu";
import ProductsApi from "../../services/api/products";
import {
  Column,
  DrawerState,
  ProductCategory,
  User,
} from "../../commons/Types";
import { RootLayoutType } from "./Layout";
import {
  Link,
  Link as LinkTo,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useSnackbar } from "notistack";
import { SnackBarAction } from "../../commons/Alert";
import { getCartContent, getCartQuantity } from "../../commons/Cart";
import { useWebStore } from "../../providers/WebStoreProvider";
import { NoProductFoundLogo } from "../../assets/icons/NoProductsFound";
import {
  AddShoppingCart,
  Close,
  CurrencyExchangeOutlined,
  PersonOutlineOutlined,
  ShoppingBasketOutlined,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import { BaseUrl } from "../../services";
import { SignUpDrawer } from "../../components/user/SignUp";
import { toggleDrawer } from "../../components/user";
import { LoginDrawer } from "../../components/user/Login";
import { ProfileDrawer } from "../../components/user/Profile";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "200%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    border: "2px solid #bdbdbd",
    borderRadius: "10px",
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

const StyledHoverMenu = styled(HoverMenu)({
  ul: {
    paddingTop: 0,
    paddingBottom: 0,
    li: {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
});

const StyledTableCellBody = styled(TableCell)({
  paddingTop: "8px",
  paddingBottom: "8px",
});

const RootLayoutHeader = (menuLayout: RootLayoutType) => {
  const menu = menuLayout.menu;
  const urlParams = new URLSearchParams(useLocation().search);
  const { pathname } = useLocation();
  const { category, id } = useParams();
  // const [pathInfo, setPathInfo] = useState({
  //   fullPath: pathname,
  //   pathArray: pathname.split("/").filter((p) => !!p),
  // });
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElProducts, setAnchorElProducts] = useState<null | HTMLElement>(
    null
  );
  const [categories, setCategories] = useState<Array<ProductCategory>>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [cartQuantity, setCartQuantity] = useState(getCartQuantity);
  const [cartContent, setCartContent] = useState(getCartContent);
  const {
    webStore: { cartCount, categoryCount },
  } = useWebStore();
  const [drawerState, setDrawerState] = useState<DrawerState>({
    signUp: { top: false, left: false, bottom: false, right: false },
    logIn: { top: false, left: false, bottom: false, right: false },
    profile: { top: false, left: false, bottom: false, right: false },
  });
  // const [user, setUser] = useState<User | undefined>(
  //   localStorage.getItem("user")
  //     ? JSON.parse(localStorage.getItem("user") as string)
  //     : undefined
  // );
  const {
    webStore: { user },
    modifyWebStore,
  } = useWebStore();
  const anchorDrawerSignUp = "right";
  const anchorDrawerLogin = "right";
  const anchorDrawerProfile = "right";

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseProductsMenu = () => {
    setAnchorElProducts(null);
  };

  const popupUserMenu = usePopupState({
    variant: "popover",
    popupId: "userMenu",
  });

  const popupProductsMenu = usePopupState({
    variant: "popover",
    popupId: "productsMenu",
  });

  const popupProductsMenuResponsive = usePopupState({
    variant: "popover",
    popupId: "productsMenuResponsive",
  });

  const popupCartMenu = usePopupState({
    variant: "popover",
    popupId: "cartMenu",
  });

  const handleClickMenu = () => {
    menuLayout.setSearch("");
    menuLayout.setHeader({ ...menuLayout.header, search: "" });
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    enqueueSnackbar(`${user?.username} has been logged out.`, {
      variant: "success",
      autoHideDuration: 4000,
      action: SnackBarAction,
    });
    localStorage.removeItem("user");
    // setUser(undefined);
    modifyWebStore({user: undefined});
    popupUserMenu.close();
  };

  useEffect(() => {
    let unmounted = false;
    ProductsApi.GetProductsCategories()
      .then((res) => {
        if (unmounted) return;
        let tmp: Array<ProductCategory> = res.data.data;
        tmp = tmp.sort((a, b) => {if (a.name.toLowerCase() <= b.name.toLowerCase()) {return -1} else {return 1}});
        modifyWebStore({ categoryCount: tmp.length })
        setCategories(tmp);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
          autoHideDuration: 4000,
          action: SnackBarAction,
        });
      });

    return () => {
      unmounted = true;
    };
  }, [categoryCount]);

  useEffect(() => {
    setCartQuantity(getCartQuantity);
  }, [cartCount]);

  useEffect(() => {
    setCartContent(getCartContent);
  }, [cartCount]);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          backgroundColor: "#4caf50",
        }}
      >
        <Container maxWidth={false}>
          <Marquee gradient={false} speed={80} className="root-layout__marquee">
            WELCOME TO THE SHOP
          </Marquee>
        </Container>
      </div>
      <div>
        <AppBar
          position="sticky"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <Container maxWidth={false}>
            <Toolbar disableGutters sx={{ justifyContent: "center" }}>
              <LinkTo to={"/"}>
                <ShopLogo
                  fill="#4caf50"
                  stroke="#4caf50"
                  width="40px"
                  height="40px"
                />
              </LinkTo>
              <LinkTo to="/home" style={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  sx={{
                    ml: 2,
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#4caf50",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    fontSize: "30px",
                    "&:hover": {
                      color: "#4caf50",
                      textDecoration: "none",
                    },
                  }}
                >
                  Greengrocer
                </Typography>
              </LinkTo>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  {...bindMenu(popupProductsMenuResponsive)}
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {menu.map(({ path, title }, i) => {
                    const pathArray = pathname.split("/").filter((p) => !!p);
                    const activeMenu =
                      pathArray.length > 0 ? pathArray[0] : "home";
                    return title === "products" ? (
                      <LinkTo
                        to={path}
                        style={{ textDecoration: "none" }}
                        key={path}
                        onClick={handleClickMenu}
                      >
                        <NestedMenuItem
                          key={i + "-" + title}
                          parentMenuOpen={Boolean(anchorElNav)}
                          label={title}
                          onClick={handleClickMenu}
                          sx={{
                            my: 2,
                            color: "black",
                            display: "flex",
                            "&:hover": {
                              color: "#4caf50 !important",
                              textDecoration: "none",
                            },
                            textTransform: "uppercase",
                          }}
                          style={{
                            color: title === activeMenu ? "#4caf50" : "",
                            fontWeight: title === activeMenu ? "bold" : "",
                            backgroundColor:
                              title === activeMenu
                                ? "rgba(25, 118, 210, 0.04)"
                                : "",
                          }}
                        >
                          {categories.map((category) => (
                            <LinkTo
                              to={
                                "/products/" +
                                category.name.split(" ").join("_")
                              }
                              style={{
                                textDecoration: "none",
                                color: "#757575",
                              }}
                              key={category.id + "-" + category.name}
                              onClick={handleCloseProductsMenu}
                            >
                              <MenuItem
                                key={category.id + "-" + category.name}
                              >
                                <Typography textAlign="center">
                                  {category.name}
                                </Typography>
                              </MenuItem>
                            </LinkTo>
                          ))}
                        </NestedMenuItem>
                      </LinkTo>
                    ) : (
                      <LinkTo
                        to={path}
                        style={{ textDecoration: "none" }}
                        key={path}
                        onClick={handleClickMenu}
                      >
                        <MenuItem
                          key={i + "-" + title}
                          onClick={handleClickMenu}
                          sx={{
                            my: 2,
                            color: "black",
                            display: "flex",
                            "&:hover": {
                              color: "#4caf50",
                              textDecoration: "none",
                            },
                            textTransform: "uppercase",
                          }}
                          style={{
                            color: title === activeMenu ? "#4caf50" : "",
                            fontWeight: title === activeMenu ? "bold" : "",
                            backgroundColor:
                              title === activeMenu
                                ? "rgba(25, 118, 210, 0.04)"
                                : "",
                          }}
                        >
                          {title}
                          {title === "products" ? <ExpandMoreIcon /> : ""}
                        </MenuItem>
                      </LinkTo>
                    );
                  })}
                  <Menu
                    anchorEl={anchorElProducts}
                    open={Boolean(anchorElProducts)}
                    onClose={handleCloseProductsMenu}
                  >
                    <NestedMenuItem parentMenuOpen={Boolean(anchorElProducts)}>
                      {categories.map((category) => (
                        <MenuItem key={category.id + "-" + category.name}>
                          <Typography textAlign="center">
                            {category.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </NestedMenuItem>
                  </Menu>
                </Menu>
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2, ml: 2 }}>
                {menu.map(({ path, title }, i) => {
                  const pathArray = pathname.split("/").filter((p) => !!p);
                  const activeMenu =
                    pathArray.length > 0 ? pathArray[0] : "home";
                  return title === "products" ? (
                    <LinkTo
                      to={path}
                      style={{ textDecoration: "none" }}
                      key={path}
                      onClick={handleClickMenu}
                    >
                      <Button
                        key={i + "-" + title}
                        {...bindHover(popupProductsMenu)}
                        sx={{
                          my: 2,
                          color: "black",
                          display: "flex",
                          "&:hover": {
                            color: "#4caf50 !important",
                            textDecoration: "none",
                          },
                        }}
                        style={{
                          color: title === activeMenu ? "#4caf50" : "",
                          fontWeight: title === activeMenu ? "bold" : "",
                          backgroundColor:
                            title === activeMenu
                              ? "rgba(25, 118, 210, 0.04)"
                              : "",
                        }}
                      >
                        {title}
                        {title === "products" ? <ExpandMoreIcon /> : ""}
                      </Button>
                    </LinkTo>
                  ) : (
                    <LinkTo
                      to={path}
                      style={{ textDecoration: "none" }}
                      key={path}
                      onClick={handleClickMenu}
                    >
                      <Button
                        key={i + "-" + title}
                        sx={{
                          my: 2,
                          color: "black",
                          display: "flex",
                          "&:hover": {
                            color: "#4caf50",
                            textDecoration: "none",
                          },
                        }}
                        style={{
                          color: title === activeMenu ? "#4caf50" : "",
                          fontWeight: title === activeMenu ? "bold" : "",
                          backgroundColor:
                            title === activeMenu
                              ? "rgba(25, 118, 210, 0.04)"
                              : "",
                        }}
                      >
                        {title}
                        {title === "products" ? <ExpandMoreIcon /> : ""}
                      </Button>
                    </LinkTo>
                  );
                })}
                <HoverMenu
                  {...bindMenu(popupProductsMenu)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  {categories.map((category) => (
                    <LinkTo
                      to={"/products/" + category.name.split(" ").join("_")}
                      style={{ textDecoration: "none", color: "#757575" }}
                      key={category.id + "-" + category.name}
                      onClick={popupProductsMenu.close}
                    >
                      <MenuItem>
                        <Typography textAlign="center">
                          {category.name}
                        </Typography>
                      </MenuItem>
                    </LinkTo>
                  ))}
                </HoverMenu>
              </Box>
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  boxShadow: "none",
                  border: "1px solid #9e9e9e",
                  "&:hover,&:focus-within": {
                    border: "2px solid rgb(11, 176, 226, 0.5) !important",
                  },
                }}
              >
                <SearchIcon style={{ color: "grey", margin: 8 }} />
                <InputBase
                  placeholder="Search…"
                  sx={{ flex: 1 }}
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => {
                    menuLayout.setSearch(e.target.value.trim());
                    if (e.target.value.length === 0) {
                      menuLayout.setHeader({
                        ...menuLayout.header,
                        search: e.target.value.trim(),
                        isKeyEnter: false,
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      menuLayout.setHeader({
                        ...menuLayout.header,
                        search: menuLayout.search.trim(),
                        isKeyEnter: true,
                      });
                      let path = "/products/";
                      if (!id || id === "") {
                        path = category
                          ? "/products/" + category
                          : "/products/";
                      }
                      navigate(path);
                    }
                  }}
                  value={
                    menuLayout.search ||
                      (menuLayout.search === "" && !menuLayout.header.isKeyEnter)
                      ? menuLayout.search
                      : urlParams.get("search")
                        ? urlParams.get("search")
                        : ""
                  }
                />
                {menuLayout.search && menuLayout.search !== "" ? (
                  <IconButton>
                    <Close
                      style={{ fontSize: "16px" }}
                      onClick={() => {
                        menuLayout.setSearch("");
                        menuLayout.setHeader({
                          ...menuLayout.header,
                          search: "",
                          isKeyEnter: false,
                        });
                      }}
                    />
                  </IconButton>
                ) : (
                  ""
                )}
              </Paper>
              <IconButton
                aria-label="cart"
                sx={{ mr: 2, ml: 2 }}
                {...bindHover(popupCartMenu)}
              >
                <Badge badgeContent={cartQuantity.toString()}>
                  <ShoppingCartOutlinedIcon sx={{ fontSize: "28px" }} />
                </Badge>
              </IconButton>
              <StyledHoverMenu
                {...bindMenu(popupCartMenu)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Typography
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    height: "35px",
                  }}
                >
                  Your Cart
                </Typography>
                <Box margin="5px">
                  <TableContainer
                    component={Paper}
                    style={{
                      boxShadow: "none",
                      border: "1px solid #e0e0e0",
                      maxHeight: "300px",
                    }}
                  >
                    <Table aria-label="cart table">
                      <TableHead sx={{ minWidth: "120px" }}>
                        <TableRow>
                          <StyledTableCell align="left">
                            Product
                          </StyledTableCell>
                          <StyledTableCell align="left">Price</StyledTableCell>
                          <StyledTableCell align="left">
                            Quantity
                          </StyledTableCell>
                          <StyledTableCell align="left">Amount</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartContent && cartContent.data.length > 0 ? (
                          cartContent.data.map((row) => (
                            <TableRow
                              hover
                              key={row.name}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <StyledTableCellBody component="th" scope="row">
                                <LinkTo
                                  to={
                                    "/products/" +
                                    row.category?.split(" ").join("_") +
                                    "/" +
                                    row.id
                                  }
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                  onClick={popupCartMenu.close}
                                >
                                  <img
                                    src={BaseUrl + "/" + row.image}
                                    alt={row.name}
                                    width="40px"
                                  />
                                  &nbsp;&nbsp;&nbsp;{row.name}
                                </LinkTo>
                              </StyledTableCellBody>
                              <StyledTableCellBody align="left">
                                ${row.price.toFixed(2)}
                              </StyledTableCellBody>
                              <StyledTableCellBody align="left">
                                {row.quantity}
                              </StyledTableCellBody>
                              <StyledTableCellBody align="left">
                                ${(row.price * row.quantity).toFixed(2)}
                              </StyledTableCellBody>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Grid
                                container
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <NoProductFoundLogo
                                  width="40px"
                                  height="40px"
                                  fill="#9e9e9e"
                                />
                                <Typography
                                  component="div"
                                  style={{ fontSize: "14px" }}
                                >
                                  No Products In Cart
                                </Typography>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      container
                      justifyContent="flex-start"
                    >
                      <Link to={"/cart"} onClick={popupCartMenu.close}>
                        <Tooltip title="Manage Cart" arrow>
                          <IconButton
                            style={{
                              backgroundColor: "rgb(76, 175, 80)",
                              margin: "5px 10px 5px 10px",
                            }}
                          >
                            <ShoppingCartCheckout style={{ color: "white" }} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                      <Link to={"/checkout"} onClick={popupCartMenu.close}>
                        <Tooltip title="Checkout" arrow>
                          <IconButton
                            style={{
                              backgroundColor: "rgb(11, 176, 226)",
                              margin: "5px 0 5px 0",
                            }}
                          >
                            <CurrencyExchangeOutlined
                              style={{ color: "white" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      {cartContent ? (
                        <Typography
                          style={{
                            margin: "10px",
                            fontWeight: "bold",
                            color: "#ff7062",
                          }}
                        >
                          Total: ${cartContent?.total_price.toFixed(2)} /{" "}
                          {cartContent?.total_quantity} items
                        </Typography>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </StyledHoverMenu>
              <Box sx={{ flexGrow: 0 }}>
                {user ? (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconButton style={{ padding: 1 }}>
                      <Avatar
                        alt={user.username}
                        src={BaseUrl + "/" + user.image}
                      />
                    </IconButton>
                    <Box
                      style={{
                        fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                        fontSize: "14px",
                        color: "black",
                        padding: 0,
                        marginLeft: "10px",
                      }}
                    >
                      <Box
                        style={{ fontSize: "12px", display: "flex", justifyContent: "center" }}
                      >
                        <Typography fontSize="12px">Welcome</Typography>
                        <Typography fontWeight="bold" fontSize="12px">
                          &nbsp;{user.username}
                        </Typography>
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            padding: 0,
                            minWidth: "50px",
                            color: "rgb(11, 176, 226)",
                          }}
                          onClick={() =>
                            setDrawerState({
                              ...drawerState,
                              profile: {
                                ...drawerState["profile"],
                                [anchorDrawerProfile]: true,
                              },
                            })
                          }
                        >
                          Profile
                        </Button>
                        <Drawer
                          anchor={anchorDrawerProfile}
                          open={drawerState["profile"][anchorDrawerProfile]}
                          onClose={() =>
                            setDrawerState({
                              ...drawerState,
                              profile: {
                                ...drawerState["profile"],
                                [anchorDrawerProfile]: false,
                              },
                            })
                          }
                          PaperProps={{
                            sx: { width: "15%" },
                          }}
                        >
                          <ProfileDrawer
                            anchor={anchorDrawerProfile}
                            drawerState={drawerState}
                            setDrawerState={setDrawerState}
                            // setUser={setUser}
                            // user={user}
                          />
                        </Drawer>
                        <Typography>|</Typography>
                        <Button
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            padding: 0,
                            minWidth: "55px",
                            color: "rgb(11, 176, 226)",
                          }}
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </Box>
                    </Box>
                    {/* <StyledHoverMenu
                      {...bindMenu(popupUserMenu)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                    >
                      <MenuItem key="logout" onClick={handleLogout}>
                        <Typography textAlign="left" color="#757575">
                          Logout
                        </Typography>
                      </MenuItem>
                    </StyledHoverMenu> */}
                  </Box>
                ) : (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  // {...bindHover(popupUserMenu)}
                  >
                    <IconButton style={{ padding: 1 }}>
                      <PersonOutlineOutlined style={{ fontSize: "40px" }} />
                    </IconButton>
                    <Box
                      style={{
                        fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                        fontSize: "14px",
                        color: "black",
                        padding: 0,
                      }}
                    >
                      <Typography
                        style={{ fontSize: "12px", textAlign: "center" }}
                      >
                        Welcome guest
                      </Typography>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            padding: 0,
                            minWidth: "50px",
                            color: "rgb(11, 176, 226)",
                          }}
                          onClick={() =>
                            setDrawerState({
                              ...drawerState,
                              logIn: {
                                ...drawerState["logIn"],
                                [anchorDrawerSignUp]: true,
                              },
                            })
                          }
                        >
                          Login
                        </Button>
                        <Drawer
                          anchor={anchorDrawerLogin}
                          open={drawerState["logIn"][anchorDrawerLogin]}
                          onClose={() =>
                            setDrawerState({
                              ...drawerState,
                              logIn: {
                                ...drawerState["logIn"],
                                [anchorDrawerLogin]: false,
                              },
                            })
                          }
                          PaperProps={{
                            sx: { width: "15%" },
                          }}
                        >
                          <LoginDrawer
                            anchor={anchorDrawerLogin}
                            drawerState={drawerState}
                            setDrawerState={setDrawerState}
                            // setUser={setUser}
                          />
                        </Drawer>
                        <Typography>|</Typography>
                        <Button
                          size="small"
                          style={{
                            textTransform: "capitalize",
                            padding: 0,
                            minWidth: "62px",
                            color: "rgb(11, 176, 226)",
                          }}
                          onClick={() =>
                            setDrawerState({
                              ...drawerState,
                              signUp: {
                                ...drawerState["signUp"],
                                [anchorDrawerSignUp]: true,
                              },
                            })
                          }
                        >
                          Sign Up
                        </Button>
                        <Drawer
                          anchor={anchorDrawerSignUp}
                          open={drawerState["signUp"][anchorDrawerSignUp]}
                          onClose={() =>
                            setDrawerState({
                              ...drawerState,
                              signUp: {
                                ...drawerState["signUp"],
                                [anchorDrawerSignUp]: false,
                              },
                            })
                          }
                          PaperProps={{
                            sx: { width: "15%" },
                          }}
                        >
                          <SignUpDrawer
                            anchor={anchorDrawerSignUp}
                            drawerState={drawerState}
                            setDrawerState={setDrawerState}
                          />
                        </Drawer>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </div>
    </div>
  );
};

export default RootLayoutHeader;
