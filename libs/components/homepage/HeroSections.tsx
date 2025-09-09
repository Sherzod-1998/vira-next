"use client";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const HeroSections = () => {
  return (
    <section className="hero">
      <Container maxWidth={false} className="hero__container">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Title */}
          <Grid item xs={12} md={7}>
            <h1 className="hero__title">
              RISHI COUPLE <span className="hero__gradA">RINGS</span> &{" "}
              <span className="hero__gradB">DIAMONDS</span> ARE THE
              <br /> NEW COLLECTIONS
            </h1>
          </Grid>

          {/* Right copy */}
          <Grid item xs={12} md={5}>
            <Typography className="hero__copy">
              Nunc in arcu et nunc scelerisque dignissim. Aliquam enim nunc,
              volutpat eget ipsum id, varius sodales mi. Vestibulum ante ipsum
              primis in faucibus orci luctus et ultrices posuere cubilia curae.
            </Typography>
            <Button variant="outlined" className="hero__cta">
              MORE DETAILS
            </Button>
          </Grid>
        </Grid>

        {/* Bottom cards */}
        <Grid container spacing={4} className="hero__cards">
          <Grid item xs={12} md={4}>
            <Box className="card card--light">
              <div className="card__reviews-row">
                <span className="card__star">⭐</span>
                <strong>26K REVIEWS</strong>
                <span className="card__plus">+15</span>
              </div>
              <h3 className="card__title">
                Exquisite Jewelry For The Extraordinary You
              </h3>
              <p className="card__text">
                Nunc in arcu et nunc scelerisque dignissim. Aliquam enim nunc,
                volutpat eget ipsum id, varius sodales. Vestibulum ante.
              </p>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className="card card--dark">
              <p className="card__kicker">SPECIAL EDITIONS</p>
              <h3 className="card__dark-title">
                NECKLACES &<br /> CHOKER
              </h3>
              <p className="card__dark-text">
                Embrace the unseen magic of uniqueness. Where elegance finds extraordinary.
              </p>
              <Button variant="contained" className="card__dark-btn">
                MORE DETAILS
              </Button>
              <div className="card__progress-wrap">
                <div className="card__progress-bg">
                  <div className="card__progress-bar" />
                </div>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box className="card card--pale">
              <div>
                <p className="card__kicker-pale">COLLECTIONS</p>
                <h3 className="card__pale-title">GOLD BANGLE</h3>
                <p className="card__pale-text">
                  Minimal curves, maximal elegance. Soft radiuses to echo the frame.
                </p>
              </div>
              <div className="card__image-placeholder">add image</div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default HeroSections;
