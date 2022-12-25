import Banner from "./Banner";
import BestSeller from "./BestSeller";
import Discount from "./Discount";
import Policy from "./Policy";
import Blog from "./Blog";
import { useEffect, useState } from "react";
import { ProductCategory } from "../../commons/Types";
import { SnackBarAction } from "../../commons/Alert";
import { useSnackbar } from "notistack";
import ProductsApi from "../../services/api/products";

function Home() {
  const [categories, setCategories] = useState<Array<ProductCategory>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let unmounted = false;
    setCategoriesLoading(true);

    ProductsApi.GetProductsCategories()
      .then((res) => {
        if (unmounted) return;
        let tmp: Array<ProductCategory> = res.data.data;
        let all = {
          id: 0,
          name: "All",
          total: 0,
        };
        if (tmp.length > 0) {
          for (let i = 0; i < tmp.length; i++) {
            all.total += tmp[i].total;
          }
        }
        tmp.unshift(all);
        setCategories(tmp);
        setCategoriesLoading(false)
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
      <div>
        <Banner />
      </div>
      <div style={{ marginTop: 25 }}>
        <Policy />
      </div>
      <div style={{ marginTop: 25 }}>
        <BestSeller categories={categories} categoriesLoading={categoriesLoading} />
      </div>
      <div style={{ marginTop: 25 }}>
        <Discount categories={categories} categoriesLoading={categoriesLoading}/>
      </div>
      <div style={{ marginTop: 25 }}>
        <Blog />
      </div>
    </>
  );
}

export default Home;
