import Blog1 from "../../assets/images/blog-1.jpg";
import Blog2 from "../../assets/images/blog-2.jpg";
import Blog3 from "../../assets/images/blog-3.jpg";
import Blog4 from "../../assets/images/blog-4.jpg";
import { Grid, Box, Typography, Container } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

const Blog = () => {
  const items = [
    {
      title: "Substitute Sweets with These Fruits",
      date: "June 04, 2022",
      image: Blog1,
      article: "Health",
    },
    {
      title: "Best Vegetable Combos for Smoothies",
      date: "June 04, 2022",
      image: Blog2,
      article: "Recipes",
    },
    {
      title: "Vegetable Smoothie Diet – Yes or No?",
      date: "June 04, 2022",
      image: Blog3,
      article: "Health",
    },
    {
      title: "5 Quick and Nutritious Breakfast Ideas",
      date: "June 04, 2022",
      image: Blog4,
      article: "Recipes",
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
                From The Blog
              </Typography>
            </Grid>
            <Grid item md={4}>
              <hr style={{ borderWidth: 3, borderColor: "#4caf50" }}></hr>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="xl">
        <Box sx={{ flexGrow: 1 }} style={{ marginTop: 25 }}>
          <Grid container style={{ textAlign: "center" }}>
            {items.map(({ title, date, image, article }, i) => {
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
                    className="blog-home"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      width: "90%",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "90%",
                      marginTop: 5,
                      color: "#757575",
                    }}
                  >
                    <Typography component="div" style={{ display: "flex", float: "left" }}>
                      <CalendarMonth />
                      <Typography>{date}</Typography>
                    </Typography>
                    <Typography style={{ float: "right" }}>
                      {article}
                    </Typography>
                  </div>
                  <div
                    style={{
                      fontFamily: `"Cormorant Garamond",serif`,
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    {title}
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

export default Blog;
