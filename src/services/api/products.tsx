import { API } from "..";
import { Category, Product } from "../../commons/Types";

const ProductsApi = {
  ProductsIndex(
    search?: string,
    categoryId?: string,
    star?: string,
    discount?: string,
    priceFrom?: string,
    priceTo?: string,
    sort?: string,
    order?: string,
    offset?: number,
    limit?: number
  ) {
    let query = "";
    if (search) {
      query = query + `search=${search}&`;
    }
    if (categoryId) {
      query = query + `category=${categoryId}&`;
    }
    if (star) {
      query = query + `star=${star}&`;
    }
    if (discount) {
      query = query + `discount=${discount}&`;
    }
    if (priceFrom) {
      query = query + `price_from=${priceFrom}&`;
    }
    if (priceTo) {
      query = query + `price_to=${priceTo}&`;
    }
    if (order) {
      if (order === "desc") {
        query = query + `order=desc&`;
      } else {
        query = query + `order=asc&`;
      }
      if (sort) {
        query = query + `sort=${sort}&`;
      }
    }
    if (offset) {
      query = query + `offset=${offset}&`;
    }
    if (limit) {
      query = query + `limit=${limit}&`;
    }
    return API().get(`/products?${query}`);
  },

  GetProductsCategories() {
    return API().get(`/categories`);
  },

  ProductDetail(id: string) {
    return API().get(`/products/` + id);
  },

  CategoryDetail(id: string) {
    return API().get(`/categories/` + id);
  },

  CouponDetail(code: string) {
    return API().get(`/coupon/` + code);
  },

  AddCategory(form: Category) {
    return API().post(`/categories`, form);
  },

  AddProduct(form: Product) {
    return API().postForm(`/products`, form);
  }
};

export default ProductsApi;
