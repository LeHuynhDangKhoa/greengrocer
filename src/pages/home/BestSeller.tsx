import { Grid, Box, Typography, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Product, ProductCategory } from "../../commons/Types";
import { ProductCard } from "../../components/products/ProductCard";
import ProductsApi from "../../services/api/products";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import "./Home.css";
import { useSnackbar } from "notistack";
import { SnackBarAction } from "../../commons/Alert";

const BestSeller = ({categories, categoriesLoading}: {categories: Array<ProductCategory>} & {categoriesLoading: boolean}) => {
  const [bestSellerProducts, setbestSellerProducts] = useState<Array<Product>>(
    []
  );
  const [productsLoading, setProductsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let unmounted = false;
    setProductsLoading(true);
    
    ProductsApi.ProductsIndex(
      "",
      "",
      "5",
    )
      .then((res) => {
        if (unmounted) return;
        setbestSellerProducts(res.data.data.data);
        setProductsLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, {
          variant: 'error',
          autoHideDuration: 4000,
          action: SnackBarAction
        })
      });

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
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
                Best Seller Products
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
        {!productsLoading && !categoriesLoading ? <CarouselProvider
          naturalSlideWidth={200}
          naturalSlideHeight={250}
          totalSlides={bestSellerProducts.length}
          visibleSlides={5}
          isPlaying
          infinite
          interval={2000}
        >
          <Slider>
            {bestSellerProducts.map(
              (product, i) => {
                return (
                  <Slide index={i} key={product.id + "-" + product.name}>
                    <Grid
                      item
                      key={product.id + "-" + product.name}
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
                        category={categories.filter(category => category.id === product.category_id)[0].name}
                      />
                    </Grid>
                  </Slide>
                );
              }
            )}
          </Slider>
          <div style={{ textAlign: "center", fontFamily: `"Roboto","Helvetica","Arial",sans-serif`, fontSize: "12px" }}>
            <ButtonBack className="carousel-button" style={{ borderRadius: 10, borderStyle: "none", minWidth: "50px", margin: "5px", color: "gray" }}>Back</ButtonBack>
            <ButtonNext className="carousel-button" style={{ borderRadius: 10, borderStyle: "none", minWidth: "50px", color: "gray" }}>Next</ButtonNext>
          </div>
        </CarouselProvider> : <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>}
      </Container>
    </>
  );
};

export default BestSeller;
