import React from "react";

import { Upload } from "../upload/Upload";
// import { Download } from "../download/Download";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const App = () => {
  return (
    <div className="App">
      <div className="Card">
        <Upload />
        {/* <Download /> */}
      </div>
    </div>
  );
};
