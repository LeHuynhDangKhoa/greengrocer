import { FC } from "react";
import { Route, RouteProps, RoutesProps } from "react-router-dom";
import Products from "./Products";

const ProductsIndex: FC = ({ children }) => {
    return (
      <Route>
        <Route index element={Products} />
        {/* <Route path={`${children.path}/:id`} element={} />
        <Route path={`${children.path}/:`} element={} /> */}
      </Route>
    );
  };
  
  export default ProductsIndex;