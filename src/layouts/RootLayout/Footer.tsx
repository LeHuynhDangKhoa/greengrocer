import "./RootLayout.css";
import { Grid, Box, Typography, List, ListItem, ListItemButton, ListItemText, IconButton, Container } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import RoomIcon from '@mui/icons-material/Room';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const RootLayoutFooter = () => {
    const helpItems = ["FAQs", "Contact", "Terms & Conditions", "Privacy Policy"];
    var questionItems = [
        {
            content: "Address",
            icon: RoomIcon,
        },
        {
            content: "0123456789",
            icon: PhoneIcon,
        },
        {
            content: "20521025@gm.uit.edu.vn",
            icon: EmailIcon,
        }
    ];
    return (
        <div style={{ backgroundColor: "#f7f6f2", marginTop: 25 }}>
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container style={{ textAlign: "center" }}>
                        <Grid item md={4} style={{ fontSize: "18px" }}>
                            <Typography style={{ fontWeight: "bold", marginTop: 10 }}>Payment Methods</Typography>
                            <img src={require("../../assets/images/payment.png")} alt="payment method" style={{ padding: 10 }} />
                            <Typography style={{ fontWeight: "bold" }}>Social Network</Typography>
                            <IconButton
                                sx={{
                                    margin: 2,
                                    "&:hover": {
                                        backgroundColor: "#e1f5fe",
                                        textDecoration: "none",
                                    },
                                    backgroundColor: "white"
                                }}>
                                <TwitterIcon style={{ color: "#1d9bf0" }} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    margin: 2,
                                    "&:hover": {
                                        backgroundColor: "#e1f5fe",
                                        textDecoration: "none",
                                    },
                                    backgroundColor: "white"
                                }}>
                                <FacebookIcon style={{ color: "#3b5998" }} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    margin: 2,
                                    "&:hover": {
                                        backgroundColor: "#e1f5fe",
                                        textDecoration: "none",
                                    },
                                    backgroundColor: "white"
                                }}>
                                <InstagramIcon style={{ color: "#ab3292" }} />
                            </IconButton>
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{ fontWeight: "bold", marginTop: 10, fontSize: "18px" }}>Help</Typography>
                            {helpItems.map((item, i) => {
                                return (
                                    <div key={i + "-" + item} style={{ fontSize: "14px", margin: 20 }}>{item}</div>
                                );
                            })}
                        </Grid>
                        <Grid item md={4}>
                            <Typography style={{ fontWeight: "bold", marginTop: 10, fontSize: "18px" }}>Have a Questions?</Typography>
                            {questionItems.map((item, i) => {
                                return (
                                    <div key={i + "-" + item.content}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "14px", 
                                            margin: 20
                                        }}
                                    >
                                        <item.icon></item.icon>
                                        <div>&nbsp;&nbsp;&nbsp;{item.content}</div>
                                    </div>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default RootLayoutFooter;
