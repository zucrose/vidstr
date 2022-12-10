import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/navbar";
import NotAvailable from "../components/notavailable";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/slider";
import { fetchMovies, getGenres } from "../store";
import { firebaseAuth } from "../utils/firebase-config";

export default function Movies() {
  const [isScrolled, setIsScrolled] = useState(false);
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.vidstr.genresLoaded);
  const movies = useSelector((state) => state.vidstr.movies);
  const genres = useSelector((state) => state.vidstr.genres);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "movies" }));
  },[genresLoaded]);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    //if (currentUser) navigate("/");
  });
  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled}/>
      </div>
      
      <div className="data">
      <SelectGenre genres={genres} type="movie"></SelectGenre>
        {
            movies.length? <Slider movies={movies}/>:<NotAvailable/>

        }
      </div>
    </Container>
  );
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`;
