import { ShippingLogo } from "../../assets/icons/ShippingLogo";
import { Grid, Box, Typography, Container } from "@mui/material";
import { DietLogo } from "../../assets/icons/DietLogo";
import { AwardLogo } from "../../assets/icons/AwardLogo";
import { CustomerServiceLogo } from "../../assets/icons/CustomerServiceLogo";

const Policy = () => {
    const items = [
        {
            name: "Free Shipping",
            description: "On order over $100",
            color: "#e4b2d6",
            icon: ShippingLogo,
        },
        {
            name: "Always Fresh",
            description: "Product well package",
            color: "#9ccc65",
            icon: DietLogo,
        },
        {
            name: "Superior Quality",
            description: "Quality Products",
            color: "#a2d1e1",
            icon: AwardLogo,
        },
        {
            name: "Support",
            description: "24/7 Support",
            color: "#dcd691",
            icon: CustomerServiceLogo,
        },
    ];

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
                                Customer Service Policies
                            </Typography>
                        </Grid>
                        <Grid item md={4}>
                            <hr style={{ borderWidth: 3, borderColor: "#4caf50" }}></hr>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 1 }} style={{ marginTop: 25 }}>
                    <Grid container style={{ textAlign: "center" }}>
                        {items.map((item, i) => {
                            return (
                                <Grid
                                    key={i}
                                    item
                                    md={3}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50px",
                                            backgroundColor: item.color,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50px",
                                                backgroundColor: item.color,
                                                borderWidth: "3px",
                                                borderStyle: "solid",
                                                borderColor: "#f5f5f5",
                                            }}
                                        >
                                            <item.icon
                                                fill="white"
                                                stroke="white"
                                                width="60px"
                                                height="60px"
                                            ></item.icon>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 15,
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            lineHeight: 1.5,
                                            color: "#000000",
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 10,
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            lineHeight: 1.5,
                                            color: "rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        {item.description}
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default Policy;