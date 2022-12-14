import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Header(props) {
  const navigate = useNavigate();
  return (
    <Container className="flex a-center j-between">
      <button onClick={() => navigate(props.login ? "/login" : "/signup")}>
        {props.login ? "Log In" : "Sign in"}
      </button>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 4rem;
  .logo {
    img {
      height: 5 rem;
    }
  }
  button {
    padding: 0.5 rem 1 rem;
    background-color: #0047ab;
    border: none;
    cursor: pointer;
    color: white;
    border-radiues: 0.2rem;
    font-weight: bolder;
    font-size: 1.05 rem;
  }
`;
