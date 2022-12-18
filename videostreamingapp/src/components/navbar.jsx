import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";
import { useEffect } from "react";

export default function Navbar({ isScrolled }) {
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [searchBarHover, setSearchBarHover] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movie", link: "/movies" },
    { name: "Bookmarks", link: "/bookmarks" },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("fbcalled");
      if (!currentUser) navigate("/login");
    });
  }, []);

  const getVideos = async (movieData) => {
    console.log(movieData);
    try {
      console.log(movieData);
      if (movieData.media_type === "tv") {
        const VideoData = await axios.get(
          `${TMDB_BASE_URL}/tv/${movieData.id}/videos?api_key=${API_KEY}`
        );

        console.log(VideoData.data.results);
        const trailer = VideoData.data.results.find(
          (vid) => vid.type === "Trailer"
        );
        if (trailer) {
          navigate("/player", {
            state: { trailer: trailer, movieData: movieData },
          });
        } else return <alert>Movie not available . Sorry!</alert>;
      } else {
        const VideoData = await axios.get(
          `${TMDB_BASE_URL}/movie/${movieData.id}/videos?api_key=${API_KEY}`
        );

        // console.log(VideoData.data.results);
        const trailer = VideoData.data.results.find(
          (vid) => vid.type === "Trailer"
        );
        if (trailer)
          navigate("/player", {
            state: { trailer: trailer, movieData: movieData },
          });
        else return <alert>Movie not available . Sorry!</alert>;
        //console.log(trail);
      }
    } catch (err) {
      console.log("err1", err);
    }
  };
  const findMovie = async (moviename) => {
    try {
      if (moviename) {
        const result = await axios.get(
          `${TMDB_BASE_URL}/search/multi?api_key=${API_KEY}&query=${moviename}&language=en-US&include_adult=false`
        );
        //console.log(result.data.results)
        setSearchResult(result.data.results);
      } else setSearchResult(null);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(showSearch,searchBarHover,inputHover);
  return (
    <Container>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        <div className="left flex a-center">
          <ul className="links flex">
            {links.map(({ name, link }) => {
              return (
                <li key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="right flex a-center  ">
          <div className="d-flex flex-column">
            <div className={`search ${showSearch ? "show-search" : ""}`}>
              <button
                onFocus={() => setShowSearch(true)}
                onBlur={() => {
                  if (!inputHover && !searchBarHover) setShowSearch(false);
                }}
              >
                <FaSearch />
              </button>
              <input
                type="text"
                placeholder="Search"
                onMouseEnter={() => setInputHover(true)}
                onMouseLeave={() => setInputHover(false)}
                onBlur={() => {
                  if (!searchBarHover) setShowSearch(false);
                }}
                onInput={(e) => findMovie(e.target.value)}
              ></input>
            </div>
            {showSearch && searchResult && (
              <div
                className="d-flex flex-column search-box overflow-scroll "
                onMouseEnter={() => setSearchBarHover(true)}
                onMouseLeave={() => setSearchBarHover(false)}
              >
                {searchResult.map((res, id) => {
                  if (res.media_type != "person" && res.backdrop_path != null) {
                    //   console.log(res);
                    const title = res.title ? res.title : res.name;
                    const release = res.release_date
                      ? res.release_date
                      : res.first_air_date;

                    return (
                      <div
                        className="d-flex flex-row justify-content-start p-2 search-result"
                        onClick={() => getVideos(res)}
                      >
                        <div>
                          <img
                            src={`https://image.tmdb.org/t/p/w500${res.backdrop_path}`}
                            width="150px"
                            height="120px"
                            className="pe-4"
                          />
                        </div>
                        <div>
                          <h5>{title}</h5>
                          <h6>{release}</h6>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>

          <button onClick={() => signOut(firebaseAuth)}>
            <FaPowerOff />
          </button>
        </div>
      </nav>
    </Container>
  );
}
const Container = styled.div`
  .scrolled {
    background-color: black;
  }
  nav {
    position: sticky;
    top: 0;
    height: 6.5rem;
    width: 100%;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 2;
    padding: 0 4rem;
    align-items: center;
    transition: 0.3s ease-in-out;
    .left {
      gap: 2rem;
      .brand {
        img {
          height: 4rem;
        }
      }
      .links {
        list-style-type: none;
        gap: 2rem;
        li {
          a {
            color: white;
            text-decoration: none;
          }
        }
      }
    }
    .right {
      gap: 1rem;
      button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus {
          outline: none;
        }
        svg {
          color: #0047ab;
          font-size: 1.2rem;
        }
      }
      .search-box {
        position: absolute;
        top: 5rem;
        height: 500px;
        width: 540px;
      }
      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        padding-left: 0.5rem;
        button {
          background-color: transparent;
          border: none;
          &:focus {
            outline: none;
          }
          svg {
            color: white;
            font-size: 1.2rem;
          }
        }
        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus {
            outline: none;
          }
        }
      }
      .show-search {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 500px;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }
      .search-result {
        background-color: black;
      }
    }
  }
`;
