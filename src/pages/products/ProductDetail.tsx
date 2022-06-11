import {
  Box,
  Breadcrumbs,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Rating,
  Button,
  IconButton,
  InputBase,
  TextField,
  styled,
} from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { LocationState, Product } from "../../commons/Types";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../services";
import { useSnackbar } from "notistack";
import ProductsApi from "../../services/api/products";
import { SnackBarAction } from "../../commons/Alert";
import "./Products.css";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel";
import { ProductCard } from "../../components/products/ProductCard";
import { addProductToCart } from "../../commons/Cart";
import { useWebStore } from "../../providers/WebStoreProvider";

const StyledTextField = styled(TextField)({
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

function ProductDetail() {
  const [productLoading, setProductLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();
  const { id, category } = useParams();
  const [relatedProducts, setRelatedProducts] = useState<Array<Product>>([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);
  const {
    webStore: { cartCount },
    modifyWebStore,
  } = useWebStore();

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddQuantity = (e: React.MouseEvent<HTMLElement>) => {
    let tmp = quantity + 1;
    setQuantity(tmp);
  };

  const handleSubstractQuantity = (e: React.MouseEvent<HTMLElement>) => {
    let tmp = quantity - 1;
    setQuantity(tmp > 1 ? tmp : 1);
  };

  const handleAddToCart = () => {
    enqueueSnackbar(quantity + " " + product?.name + "(s) is added to your card", {
      variant: "success",
      autoHideDuration: 4000,
      action: SnackBarAction,
    });
    addProductToCart(product as Product, category, quantity);
    modifyWebStore({ cartCount: cartCount + quantity });
  };

  useEffect(() => {
    let unmounted = false;
    setRelatedProductsLoading(true);

    ProductsApi.ProductsIndex("", category)
      .then((res) => {
        if (unmounted) return;
        setRelatedProducts(
          res.data.data.data.filter(
            (item: Product) => item.uid.toString() !== id
          )
        );
        setRelatedProductsLoading(false);
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
  }, []);

  useEffect(() => {
    let unmounted = false;
    setProductLoading(true);
    ProductsApi.ProductDetail(id || "")
      .then((res) => {
        if (unmounted) return;
        setProduct(res.data);
        setProductLoading(false);
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
  }, [id]);

  const breadcrumbs = [
    <Link
      key="1"
      color="inherit"
      to="/home"
      style={{ color: "#616161", fontWeight: "bold" }}
    >
      Greengrocer
    </Link>,
    <Link
      key="2"
      color="inherit"
      to="/products"
      style={{ color: "#616161", fontWeight: "bold" }}
    >
      Products
    </Link>,
    <Link
      key="3"
      color="inherit"
      to={"/products/" + category}
      style={{ color: "#616161", fontWeight: "bold" }}
    >
      {category?.split("_").join(" ")}
    </Link>,
    <Typography key="4" color="text.primary">
      {product?.name}
    </Typography>,
  ];

  return (
    <Container maxWidth="xl">
      {!productLoading ? (
        <Box sx={{ flexGrow: 1 }} style={{ marginTop: 25 }}>
          <Grid container style={{ display: "flex", alignItems: "center" }}>
            <Grid item xs={12} sm={6} container justifyContent="flex-start">
              <Stack spacing={2} marginBottom={2}>
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                  aria-label="breadcrumb"
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </Stack>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              md={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                style={{
                  overflow: "hidden",
                  position: "relative",
                  float: "left",
                  display: "inline-block",
                  cursor: "pointer",
                  width: "70%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Zoom>
                  <Box
                    sx={{ position: "relative" }}
                    component="div"
                    style={{
                      width: "500px",
                      height: "auto",
                      overflow: "hidden",
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="auto"
                      width="100%"
                      image={BaseUrl + "/" + product?.image}
                      alt={product?.name}
                      sx={{
                        overflow: "hidden",
                        borderRadius: "10px",
                        // "&:hover": {
                        //     transform: "scale3d(1.9, 1.9, 1.9)",
                        //     transitionDuration: "400ms",
                        // },
                      }}
                    />
                    {product?.discount && product?.discount > 0 ? (
                      <Box
                        sx={(theme) => ({
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "auto",
                          bgcolor: "#ff7062",
                          color: "white",
                          padding: "0 5px 0 5px",
                          borderRadius: "10px 0 10px 0",
                        })}
                        style={{
                          fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
                          fontSize: "20px",
                        }}
                      >
                        {product?.discount * 100 + "% OFF"}
                      </Box>
                    ) : (
                      ""
                    )}
                  </Box>
                </Zoom>
              </Box>
            </Grid>
            <Grid
              item
              md={6}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: "30px",
                  fontFamily: `"Cormorant Garamond",serif`,
                }}
              >
                {product?.name}
              </Typography>
              <Rating
                name="read-only"
                value={product?.star}
                readOnly
                size="medium"
                style={{ marginTop: "10px" }}
              />
              <Typography
                fontWeight="bold"
                fontSize="20px"
                style={{ marginTop: "10px" }}
              >
                {product?.discount && product?.discount > 0 ? (
                  <span
                    style={{
                      color: "#ff7062",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {"$" +
                      (product?.price * (1 - product?.discount)).toFixed(2)}
                    <span
                      style={{
                        marginLeft: "15px",
                        color: "#b3b3b3",
                        fontSize: "14px",
                        textDecoration: "line-through",
                      }}
                    >
                      {"$" + product?.price.toFixed(2)}
                    </span>
                  </span>
                ) : (
                  "$" + product?.price.toFixed(2)
                )}
              </Typography>
              <Typography
                fontSize="16px"
                style={{ marginTop: "10px", textAlign: "justify" }}
              >
                {product?.description}
              </Typography>
              <Box style={{ display: "flex", marginTop: "15px" }}>
                <Button
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "20px", marginRight: "5px" }}
                  onClick={handleSubstractQuantity}
                >
                  <RemoveIcon />
                </Button>
                <StyledTextField
                  InputProps={{ inputProps: { min: 1 } }}
                  label="Quantity"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                  style={{ marginRight: "5px", maxWidth: "150px" }}
                  variant="outlined"
                  value={quantity}
                  onChange={handleChangeQuantity}
                />
                <Button
                  variant="outlined"
                  size="small"
                  style={{ minWidth: "20px" }}
                  onClick={handleAddQuantity}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Box style={{ display: "flex", marginTop: "15px" }}>
                <Button
                  variant="contained"
                  size="medium"
                  style={{
                    minWidth: "30px",
                    marginRight: "15px",
                    backgroundColor: "#4caf50",
                  }}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Button>
                <Link to={"/cart"} style={{textDecoration: "none"}}>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{
                      minWidth: "30px",
                      backgroundColor: "rgb(11, 176, 226)",
                    }}
                  >
                    View Cart
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: "25px" }}>
            <Container maxWidth="lg">
              <Box sx={{ flexGrow: 1 }}>
                <Grid container style={{ textAlign: "center" }}>
                  <Grid
                    item
                    md={4}
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      justifyContent: "middle",
                    }}
                  >
                    <hr style={{ borderWidth: 3, borderColor: "#4caf50" }}></hr>
                  </Grid>
                  <Grid item md={4} style={{ margin: "auto" }}>
                    <Typography
                      style={{
                        fontSize: "18px",
                        textTransform: "uppercase",
                        color: "rgb(11, 176, 226)",
                        fontWeight: "bold",
                      }}
                    >
                      Related Products
                    </Typography>
                  </Grid>
                  <Grid item md={4}>
                    <hr style={{ borderWidth: 3, borderColor: "#4caf50" }}></hr>
                  </Grid>
                </Grid>
              </Box>
            </Container>
            <Container
              maxWidth="xl"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!relatedProductsLoading ? (
                <CarouselProvider
                  naturalSlideWidth={200}
                  naturalSlideHeight={250}
                  totalSlides={relatedProducts.length}
                  visibleSlides={5}
                  isPlaying
                  infinite
                  interval={2000}
                >
                  <Slider>
                    {relatedProducts.map(
                      (
                        product,
                        i
                      ) => {
                        return (
                          <Slide index={i} key={product.uid + "-" + product.name}>
                            <Grid
                              item
                              key={product.uid + "-" + product.name}
                              style={{
                                marginTop: 25,
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <ProductCard
                                product={product}
                                category={category}
                              />
                            </Grid>
                          </Slide>
                        );
                      }
                    )}
                  </Slider>
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: `"Roboto","Helvetica","Arial",sans-serif`,
                      fontSize: "12px",
                    }}
                  >
                    <ButtonBack
                      className="carousel-button"
                      style={{
                        borderRadius: 10,
                        borderStyle: "none",
                        minWidth: "50px",
                        margin: "5px",
                        color: "gray",
                      }}
                    >
                      Back
                    </ButtonBack>
                    <ButtonNext
                      className="carousel-button"
                      style={{
                        borderRadius: 10,
                        borderStyle: "none",
                        minWidth: "50px",
                        color: "gray",
                      }}
                    >
                      Next
                    </ButtonNext>
                  </div>
                </CarouselProvider>
              ) : (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              )}
            </Container>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default ProductDetail;
