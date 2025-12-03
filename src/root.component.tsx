import React from "react";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import "./shell.css";

export default function Root() {
  console.log("root component shell");
  return (
    <div className="shell-container">
      <Header />
      <ProgressBar />
    </div>
  );
}
