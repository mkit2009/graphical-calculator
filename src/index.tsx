import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import MainContextWrapper from "./context/mainContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MainContextWrapper>
      <App />
    </MainContextWrapper>
  </React.StrictMode>
);
