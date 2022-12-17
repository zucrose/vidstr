import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useDispatch } from "react-redux";
import { removeFromLikedMovies } from "../store";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

export default React.memo(function Card({ movieData, isLiked = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [trailer, setTrailer] = useState(null);
  const navigate = useNavigate();

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setEmail(currentUser.email);
    else navigate("/login");
  });
  const dispatch = useDispatch();
  const getVideos = async () => {
    try {
      console.log(movieData)
      if (movieData.type === "movie") {
        const VideoData = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieData.id}/videos?api_key=${API_KEY}`
        );

        console.log(VideoData.data.results);
        setTrailer(
          VideoData.data.results.find((vid) => vid.type === "Trailer")
        );
      } else {
        const VideoData = await axios.get(
          `${TMDB_BASE_URL}/tv/${movieData.id}/videos?api_key=${API_KEY}`
        );

         console.log(VideoData.data.results);
       
          if(VideoData.data.results.find((vid) => vid.type === "Trailer"))
          setTrailer(
            VideoData.data.results.find((vid) => vid.type === "Trailer")
          );
          else
          setTrailer(  VideoData.data.results[0]);
        
        //console.log(trail);
      }
    } catch (err) {
      console.log("err1", err);
    }
  };
  const addToList = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/add", {
        email,
        data: movieData,
      });
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(movieData);
  return (
    <Container
      onMouseEnter={() => {
        setIsHovered(true);
        if (trailer === null) getVideos();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="movie"
      />
      {true && (
        <div className="hover">
          <div className="image-video-container">
            {!trailer && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
                alt="movie"
                onClick={() =>
                  navigate("/player", {
                    state: { trailer: trailer, movieData: movieData },
                  })
                }
              />
            )}
            {trailer && (
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
               // allow='autoplay'
                onClick={() =>
                  navigate("/player", {
                    state: { trailer: trailer, movieData: movieData },
                  })
                }
              ></iframe>
            )}
          </div>
          <div className="info-container flex column">
            <h3
              className="name"
              onClick={() =>
                navigate("/player", {
                  state: { trailer: trailer, movieData: movieData },
                })
              }
            >
              {movieData.name}
            </h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="play"
                  onClick={() =>
                    navigate("/player", {
                      state: { trailer: trailer, movieData: movieData },
                    })
                  }
                />

                {isLiked ? (
                  <BsCheck
                    title="Remove From List"
                    onClick={() =>
                      dispatch(
                        removeFromLikedMovies({ movieId: movieData.id, email })
                      )
                    }
                  />
                ) : (
                  <AiOutlinePlus title="Add to List" onClick={addToList} />
                )}
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre) => (
                  <li>{genre}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
});
const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    z-index: 99;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -18vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      video {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 5;
        position: absolute;
      }
    }
    .info-container {
      padding: 1rem;
      gap: 0.5rem;
    }
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      ul {
        gap: 1rem;
        li {
          padding-right: 0.7rem;
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }
`;
