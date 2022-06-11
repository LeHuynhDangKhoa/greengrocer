import React, { createContext, FC, useState } from "react";
import { Outlet } from "react-router-dom";
import RootLayoutHeader from "./Header";
import RootLayoutFooter from "./Footer";

/* https://www.templatemonster.com/woocommerce-themes/frutta-verde-woocommerce-theme-102891.html
              https://chakra-ui.com/docs/components/form/button
              https://mui.com/material-ui/react-switch/ 
              https://github.com/aslanluong/open-source-hooks#hooks*/

// db.Products.updateMany(
//     {discount: {$exists: true}},
//     [{$addFields: {discount: {$toDouble: "$discount"}}}]
//     )

type MenuType = {
  path: string;
  title: string;
  items?: { title: string; link: string }[];
}[];

export type RootLayoutType = {
  menu: MenuType;
  search: string;
  header: { search: string; isKeyEnter: boolean };
  setHeader: React.Dispatch<
    React.SetStateAction<{
      search: string;
      isKeyEnter: boolean;
    }>
  >;
  setSearch: React.Dispatch<React.SetStateAction<string>>; 
};
export const RootLayoutContext = createContext<RootLayoutType>(
  {} as RootLayoutType
);

const RootLayout: FC = ({ children }) => {
  const menu: MenuType = [
    {
      path: "/home",
      title: "home",
    },
    {
      path: "/products",
      title: "products",
    },
    {
      path: "/cart",
      title: "cart",
    },
    {
      path: "/checkout",
      title: "checkout",
    },
    {
      path: "/about",
      title: "about",
    },
    {
      path: "/blog",
      title: "blog",
    },
    {
      path: "/contact",
      title: "contact",
    },
  ];
  const [header, setHeader] = useState({ search: "", isKeyEnter: true });
  const [search, setSearch] = useState("");
  // const menuLayout: RootLayoutType = {
  //   menu: menu,
  //   header: header,
  //   setHeader: setHeader,
  //   setSearch: setSearch
  // }

  return (
    <RootLayoutContext.Provider
      value={{ menu, search, header, setHeader, setSearch }}
    >
      <div>
        <RootLayoutHeader
          menu={menu}
          search={search}
          header={header}
          setHeader={setHeader}
          setSearch={setSearch}
        />
        <div>{children}</div>
        <Outlet />
        <RootLayoutFooter />
      </div>
    </RootLayoutContext.Provider>
  );
};

export default RootLayout;
