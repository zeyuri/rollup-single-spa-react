import * as React from "react";
import "./global.css";
import logo from "./neji.png";

export default function Root(props) {
  return (
    <>
      <section>{props.name} is dsadas!</section>
      <img src={logo} width="300px" />
    </>
  );
}
