import { Close, PhotoCamera, ShoppingCartOutlined } from "@mui/icons-material";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Rating,
  Select,
  Stack,
  Tooltip,
  styled,
  Typography,
  FormControl,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SnackBarAction } from "../../commons/Alert";
import { addProductToCart } from "../../commons/Cart";
import { CartData, CartSession, Product, ProductCategory } from "../../commons/Types";
import { useWebStore } from "../../providers/WebStoreProvider";
import { BaseUrl } from "../../services/index";
import NoImageAvalable from "../../assets/images/no-image-available.png";
import { userInfo } from "os";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ProductsApi from "../../services/api/products";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// export const ProductCard = ({
//   uid,
//   name,
//   star,
//   price,
//   discount,
//   kind,
//   image,
//   category,
// }: Product & { category?: string }) => {
//   const [hoverCard, setHoverCard] = useState(false);
//   const { enqueueSnackbar } = useSnackbar();
//   const {
//     webStore: { cartCount },
//     modifyWebStore,
//   } = useWebStore();

//   const handleAddProduct = (
//     e: React.MouseEvent<HTMLElement>,
//     productName?: string
//   ) => {
//     enqueueSnackbar(productName + " is added to your card", {
//       variant: "success",
//       autoHideDuration: 4000,
//       action: SnackBarAction,
//     });

//     modifyWebStore({ cartCount: cartCount+1 })
//     AddProductToCart({ uid, name, star, price, discount, kind, image }, category);
//   };

//   return (
//     <Card
//       sx={(theme) => ({
//         maxWidth: 200,
//         minHeight: 285,
//         border: `1px solid ${theme.palette.divider}`,
//         p: 1,
//         borderRadius: 1,
//       })}
//       elevation={0}
//       onMouseOver={() => setHoverCard(true)}
//       onMouseOut={() => setHoverCard(false)}
//     >
//       <Link
//         to={"/products/" + category?.split(" ").join("_") + "/" + uid}
//         style={{ textDecoration: "none" }}
//       >
//         <Box
//           sx={{ position: "relative" }}
//           component="div"
//           style={{
//             overflow: "hidden",
//             position: "relative",
//             display: "inline-block",
//             cursor: "pointer",
//           }}
//         >
//           <CardMedia
//             component="img"
//             height="auto"
//             width="100%"
//             image={BaseUrl + "/" + image}
//             alt={name}
//             sx={{
//               overflow: "hidden",
//               borderRadius: 1,
//               "&:hover": {
//                 transform: "scale3d(1.2, 1.2, 1.2)",
//                 transitionDuration: "400ms",
//               },
//             }}
//           />
//           {discount && discount > 0 ? (
//             <Box
//               sx={(theme) => ({
//                 position: "absolute",
//                 left: 0,
//                 top: 0,
//                 width: "auto",
//                 bgcolor: "#ff7062",
//                 color: "white",
//                 padding: "0 5px 0 5px",
//                 borderRadius: "8px 0 8px 0",
//               })}
//               style={{
//                 fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
//                 fontSize: "14px",
//               }}
//             >
//               {discount * 100 + "% OFF"}
//             </Box>
//           ) : (
//             ""
//           )}
//         </Box>
//       </Link>
//       <Box>
//         <CardContent
//           style={{
//             textAlign: "center",
//             textTransform: "capitalize",
//             padding: "0px !important",
//           }}
//         >
//           <Typography component="div" fontWeight="bold" fontSize="16px">
//             {discount && discount > 0 ? (
//               <span
//                 style={{
//                   color: "#ff7062",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 {"$" + (price * (1 - discount)).toFixed(2)}
//                 <span
//                   style={{
//                     marginLeft: "5px",
//                     color: "#b3b3b3",
//                     fontSize: "12px",
//                     textDecoration: "line-through",
//                   }}
//                 >
//                   {"$" + price.toFixed(2)}
//                 </span>
//               </span>
//             ) : (
//               "$" + price.toFixed(2)
//             )}
//           </Typography>
//           <Typography
//             gutterBottom
//             component="div"
//             color="rgb(56, 56, 61)"
//             fontWeight="initial"
//             fontSize="14px"
//           >
//             {name}
//           </Typography>
//           {hoverCard ? (
//             <IconButton
//               aria-label="cart"
//               style={{
//                 padding: 0,
//                 backgroundColor: "#4caf50",
//                 minWidth: "25px",
//                 minHeight: "25px",
//               }}
//               onClick={(e) => handleAddProduct(e, name)}
//               // onClick={() => {
//               //   enqueueSnackbar(name, {
//               //     variant: 'success',
//               //     autoHideDuration: 4000,
//               //     action: SnackBarAction
//               //   })
//               // }}
//             >
//               <ShoppingCartOutlined sx={{ fontSize: "15px", color: "white" }} />
//             </IconButton>
//           ) : (
//             <Rating name="read-only" value={star} readOnly size="small" />
//           )}
//           {/* {hoverCard ? (
//             <IconButton
//               aria-label="cart"
//               style={{
//                 padding: 0,
//                 backgroundColor: "#4caf50",
//                 minWidth: "25px",
//                 minHeight: "25px",
//               }}
//               onClick={(e) => modifyWebStore({ cartCount: cartCount+1 })}
//               // onClick={() => {
//               //   enqueueSnackbar(name, {
//               //     variant: 'success',
//               //     autoHideDuration: 4000,
//               //     action: SnackBarAction
//               //   })
//               // }}
//             >
//               <ShoppingCartOutlined sx={{ fontSize: "15px", color: "white" }} />
//             </IconButton>
//           ) : (
//             <Rating name="read-only" value={star} readOnly size="small" />
//           )} */}
//         </CardContent>
//       </Box>
//     </Card>
//   );
// };

const StyleInput = styled("input")({
  display: "none",
});

const StyledHookFormControl = styled(FormControl)({
  "&& fieldset": {
    // border: "3px solid rgb(11, 176, 226, 0.5)",
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
    "&.Mui-focused": {
      color: "rgb(11, 176, 226)",
    },
  },
});

const StyledTextarea = styled("textarea")({
  "&:hover": {
    border: "2px solid rgb(11, 176, 226, 0.5)",
  },
  borderRadius: "8px",
});

const defaultProductValues: Product = {
  id: 0,
  image: "",
  price: 0,
  name: "",
  discount: 0,
  description: "",
  star: 3,
};

export const ProductCard: FC<{
  product: Product,
  category?: string,
  reload?: boolean
}> = ({
  product,
  category,
  reload
}) => {
    const [hoverCard, setHoverCard] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const {
      webStore: { user, cartCount },
      modifyWebStore,
    } = useWebStore();
    const [openEditProductModal, setOpenEditProductModal] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(reload);
    const [productImage, setProductImage] = useState(product.image as string);
    // const [defaultEditProductValues, setDefaultEditProductValues] = useState(defaultProductValues);
    const validationProductSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      price: Yup.number().positive("Price is required and must be a positive number").required("Price is required and must be a positive number"),
      discount: Yup.number().min(0, "Discount must be greater than or equal to 0").max(1, "Discount must be less than or equal to 100").required("Discount's value is from 0 to 100"),
    }).required();
    const {
      handleSubmit: handleSubmitProduct,
      reset: resetProduct,
      setValue,
      control: controlProduct,
      formState: { errors: errorsProduct },
    } = useForm<Product>({
      defaultValues: product,
      resolver: yupResolver(validationProductSchema),
    });
    const imageRef = useRef<HTMLInputElement>(null);
    const [changeCategories, setChangeCategories] = useState(product.category_id);
    const [categories, setCategories] = useState<Array<ProductCategory>>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const handleAddProduct = (
      e: React.MouseEvent<HTMLElement>,
      productName?: string
    ) => {
      enqueueSnackbar(productName + " is added to your card", {
        variant: "success",
        autoHideDuration: 4000,
        action: SnackBarAction,
      });

      modifyWebStore({ cartCount: cartCount + 1 })
      addProductToCart(product, category);
    };

    const handleOpenEditProductModal = (product: Product) => {
      setOpenEditProductModal(true);
    };

    const handleCloseEditProductModal = () => {
      setOpenEditProductModal(false);
    };

    const handleEditProduct: SubmitHandler<Product> = (data) => {
      ProductsApi.EditProduct(product.id.toString(), data)
        .then((res) => {
          enqueueSnackbar(`Update product '${data.name}' successfully.`, {
            variant: "success",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
          // resetProduct(defaultProductValues);
          handleCloseEditProductModal();
          setProductImage("");
          setReloadFlag(!reloadFlag);
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.message, {
            variant: "error",
            autoHideDuration: 4000,
            action: SnackBarAction,
          });
        });
    };

    const handleChangeProductImage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newImage = event.target?.files?.[0];
      if (newImage) {
        let reader = new FileReader();
        reader.onloadend = function () {
          setProductImage(reader.result as string);
        };
        reader.readAsDataURL(newImage);
      }
    };

    const handleClearProductImage = () => {
      setProductImage("");
      if (imageRef !== null && imageRef.current !== null)
        imageRef.current.value = "";
    };

    useEffect(() => {
      let unmounted = false;
      setCategoriesLoading(true);

      ProductsApi.GetProductsCategories()
        .then((res) => {
          if (unmounted) return;
          let tmp: Array<ProductCategory> = res.data.data;
          tmp = tmp.sort((a, b) => {
            if (a.name.toLowerCase() <= b.name.toLowerCase()) {
              return -1
            } else {
              return 1
            }
          });
          let all = {
            id: 0,
            name: "All",
            total: 0,
          };
          setChangeCategories(tmp[0].id)
          setValue("category_id", tmp[0].id);
          if (tmp.length > 0) {
            for (let i = 0; i < tmp.length; i++) {
              all.total += tmp[i].total;
            }
          }
          tmp.unshift(all);
          setCategories(tmp);
          setCategoriesLoading(false);
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
    }, [reloadFlag]);

    return (
      <Card
        sx={(theme) => ({
          maxWidth: 200,
          minHeight: 285,
          border: `1px solid ${theme.palette.divider}`,
          p: 1,
          borderRadius: 1,
        })}
        elevation={0}
        onMouseOver={() => setHoverCard(true)}
        onMouseOut={() => setHoverCard(false)}
      >
        <Link
          to={"/products/" + category?.split(" ").join("_") + "/" + product.id}
          style={{ textDecoration: "none" }}
        >
          <Box
            sx={{ position: "relative" }}
            component="div"
            style={{
              overflow: "hidden",
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              // height="100%"
              width="100%"
              image={product.image !== "" ? BaseUrl + "/" + product.image : NoImageAvalable}
              alt={product.name}
              sx={{
                overflow: "hidden",
                borderRadius: 1,
                "&:hover": {
                  transform: "scale3d(1.2, 1.2, 1.2)",
                  transitionDuration: "400ms",
                },
              }}
            />
            {product.discount && product.discount > 0 ? (
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "auto",
                  bgcolor: "#ff7062",
                  color: "white",
                  padding: "0 5px 0 5px",
                  borderRadius: "8px 0 8px 0",
                })}
                style={{
                  fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
                  fontSize: "14px",
                }}
              >
                {(product.discount * 100).toFixed(1) + "% OFF"}
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Link>
        <Box>
          <CardContent
            style={{
              textAlign: "center",
              textTransform: "capitalize",
              padding: "0px !important",
            }}
          >
            <Typography component="div" fontWeight="bold" fontSize="16px">
              {product.discount && product.discount > 0 ? (
                <span
                  style={{
                    color: "#ff7062",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {"$" + (product.price * (1 - product.discount)).toFixed(2)}
                  <span
                    style={{
                      marginLeft: "5px",
                      color: "#b3b3b3",
                      fontSize: "12px",
                      textDecoration: "line-through",
                    }}
                  >
                    {"$" + product.price.toFixed(2)}
                  </span>
                </span>
              ) : (
                "$" + product.price.toFixed(2)
              )}
            </Typography>
            <Typography
              gutterBottom
              component="div"
              color="rgb(56, 56, 61)"
              fontWeight="initial"
              fontSize="14px"
            >
              {product.name}
            </Typography>
            {hoverCard ? (
              user && user?.role == "admin" ? (
                <>
                  <IconButton
                    aria-label="cart"
                    style={{
                      padding: 0,
                      margin: "1px",
                      backgroundColor: "rgb(11, 176, 226)",
                      minWidth: "25px",
                      minHeight: "25px",
                    }}
                    onClick={() => handleOpenEditProductModal(product)}
                  >
                    <BorderColorIcon sx={{ fontSize: "15px", color: "white" }} />
                  </IconButton>
                  <Dialog
                    open={openEditProductModal}
                    onClose={handleCloseEditProductModal}
                    maxWidth="sm"
                    fullWidth
                  >
                    <form onSubmit={handleSubmitProduct(handleEditProduct)}>
                      <Grid
                        container
                        sx={{ fontSize: 16, fontWeight: "bold" }}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Grid item xs={12} sm={6}>
                          <DialogTitle fontWeight="bold">Edit Product</DialogTitle>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          style={{ display: "flex", justifyContent: "right" }}
                        >
                          <DialogTitle>
                            <IconButton onClick={handleCloseEditProductModal}>
                              <Close style={{ fontSize: "18px" }} />
                            </IconButton>
                          </DialogTitle>
                        </Grid>
                      </Grid>
                      <Divider />
                      <DialogContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <Controller
                          render={({ field }) => (
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginTop: "15px",
                              }}
                            >
                              <Tooltip title="Upload" arrow placement="right">
                                <Stack>
                                  <StyleInput
                                    accept="image/*"
                                    id="upload-button-file"
                                    multiple
                                    type="file"
                                    ref={imageRef}
                                    onChange={(event) => {
                                      if (
                                        event.target.files &&
                                        event.target.files.length > 0
                                      )
                                        field.onChange(event.target.files[0]);
                                      handleChangeProductImage(event);
                                    }}
                                  />
                                  <label htmlFor="upload-button-file">
                                    <Button
                                      aria-label="upload picture"
                                      component="span"
                                    >
                                      <Avatar
                                        alt=""
                                        src={productImage !== "" ? BaseUrl + "/" + productImage : NoImageAvalable}
                                        sx={{ width: 150, height: 150 }}
                                        variant="square"
                                      >
                                        <PhotoCamera />
                                      </Avatar>
                                    </Button>
                                  </label>
                                </Stack>
                              </Tooltip>
                              {productImage.length > 0 && (
                                <Button
                                  size="small"
                                  style={{
                                    padding: 0,
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                    color: "rgb(11, 176, 226)",
                                  }}
                                  onClick={handleClearProductImage}
                                >
                                  {" "}
                                  Clear
                                </Button>
                              )}
                            </Box>
                          )}
                          name="image"
                          control={controlProduct}
                        />
                        <Controller
                          render={({ field }) => (
                            <Box style={{
                              marginTop: "15px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                              <Rating
                                // name="star-controlled"
                                {...field}
                                defaultValue={3}
                                onChange={(e, newValue) => {
                                  setValue("star", newValue as number);
                                }}
                              />
                            </Box>
                          )}
                          name="star"
                          control={controlProduct}
                        />
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              render={({ field }) => (
                                <StyledHookFormControl
                                  style={{ width: "100%", marginTop: "15px" }}
                                >
                                  <InputLabel
                                    htmlFor="name"
                                    style={{ display: "flex", fontWeight: "bold" }}
                                  >
                                    Name{" "}
                                    <Typography color="error">&nbsp;*</Typography>
                                  </InputLabel>
                                  <OutlinedInput
                                    id="name"
                                    {...field}
                                    label="Name"
                                    error={!!errorsProduct.name}
                                    style={{ width: "95%" }}
                                  />
                                  {errorsProduct.name && (
                                    <Typography
                                      color="error"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {errorsProduct.name.message}
                                    </Typography>
                                  )}
                                </StyledHookFormControl>
                              )}
                              name="name"
                              control={controlProduct}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}
                            style={{ display: "flex", justifyContent: "right" }}>
                            <Controller
                              render={({ field }) => (
                                <StyledHookFormControl
                                  style={{ width: "95%", marginTop: "15px" }}
                                >
                                  <InputLabel
                                    htmlFor="price"
                                    style={{ display: "flex", fontWeight: "bold" }}
                                  >
                                    Price{" "}
                                    <Typography color="error">&nbsp;*</Typography>
                                  </InputLabel>
                                  <OutlinedInput
                                    id="price"
                                    {...field}
                                    onChange={(val) => setValue("price", Number(val.target.value))}
                                    label="Price"
                                    error={!!errorsProduct.price}
                                    type="number"
                                    inputProps={{ step: 0.01 }}
                                  />
                                  {errorsProduct.price && (
                                    <Typography
                                      color="error"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {errorsProduct.price.message}
                                    </Typography>
                                  )}
                                </StyledHookFormControl>
                              )}
                              name="price"
                              control={controlProduct}
                            />
                          </Grid>
                        </Grid>
                        <Box style={{ marginTop: "15px" }}>
                          <Typography
                            style={{ fontWeight: "bold", color: "#9e9e9e", fontSize: "12px" }}>
                            Description
                          </Typography>
                          <Controller
                            render={({ field }) => (
                              <StyledTextarea
                                rows={4}
                                aria-label="Description"
                                {...field}
                                style={{ width: "100%" }}
                              />
                            )}
                            name="description"
                            control={controlProduct}
                          />
                        </Box>
                        <Grid container>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              render={({ field }) => (
                                <StyledHookFormControl fullWidth style={{
                                  marginTop: "15px",
                                  width: "95%"
                                }}>
                                  <InputLabel id="categories"
                                    style={{ fontWeight: "bold" }}>
                                    Categories
                                  </InputLabel>
                                  <Select
                                    labelId="categories"
                                    value={changeCategories}
                                    label="Categories"
                                    onChange={(val) => {
                                      setValue("category_id", Number(val.target.value));
                                      setChangeCategories(Number(val.target.value));
                                    }}
                                    style={{ fontSize: "14px" }}
                                  >
                                    {categories.filter(item => item.name !== "All").map((category) => {
                                      return (
                                        <MenuItem
                                          key={category.id + "-" + category.name}
                                          value={category.id}>
                                          {category.name}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </StyledHookFormControl>
                              )}
                              name="category_id"
                              control={controlProduct}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                          }}>
                            <Controller
                              render={({ field }) => (
                                <StyledHookFormControl
                                  style={{ width: "95%", marginTop: "15px" }}
                                >
                                  <InputLabel
                                    htmlFor="discount"
                                    style={{ display: "flex", fontWeight: "bold" }}
                                  >
                                    Discount (%)
                                    {/* <Typography color="error">&nbsp;*</Typography> */}
                                  </InputLabel>
                                  <OutlinedInput
                                    id="discount"
                                    // {...field}
                                    onChange={(val) => setValue("discount", Number(val.target.value) / 100)}
                                    label="Discount (%)"
                                    error={!!errorsProduct.discount}
                                    type="number"
                                    defaultValue={product.discount*100}
                                    inputProps={{ step: 0.1 }}
                                  />
                                  {errorsProduct.discount && (
                                    <Typography
                                      color="error"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {errorsProduct.discount.message}
                                    </Typography>
                                  )}
                                </StyledHookFormControl>
                              )}
                              name="discount"
                              control={controlProduct}
                            />
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="medium"
                          style={{
                            backgroundColor: "rgb(11, 176, 226)",
                            width: "20%",
                          }}
                          type="submit"
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </form>
                  </Dialog>
                  <IconButton
                    aria-label="cart"
                    style={{
                      padding: 0,
                      margin: "1px",
                      backgroundColor: "#4caf50",
                      minWidth: "25px",
                      minHeight: "25px",
                    }}
                    onClick={(e) => handleAddProduct(e, product.name)}
                  >
                    <ShoppingCartOutlined sx={{ fontSize: "15px", color: "white" }} />
                  </IconButton>
                  <IconButton
                    aria-label="cart"
                    style={{
                      padding: 0,
                      margin: "1px",
                      backgroundColor: "red",
                      minWidth: "25px",
                      minHeight: "25px",
                    }}
                    onClick={(e) => handleAddProduct(e, product.name)}
                  >
                    <DeleteIcon sx={{ fontSize: "15px", color: "white" }} />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  aria-label="cart"
                  style={{
                    padding: 0,
                    margin: "1px",
                    backgroundColor: "#4caf50",
                    minWidth: "25px",
                    minHeight: "25px",
                  }}
                  onClick={(e) => handleAddProduct(e, product.name)}
                // onClick={() => {
                //   enqueueSnackbar(name, {
                //     variant: 'success',
                //     autoHideDuration: 4000,
                //     action: SnackBarAction
                //   })
                // }}
                >
                  <ShoppingCartOutlined sx={{ fontSize: "15px", color: "white" }} />
                </IconButton>
              )
            ) : (
              <Rating name="read-only" value={product.star} readOnly size="small" />
            )}
            {/* {hoverCard ? (
            <IconButton
              aria-label="cart"
              style={{
                padding: 0,
                backgroundColor: "#4caf50",
                minWidth: "25px",
                minHeight: "25px",
              }}
              onClick={(e) => modifyWebStore({ cartCount: cartCount+1 })}
              // onClick={() => {
              //   enqueueSnackbar(name, {
              //     variant: 'success',
              //     autoHideDuration: 4000,
              //     action: SnackBarAction
              //   })
              // }}
            >
              <ShoppingCartOutlined sx={{ fontSize: "15px", color: "white" }} />
            </IconButton>
          ) : (
            <Rating name="read-only" value={star} readOnly size="small" />
          )} */}
          </CardContent>
        </Box>
      </Card>
    );
  };
