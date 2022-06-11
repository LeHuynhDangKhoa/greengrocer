import { Button } from "@mui/material";
import Banner1 from "../../assets/images/home-1.jpg";
import Banner2 from "../../assets/images/home-2.jpg";
import Banner3 from "../../assets/images/home-3.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
  const items = [
    {
      name: "We serve Fresh Vegestables & Fruits",
      image: Banner1,
    },
    {
      name: "100% Fresh & Organic Foods",
      image: Banner2,
    },
    {
      name: "24/7 support & Free shipping",
      image: Banner3,
    },
  ];

  return (
    <Carousel infiniteLoop autoPlay showStatus={false} showThumbs={false}>
      {items.map((item, i) => {
        return (
          <div
            key={i + "-" + item.name}
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              zIndex: 0,
              height: "400px",
              backgroundImage: `url(${item.image})`,
              lineHeight: "400px",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  verticalAlign: "middle",
                  display: "inline-block",
                  textTransform: "uppercase",
                  fontFamily: "Amatic SC, cursive",
                  color: "white",
                  lineHeight: 1.3,
                  fontWeight: "bold",
                  fontSize: "40px",
                }}
              >
                <div style={{ backgroundColor: "rgb(11, 176, 226, 0.6)", padding: "0 15px", borderRadius: "30px 0" }}>{item.name}</div>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#4caf50",
                      borderRadius: "25px",
                      height: "50px",
                      width: "130px",
                      marginTop: "15px",
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </Carousel >
  );
};

export default Banner;
