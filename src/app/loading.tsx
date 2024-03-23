import React from "react";
import Loading from "../components/ui/loading";

const LoadingMyLibrary = () => (
  <div className="absolute w-screen h-screen top-0 bottom-0 right-0 left-0">
    <Loading spinnerClassName="w-20 h-20"/>
  </div>
);

export default LoadingMyLibrary;
