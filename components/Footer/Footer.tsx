import React from "react";
import styled from "@emotion/styled";
import { AiFillGithub } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";

const StyledDiv = styled("div")`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: black;
  color: white;
  padding: 20px;

  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  place-items: center;
  align-items: flex-start;
  overflow: hidden;
  isolation: isolate;

  &::before {
    --width: 600px;

    content: "";
    width: var(--width);
    aspect-ratio: 1/1;
    background-color: #222222;
    position: absolute;
    left: 0;
    bottom: 80%;
    border-radius: 50%;
    filter: blur(80px);
    z-index: -99;

    @keyframes move {
      0% {
        left: calc(-1 * var(--width));
      }
      100% {
        left: 100%;
      }
    }

    @keyframes blur {
      0% {
        filter: blur(80px);
      }
      100% {
        filter: blur(50px);
      }
    }

    animation: move 50s infinite, blur 4s ease infinite;
  }
`;

function Footer() {
  return (
    <StyledDiv>
      <div>
        <p className="text-center text-2xl font-lobster">Authors:</p>
        <p>
          <span className="font-bold">Daniel Antoš</span> - Graph functionality
        </p>
        <p>
          <span className="font-bold">Matěj Kotrba</span> - Web App
        </p>
      </div>
      <div>
        <p className="text-center text-2xl font-lobster">Links:</p>
        <p className="flex items-center gap-2 font-bold">
          Daniel Antoš:{" "}
          <a href="https://github.com/it-2001/">
            <AiFillGithub className="inline-block text-4xl" />
          </a>
        </p>
        <p className="flex items-center gap-2 font-bold">
          Matěj Kotrba:{" "}
          <a href="https://github.com/mkit2009/">
            <AiFillGithub className="inline-block text-4xl" />
          </a>
          <a href="https://matejkotrba.vercel.app" className="font-bold">
            <TfiGallery className="inline-block text-4xl" />
          </a>
        </p>
      </div>
    </StyledDiv>
  );
}

export default Footer;
