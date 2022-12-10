import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Movies from "./pages/movies";
import Player from "./pages/player";
import Signup from "./pages/signup";
import TV from "./pages/tv";
import UserLiked from "./pages/userliked";
export default function App() {
  return (<BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<Login/>}></Route>
      <Route exact path="/signup" element={<Signup/>}></Route>
      <Route exact path="/player" element={<Player/>}></Route>
      <Route exact path="/" element={<Home/>}></Route>
      <Route exact path="/movies" element={<Movies/>}></Route>
      <Route exact path="/tv" element={<TV/>}></Route>
      <Route exact path="/mylist" element={<UserLiked/>}></Route>
    </Routes>
  </BrowserRouter>);
}
