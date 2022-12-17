import React, { useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./card";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Nslider({ data, title }) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Container className="flex column">
      <h1>{title}</h1>
      <Carousel
        responsive={responsive}
        infinite={true}
       
      >
        {data.map((movie, index) => {
          return <Card movieData={movie} index={index} key={movie.id} />;
        })}
      </Carousel>
    </Container>
  );
}
const Container = styled.div``;
