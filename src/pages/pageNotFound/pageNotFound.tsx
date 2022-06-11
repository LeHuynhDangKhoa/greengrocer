import { Container } from "@mui/material";
import PageNotFoundImg from "../../assets/images/error-404.png";

function PageNotFound() {
    return (
        <Container maxWidth="lg">
            <img src={PageNotFoundImg} width="50%" style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: 25, marginLeft: "auto", marginRight: "auto" }} alt="Page Not Found" />
        </Container>
    );
}

export default PageNotFound;