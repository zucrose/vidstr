import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";

import styled from "styled-components";


import { onAuthStateChanged } from "firebase/auth";
import {  getUserLikedMovies } from "../store";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/navbar";
import Card from "../components/card";

export default function Bookmarks() {
  const [isScrolled, setIsScrolled] = useState(false);
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const navigate = useNavigate();
 
  const movies = useSelector((state) => state.vidstr.movies);
  
  const [email, setEmail] = useState(undefined);
  onAuthStateChanged(firebaseAuth, (currentUser) => {
    console.log("fbcalled")
    if (currentUser) setEmail(currentUser.email);
    else navigate("/login");
  });
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(movies);
    if (email) {
        
      dispatch(getUserLikedMovies(email));
      console.log("check2",movies);
    }
  }, [email]);

  
  return (
    <Container>
      <Navbar isScrolled={isScrolled}/>
        <div className="content flex column">
          <h1>Bookmarks</h1>
          <div className="grid flex">
          {movies.map((movie, index) => {
            console.log(movie);
            return (
              <Card
                movieData={movie} 
                
                isLiked={true}
              />
            );
          })}
        </div>
        </div>
      
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
