import React from "react";
import { Spinner } from "react-bootstrap";

function LoaderSpiner() {

  return (
    <>
    <div className="loader-main">
    <Spinner animation="border" variant="success" />
      </div></>
  )


}

export default LoaderSpiner;