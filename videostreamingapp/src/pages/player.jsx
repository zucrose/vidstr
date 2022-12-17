import React, { useState } from "react";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { async } from "@firebase/util";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect } from "react";
import Card from "../components/card";

export default function Player() {
  const [cast, setCast] = useState(undefined);

  const { state } = useLocation();
  const { trailer, movieData } = state;
  const [isScrolled, setIsScrolled] = useState(false);
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  const name = movieData.name ? movieData.name : movieData.title;
  const release = movieData.released
    ? movieData.released
    : movieData.release_date
    ? movieData.release_date
    : movieData.first_air_date;
  const synopsis=movieData.synopsis?movieData.synopsis:movieData.overview;
  const getCast = async () => {
    try {
      if (movieData.type === "movie") {
        const castObject = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieData.id}/credits?api_key=${API_KEY}`
        );
        console.log(castObject.data);
        setCast(castObject.data.cast);
      } else {
        const castObject = await axios.get(
          `${TMDB_BASE_URL}/tv/${movieData.id}/credits?api_key=${API_KEY}`
        );
        console.log(castObject.data);
        setCast(castObject.data.cast);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCast();
  }, [trailer]);

  const navigate = useNavigate();
  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="wrapper">
        <div className="flex column a-center">
          <div className="row w-75">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              height="400"
            ></iframe>
          </div>
          <div className="row mt-2 w-75">
            <div className="col-6 " style={{ width: "50%" }}>
              <div className="synopsis">
                <h1 className="text-center">{name}</h1>
                <h6 className="text-end"> {release}</h6>
                <p>{synopsis}</p>
              </div>
            </div>

            <div className="col-6">
              <h2 className="mb-2">Cast</h2>
              <div className="overflow-scroll h-50">
                {cast &&
                  cast.map((person, id) => {
                    //   console.log(person);

                    if (id < 10) {
                      return (
                        <div className="d-flex justify-content-start p-2">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                            width="100px"
                            height="100px"
                            className="pe-4"
                          />
                          <div>
                            <h6>{person.character}</h6>
                            <h6>{person.original_name}</h6>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  .wrapper {
    margin-top: 5rem;
  }
  .synopsis {
    padding: 10px 100px 10px 100px;
  }
`;
