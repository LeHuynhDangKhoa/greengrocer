import { ShoppingCartOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SnackBarAction } from "../../commons/Alert";
import { addProductToCart } from "../../commons/Cart";
import { CartData, CartSession, Product } from "../../commons/Types";
import { useWebStore } from "../../providers/WebStoreProvider";
import { BaseUrl } from "../../services/index";
import NoImageAvalable from "../../assets/images/no-image-available.png";

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

export const ProductCard: FC<{
  product: Product,
    category?: string
}> = ({
  product,
  category,
}) => {
  const [hoverCard, setHoverCard] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    webStore: { cartCount },
    modifyWebStore,
  } = useWebStore();

  const handleAddProduct = (
    e: React.MouseEvent<HTMLElement>,
    productName?: string
  ) => {
    enqueueSnackbar(productName + " is added to your card", {
      variant: "success",
      autoHideDuration: 4000,
      action: SnackBarAction,
    });

    modifyWebStore({ cartCount: cartCount+1 })
    addProductToCart(product, category);
  };

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
            <IconButton
              aria-label="cart"
              style={{
                padding: 0,
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
