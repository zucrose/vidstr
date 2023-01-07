import React, { useState } from "react";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { async } from "@firebase/util";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect } from "react";
import Card from "../components/card";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { BiCommentAdd } from "react-icons/bi";
import { Modal, Box, Button, Tooltip } from "@mui/material";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function Player() {
  const [cast, setCast] = useState(undefined);
  const [reviewState, setReviewState] = useState({
    newReview: {
      reviewTitle: "",
      reviewBody: "",
    },
    reviewList: null,
  });

  const { state } = useLocation();
  const [email, setEmail] = useState(undefined);
  const { trailer, movieData } = state;
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
  const synopsis = movieData.synopsis ? movieData.synopsis : movieData.overview;
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

  const addReview = async () => {
    try {
      if (
        reviewState.newReview.reviewTitle != "" &&
        reviewState.newReview.reviewBody != ""
      ) {
        const response = await axios.post(
          "http://localhost:5000/api/movie/addReview",
          {
            movieId: movieData.id,
            newReview: { email: email, review: reviewState.newReview },
          }
        );
        console.log(response);

        getReview();
      } else console.log("type something");
    } catch (err) {
      console.log(err);
    }
  };
  const getReview = async () => {
    try {
      const reviews = await axios.get(
        `http://localhost:5000/api/movie/fetchReview/${movieData.id}`
      );
      console.log(reviews);
      setReviewState({
        reviewList: reviews.data.reviews,
        newReview: {
          reviewBody: "",
          reviewTitle: "",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const removeReview = async (index) => {
    try {
      const reviews = await axios.put(
        "http://localhost:5000/api/movie/removeReview",
        {
          movieId: movieData.id,
          reviewIndex: index,
        }
      );

      console.log("delete", reviews);
      setReviewState({ ...reviewState, reviewList: reviews.data.reviews });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCast();
    getReview();
  }, [trailer]);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      //console.log("fbcalled");
      if (currentUser) {
        setEmail(currentUser.email);
      } else navigate("/login");
    });
  }, [email]);
  const navigate = useNavigate();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    height: "75vh",
    bgcolor: "#0c090a",
    borderRadius: "8px",
    border: "1px solid floralwhite",
    boxShadow: 24,
    overflow: "scroll",

    p: 4,
  };
  console.log(reviewState);
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
              <div style={{ textAlign: "center", margin: "10px" }}>
                <Button onClick={handleOpen} variant="outlined">
                  <BiCommentAdd size={30}></BiCommentAdd>
                  {" See Reviews "}
                </Button>
              </div>

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            className="reviewcontainer"
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "10px 0",
            }}
          >
            <h4 className=" ">Reviews</h4>
            <input
              type="text"
              placeholder="Write the Title of the review"
              name="review title"
              style={{
                padding: "8px",
                margin: "10px 0",
              }}
              value={reviewState.newReview.reviewTitle}
              onChange={(e) =>
                setReviewState({
                  ...reviewState,
                  newReview: {
                    ...reviewState.newReview,
                    reviewTitle: e.target.value,
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Write your thoughts"
              name="review"
              style={{
                padding: "8px",
                margin: "10px 0",
              }}
              value={reviewState.newReview.reviewBody}
              onChange={(e) =>
                setReviewState({
                  ...reviewState,
                  newReview: {
                    ...reviewState.newReview,
                    reviewBody: e.target.value,
                  },
                })
              }
            />
            <Button onClick={addReview} color="success" variant="contained">
              Add Review
            </Button>
          </div>

          {reviewState.reviewList != null
            ? reviewState.reviewList.map((element, index) => {
                return (
                  <div
                    className="p-3 my-3"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid floralwhite",
                    }}
                  >
                    <p
                      className="email"
                      style={{
                        color: "grey",
                        fontFamily: "Lucida Console, Courier New, monospace",
                        textAlign: "end",
                        fontWeight: "lighter",
                        margin: "0",
                      }}
                    >
                      {element.email}
                    </p>

                    <h3>{element.review.reviewTitle}</h3>
                    <p
                      style={{
                        color: "white",

                        fontWeight: "500",
                        margin: "10px 0",
                      }}
                    >
                      {element.review.reviewBody}
                    </p>

                    <Tooltip title="Delete review">
                      <RiDeleteBin5Fill
                        size={25}
                        style={{ color: "#f44336" }}
                        onClick={() => {
                          removeReview(index);
                        }}
                      ></RiDeleteBin5Fill>
                    </Tooltip>
                  </div>
                );
              })
            : null}
        </Box>
      </Modal>
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
  .email {
    color: grey;
    font-family: "Lucida Console", "Courier New", monospace;
    text-align: end;
    font-weight: lighter;
  }
`;
