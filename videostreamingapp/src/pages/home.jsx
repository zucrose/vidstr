import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, getGenres } from "../store";
import Slider from "../components/slider";
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.vidstr.genresLoaded);
  const movies=useSelector((state)=>state.vidstr.movies);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "all" }));
  },[genresLoaded]);
  
  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="data"></div>
      <Slider movies={movies}/>
    
      
    </Container>
  );
}
const Container = styled.div`
  background-color: black;
  .data{
     margin-top: 4rem;
  }

  
`;