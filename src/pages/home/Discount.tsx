import { Grid, Box, Typography, Container, CircularProgress, Snackbar, AlertProps, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { Product, ProductCategory } from "../../commons/Types";
import { ProductCard } from "../../components/products/ProductCard";
import ProductsApi from "../../services/api/products";
import { useSnackbar } from "notistack";
import { SnackBarAction } from "../../commons/Alert";

const Discount = ({categories, categoriesLoading}: {categories: Array<ProductCategory>} & {categoriesLoading: boolean}) => {
  const [bestSellerProducts, setbestSellerProducts] = useState<Array<Product>>(
    []
  );
  const [productsLoading, setProductsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let unmounted = false;
    setProductsLoading(true);

    ProductsApi.ProductsIndex("", "", "", "true")
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
                Discounted Products
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
        {!productsLoading && !categoriesLoading ? <Box sx={{ flexGrow: 1 }}>
          <Grid container >
            {bestSellerProducts.map(
              (product, i) => {
                return (
                  <Grid item key={product.uid + "-" + product.name} md={2.4} style={{
                    marginTop: 25, textAlign: "center", display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                    <ProductCard
                      product={product}
                      category={categories.filter(category => category.kind === product.kind)[0].name}
                    />
                  </Grid>
                );
              }
            )}
          </Grid>
        </Box> : <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>}
      </Container>
    </>
  );
};

export default Discount;
