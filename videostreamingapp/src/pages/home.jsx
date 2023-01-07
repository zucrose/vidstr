import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, getGenres, getRecommended } from "../store";
import Slider from "../components/slider";
import { firebaseAuth } from "../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState(undefined);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.vidstr.genresLoaded);
  const movies = useSelector((state) => state.vidstr.movies);
  const recomended = useSelector((state) => {
    console.log(state.vidstr);
    return state.vidstr.recommended;
  });

  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      //console.log("fbcalled");
      if (currentUser) {
        setEmail(currentUser.email);
      } else navigate("/login");
    });
  }, [email]);
  useEffect(() => {
    console.log(email);
    if (email != undefined) dispatch(getRecommended({ email: email }));
  }, [email]);
  useEffect(() => {
    dispatch(getGenres("movie"));
  }, []);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "all" }));
  }, [genresLoaded]);
  console.log(recomended);
  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="data"></div>
      <Slider movies={movies} recomended={recomended} />
    </Container>
  );
}
const Container = styled.div`
  background-color: black;
  .data {
    margin-top: 4rem;
  }
`;
