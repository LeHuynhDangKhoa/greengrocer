import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Menu, styled, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { CartData } from "../../commons/Types";

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

const MenuRemoveProduct = ({product, handleRemoveProduct} : {product: CartData} & {handleRemoveProduct: (product: CartData) => void}) => {
    const [anchorElRemove, setAnchorElRemove] = useState<null | HTMLElement>(
        null
    );

    const handleOpenRemove = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElRemove(event.currentTarget);
    };

    const handleCloseRemove = () => {
        setAnchorElRemove(null);
    };

    return (
        <React.Fragment>
            <Tooltip title="Remove">
                <IconButton onClick={handleOpenRemove} >
                    <Close sx={{ fontSize: "20px" }} />
                </IconButton>
            </Tooltip>
            <StyledMenu
                key={product.id}
                id={product.id.toString()}
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
                onClose={handleCloseRemove}
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
                                handleRemoveProduct(product)
                            }}
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </StyledMenu>
        </React.Fragment>
    );
};

export default MenuRemoveProduct;