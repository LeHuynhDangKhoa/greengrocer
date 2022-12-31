import Close from "@mui/icons-material/Close";
import NavigateNext from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NoProductFoundLogo } from "../../assets/icons/NoProductsFound";
import { getCartContent } from "../../commons/Cart";
import { CartCheckoutInfo, CartData, CartSession, Coupon, User } from "../../commons/Types";
import MenuRemoveProduct from "../../components/cart/MenuRemoveProduct";
import { useWebStore } from "../../providers/WebStoreProvider";
import { BaseUrl } from "../../services";
import {
  useForm,
  Controller,
  NestedValue,
  SubmitHandler,
} from "react-hook-form";
import ProductsApi from "../../services/api/products";
import { useSnackbar } from "notistack";
import { SnackBarAction } from "../../commons/Alert";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CartApi from "../../services/api/cart";

type UncontrolledInputProps = Omit<TextFieldProps, "value" | "onChange"> & {
  value?: string;
  onChange?: (value: string) => void;
};

const UncontrolledInput: FC<UncontrolledInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue((prev) => value ?? prev);
  }, [value]);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange && onChange(event.target.value);
  };

  return (
    <TextField value={inputValue} onChange={handleChangeInput} {...props} />
  );
};

const breadcrumbs = [
  <Link
    key="1"
    color="inherit"
    to="/home"
    style={{ color: "#616161", fontWeight: "bold" }}
  >
    Greengrocer
  </Link>,
  <Typography key="2" color="text.primary">
    Cart
  </Typography>,
];

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  color: "white",
  fontSize: "16px",
});

const StyledTableCellBody = styled(TableCell)({
  paddingTop: "8px",
  paddingBottom: "8px",
  fontSize: "14px",
});

const StyledTextField = styled(UncontrolledInput)({
  "&& fieldset": {
    // border: "2px solid rgb(11, 176, 226, 0.5)",
    border: "1px solid #9e9e9e",
  },
  "&:hover": {
    "&& fieldset": {
      border: "2px solid rgb(11, 176, 226, 0.5)",
    },
    "&& label": {
      color: "rgb(11, 176, 226)",
    },
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid rgb(11, 176, 226, 0.5) !important",
  },
  "& label": {
    color: "black",
    "&.Mui-focused": {
      color: "rgb(11, 176, 226)",
    },
  },
});

const StyledTextFieldForm = styled(TextField)({
  "&& fieldset": {
    // border: "2px solid rgb(11, 176, 226, 0.5)",
    border: "1px solid #9e9e9e",
  },
  "&:hover": {
    "&& fieldset": {
      border: "2px solid rgb(11, 176, 226, 0.5)",
    },
    "&& label": {
      color: "rgb(11, 176, 226)",
    },
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid rgb(11, 176, 226, 0.5) !important",
  },
  "& label": {
    color: "#9e9e9e",
    fontSize: "14px",
    fontWeight: "bold",
    "&.Mui-focused": {
      color: "rgb(11, 176, 226)",
    },
  },
});

type CustomerInfoForm = {
  name: string;
  address: string;
};

const defaultValues = {
  name: "",
  address: "",
};

const StyledMenu = styled(Menu)({
  ul: {
    paddingTop: 0,
    paddingBottom: 0,
    li: {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
});

const Cart = () => {
  const [cartContent, setCartContent] = useState(getCartContent);
  const [cartChange, setCartChange] = useState<Array<CartData>>(
    getCartContent()?.data || []
  );
  const {
    webStore: { cartCount },
    modifyWebStore,
  } = useWebStore();
  const validationCustomerInfoSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
  }).required();
  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CustomerInfoForm>({
    defaultValues,
    resolver: yupResolver(validationCustomerInfoSchema),
  });
  const [couponValue, setCouponValue] = useState("");
  const [coupon, setCoupon] = useState<Coupon | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorElUpdate, setAnchorElUpdate] = useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleOpenUpdate = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUpdate(event.currentTarget);
  };

  const handleCloseUpdate = () => {
    setAnchorElUpdate(null);
  };

  const handleCouponInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponValue(e.target.value);
  };

  const handleChangeQuantity = (product: CartData, quantity: number) => {
    let data = cartChange.map((item) =>
      item.id === product.id
        ? {
          ...item,
          quantity: isNaN(quantity) ? 0 : quantity,
        }
        : item
    );
    let cart: CartSession | undefined;
    if (data.length > 0) {
      let total_price = 0;
      let total_quantity = 0;
      for (let i = 0; i < data.length; i++) {
        total_price += data[i].price * data[i].quantity;
        total_quantity += data[i].quantity;
      }
      cart = {
        ...cart,
        data: data,
        total_price: total_price,
        total_quantity: total_quantity,
      };
    } else {
      cart = undefined;
    }
    setCartContent(cart);

    setCartChange((prev) =>
      prev.map((item) => ({
        ...item,
        quantity:
          item.id === product.id
            ? isNaN(quantity)
              ? 0
              : quantity
            : item.quantity,
      }))
    );
  };

  const handleRemoveProduct = (product: CartData) => {
    setCartChange(cartChange.filter((item) => item.id !== product.id));
    setCartContent({
      ...cartContent,
      data: cartContent
        ? cartContent.data.filter((item) => item.id !== product.id)
        : [],
      total_price: cartContent
        ? cartContent.total_price - product.price * product.quantity
        : 0,
      total_quantity: cartContent
        ? cartContent.total_quantity - product.quantity
        : 0,
    });
  };

  const handleUpdateCart = () => {
    let cart: CartSession | undefined;
    let data: Array<CartData> = cartChange
      ? cartChange.filter((item) => item.quantity > 0)
      : [];
    if (data.length > 0) {
      let total_price = 0;
      let total_quantity = 0;
      for (let i = 0; i < data.length; i++) {
        total_price += data[i].price * data[i].quantity;
        total_quantity += data[i].quantity;
      }
      cart = {
        ...cart,
        data: data,
        total_price: total_price,
        total_quantity: total_quantity,
      };
    } else {
      cart = undefined;
    }
    setCartContent(cart);
    cart
      ? localStorage.setItem("cart", JSON.stringify(cart))
      : localStorage.removeItem("cart");
    modifyWebStore({ cartCount: cartCount + 1 });
  };

  const handleResetCart = () => {
    setCartContent(getCartContent);
    setCartChange(getCartContent()?.data || []);
  };

  const handleCheckout: SubmitHandler<CustomerInfoForm> = (data) => {
    if (localStorage.getItem("user")) {
      let cart = cartContent;
      let total_price = cart ? coupon ? cart.total_price * (1 - coupon.discount) : cart.total_price : 0;
      cart = cart ? { ...cart, total_price: parseFloat(total_price.toFixed(2)) } : undefined;
      localStorage.setItem("cart", JSON.stringify(cart));
      const user: User = JSON.parse(localStorage.getItem("user") as string)
      const tmp: CartCheckoutInfo = {
        user_id: user.id,
        username: user.username,
        customer_name: data.name,
        customer_address: data.address,
        detail: JSON.parse(localStorage.getItem("cart") as string),
      }
      CartApi.StoreCart(tmp)
        .then((res) => {
          enqueueSnackbar(`Store cart successfully.`, {
            variant: "success",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
          localStorage.removeItem("cart");
          modifyWebStore({ cartCount: cartCount + 1 });
          navigate("/products")
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.message, {
            variant: "error",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
        });
    } else {
      enqueueSnackbar("You must login to checkout.", {
        variant: "warning",
        autoHideDuration: 4000,
        action: SnackBarAction,
      });
    }
  };

  const handleAppleCoupon = () => {
    if (couponValue.length > 0) {
      ProductsApi.CouponDetail(couponValue)
        .then((res) => {
          setCoupon(res.data.data);
          enqueueSnackbar("Apply coupon successfully.", {
            variant: "success",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
          // let cart = cartContent;
          // let total_price = cart ? cart.total_price*res.data.data.discount : 0;
          // cart = cart ? {...cart, total_price: total_price} : undefined;
          // // let total_price = cartContent && coupon && cartContent.total_price*coupon?.discount : undefined;
          // localStorage.setItem("cart", JSON.stringify(cart));
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.message, {
            variant: "error",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
        });
    } else {
      enqueueSnackbar("Please input coupon code.", {
        variant: "warning",
        autoHideDuration: 4000,
        action: SnackBarAction,
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: 25 }}>
        <Grid container style={{ display: "flex", alignItems: "center" }}>
          <Grid item xs={12} sm={6} container justifyContent="flex-start">
            <Stack spacing={2} marginBottom={2}>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </Stack>
          </Grid>
        </Grid>
        <Grid container>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              border: "1px solid #e0e0e0",
              maxHeight: "600px",
            }}
          >
            <Table aria-label="cart table">
              <TableHead>
                <TableRow style={{ backgroundColor: "#4caf50" }}>
                  <StyledTableCell align="left">Product</StyledTableCell>
                  <StyledTableCell align="left">Price</StyledTableCell>
                  <StyledTableCell align="left">Quantity</StyledTableCell>
                  <StyledTableCell align="left">Amount</StyledTableCell>
                  <StyledTableCell align="left" width="5%"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartContent && cartContent.data.length > 0 ? (
                  cartContent.data.map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <StyledTableCellBody component="th" scope="row">
                        <Link
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
                        >
                          <img
                            src={BaseUrl + "/" + row.image}
                            alt={row.name}
                            width="60px"
                          />
                          &nbsp;&nbsp;&nbsp;{row.name}
                        </Link>
                      </StyledTableCellBody>
                      <StyledTableCellBody align="left">
                        ${row.price.toFixed(2)}
                      </StyledTableCellBody>
                      <StyledTableCellBody align="left">
                        <StyledTextField
                          InputProps={{ inputProps: { min: 0 } }}
                          label="Quantity"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          style={{ marginRight: "5px", maxWidth: "150px" }}
                          variant="outlined"
                          value={
                            cartChange
                              ? isNaN(
                                cartChange.filter(
                                  (item) => item.id === row.id
                                )[0].quantity
                              )
                                ? "0"
                                : cartChange
                                  .filter((item) => item.id === row.id)[0]
                                  .quantity.toString()
                              : "0"
                          }
                          onChange={(value) =>
                            handleChangeQuantity(row, parseInt(value, 10))
                          }
                        />
                      </StyledTableCellBody>
                      <StyledTableCellBody align="left">
                        $
                        {(cartChange
                          ? isNaN(
                            cartChange.filter((item) => item.id === row.id)[0]
                              .quantity
                          )
                            ? 0
                            : cartChange.filter((item) => item.id === row.id)[0]
                              .quantity * row.price
                          : 0
                        ).toFixed(2)}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {/* <Tooltip title="Remove">
                          <IconButton onClick={handleOpenRemove} >
                            <Close sx={{ fontSize: "20px" }} />
                            {row.id + " " + row.name}
                          </IconButton>
                        </Tooltip>
                        <StyledMenu
                          key={row.id}
                          id={row.id.toString()}
                          anchorEl={anchorElRemove}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          open={Boolean(anchorElRemove)}
                          onClose={() => setAnchorElRemove(null)}
                        >
                          <Box sx={{ padding: "15px" }}>
                            <Typography textAlign="center">Are you sure to remove this product from cart?</Typography>
                            <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px" }}>
                              <Button
                                variant="contained"
                                size="medium"
                                style={{
                                  minWidth: "30px",
                                  marginRight: "40px",
                                  backgroundColor: "#4caf50",
                                }}
                                onClick={handleCloseRemove}
                              >
                                No
                              </Button>
                              <Button
                                variant="contained"
                                size="medium"
                                color="error"
                                style={{
                                  minWidth: "30px",
                                }}
                                onClick={(e) => {
                                  setAnchorElRemove(null)
                                  console.log("ddddddddddddddddddddd: ", row.id)
                                  handleRemoveProduct(e, row.id)
                                }}
                              >
                                Yes
                              </Button>
                            </Box>
                          </Box>
                        </StyledMenu> */}

                        <MenuRemoveProduct
                          product={row}
                          handleRemoveProduct={handleRemoveProduct}
                        />
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
        </Grid>
        <Grid
          container
          style={{ display: "flex", alignItems: "center", marginTop: 15 }}
        >
          <Grid item xs={12} sm={6} container justifyContent="flex-start">
            <Link
              to={"/products"}
              style={{ textDecoration: "none", justifyContent: "flex-start" }}
            >
              <Button
                variant="contained"
                size="medium"
                style={{
                  minWidth: "30px",
                  marginRight: "15px",
                  backgroundColor: "#4caf50",
                }}
              >
                Continue Shopping
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
            <Button
              variant="contained"
              size="medium"
              color="warning"
              style={{
                minWidth: "30px",
                justifyContent: "flex-end",
                marginRight: "10px",
              }}
              onClick={handleResetCart}
            >
              Reset
            </Button>
            <Tooltip title="">
              <Button
                variant="contained"
                size="medium"
                style={{
                  minWidth: "30px",
                  backgroundColor: "rgb(11, 176, 226)",
                  justifyContent: "flex-end",
                }}
                onClick={handleOpenUpdate}
              >
                Update Cart
              </Button>
            </Tooltip>
            <StyledMenu
              id="Update Cart"
              anchorEl={anchorElUpdate}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElUpdate)}
              onClose={() => setAnchorElUpdate(null)}
              style={{ marginTop: "15px" }}
            >
              <Box sx={{ padding: "15px" }}>
                <Typography textAlign="center">
                  Are you sure to update your cart?
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      minWidth: "30px",
                      marginRight: "40px",
                      backgroundColor: "#4caf50",
                    }}
                    onClick={handleCloseUpdate}
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    // color="error"
                    style={{
                      minWidth: "30px",
                      backgroundColor: "rgb(11, 176, 226)",
                    }}
                    onClick={(e) => {
                      setAnchorElUpdate(null);
                      handleUpdateCart();
                    }}
                  >
                    Yes
                  </Button>
                </Box>
              </Box>
            </StyledMenu>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit(handleCheckout)}>
          <Grid container style={{ marginTop: 45 }}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{ width: "90%" }}
                elevation={0}
                style={{ border: "1px solid #e0e0e0" }}
              >
                <CardContent style={{ padding: "12px" }}>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Customer Infomation
                  </Typography>
                  <Divider />
                  <Controller
                    render={({ field }) => (
                      <StyledTextFieldForm
                        size="small"
                        label="Name"
                        {...field}
                        style={{ width: "100%", marginTop: "15px" }}
                        error={!!errors.name}
                      />
                    )}
                    name="name"
                    control={control}
                  />
                  {errors.name && (
                    <Typography
                      color="error"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.name.message}
                    </Typography>
                  )}
                  <Controller
                    render={({ field }) => (
                      <StyledTextFieldForm
                        size="small"
                        label="Address"
                        {...field}
                        style={{ width: "100%", marginTop: "15px" }}
                        error={!!errors.address}
                      />
                    )}
                    name="address"
                    control={control}
                  />
                  {errors.address && (
                    <Typography
                      color="error"
                      style={{ fontSize: "12px" }}
                    >
                      {errors.address.message}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{ width: "80%" }}
                elevation={0}
                style={{ border: "1px solid #e0e0e0", marginLeft: "10%" }}
              >
                <CardContent style={{ padding: "12px" }}>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Coupon
                  </Typography>
                  <Divider />
                  <Typography style={{ marginTop: "15px" }}>
                    Enter your coupon code if you have one
                  </Typography>
                  <StyledTextFieldForm
                    size="small"
                    label="Code"
                    style={{ width: "100%", marginTop: "15px" }}
                    onChange={handleCouponInput}
                    value={couponValue}
                  />
                  <Box
                    sx={{ flexGrow: 1 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        minWidth: "100px",
                        backgroundColor: "rgb(11, 176, 226)",
                        display: "flex",
                        justifyContent: "center",
                      }}
                      onClick={handleAppleCoupon}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ flexGrow: 1 }}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Card
                sx={{ width: "90%" }}
                elevation={0}
                style={{ border: "1px solid #e0e0e0" }}
              >
                <CardContent
                  style={{
                    padding: "12px",
                    fontFamily: "Roboto,Helvetica,Arial,sans-serif",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 16, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Cart Total
                  </Typography>
                  <Divider />
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      Price
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      ${(cartContent ? cartContent.total_price : 0).toFixed(2)}
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      Discount{" "}
                      {coupon ? "(" + coupon.discount * 100 + "%)" : ""}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      $
                      {(coupon
                        ? cartContent
                          ? cartContent.total_price * coupon.discount
                          : 0
                        : 0
                      ).toFixed(2)}
                    </Grid>
                  </Grid>
                  <Divider style={{ marginTop: "15px" }} />
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      Total
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ color: "black" }}>
                      $
                      {(
                        (cartContent ? cartContent.total_price : 0) -
                        (coupon
                          ? cartContent
                            ? cartContent.total_price * coupon.discount
                            : 0
                          : 0)
                      ).toFixed(2)}
                    </Grid>
                  </Grid>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "15px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      style={{
                        minWidth: "100px",
                        backgroundColor: "rgb(11, 176, 226)",
                      }}
                      type="submit"
                    >
                      Checkout
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Cart;
