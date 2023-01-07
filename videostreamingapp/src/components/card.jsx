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
      console.log(movieData);
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

        if (VideoData.data.results.find((vid) => vid.type === "Trailer"))
          setTrailer(
            VideoData.data.results.find((vid) => vid.type === "Trailer")
          );
        else setTrailer(VideoData.data.results[0]);

        //console.log(trail);
      }
    } catch (err) {
      console.log("err1", err);
    }
  };
  const addToList = async (event) => {
    event.stopPropagation();
    try {
      await axios.post("http://localhost:5000/api/user/add", {
        email,
        data: movieData,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const mystyle = {
    backgroundImage:
      "url(https://image.tmdb.org/t/p/w500" + movieData.image + ")",
    objectFit: "cover",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",

    width: "100%",
    height: "100%",
  };
  // console.log(movieData);
  return (
    <Container
      onMouseEnter={() => {
        setIsHovered(true);
        if (trailer === null) getVideos();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="extra-2 flex column"
    >
      {/*<div
        style={mystyle}
        onClick={() =>
          navigate("/player", {
            state: { trailer: trailer, movieData: movieData },
          })
        }
      }
        <h3 className="name">{movieData.name}</h3>
      </div>
    */}
      <div
        className="card card-color "
        onClick={() =>
          navigate("/player", {
            state: { trailer: trailer, movieData: movieData },
          })
        }
      >
        {!isHovered && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
            alt="movie"
            className="card-img-top"
            onClick={() =>
              navigate("/player", {
                state: { trailer: trailer, movieData: movieData },
              })
            }
          />
        )}
        {isHovered && trailer && (
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
        <div className="card-body ">
          <h5
            className="card-title"
            onClick={() =>
              navigate("/player", {
                state: { trailer: trailer, movieData: movieData },
              })
            }
          >
            {movieData.name}
          </h5>
          <div className="icons flex j-between">
            <div className="controls flex">
              <IoPlayCircleSharp
                title="play"
                size={30}
                onClick={() =>
                  navigate("/player", {
                    state: { trailer: trailer, movieData: movieData },
                  })
                }
              />

              {isLiked ? (
                <BsCheck
                  title="Remove From List"
                  size={30}
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(
                      removeFromLikedMovies({ movieId: movieData.id, email })
                    );
                  }}
                />
              ) : (
                <AiOutlinePlus
                  title="Add to List"
                  onClick={addToList}
                  size={30}
                />
              )}
            </div>
          </div>
          <div
            className="genres flex "
            onClick={() =>
              navigate("/player", {
                state: { trailer: trailer, movieData: movieData },
              })
            }
          >
            <ul className="flex">
              {movieData.genres.map((genre) => (
                <li>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*isHovered && (
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
                )*/}
    </Container>
  );
});
const Container = styled.div`
  max-width: 300px;
  width: 230px;

  cursor: pointer;
  position: relative;
  .card-color {
    background-color: #0c090a;
    max-height: 340px;
    min-height: 340px;
  }
  .genres {
    ul {
      gap: 1rem;
      padding-right: 0.7rem;
      flex-wrap: wrap;
      li {
        padding-right: 0.7rem;
        list-style-type: disc;
      }
    }
  }
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
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
  }

  .hover {
    z-index: 990;
    height: 320px;
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
  }
`;
