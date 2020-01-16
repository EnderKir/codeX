import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

import { Download } from "../download/Download";

import "./Upload.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";

// ToDo: draw a picture in string
export const Upload = () => {
  const [pictureFlag, setPictureFlag] = useState(false);
  const { errors } = useSelector(state => ({
    errors: state.errors.error
  }));
  const dispatch = useDispatch();
  const parse = arrOfContent => {
    console.log(arrOfContent);
    const canvas = arrOfContent.find(elem => elem.split(" ")[0] === "C");
    if (canvas) {
      const str = canvas.replace(/\n/g, "");
      const cw = str.split(" ")[1];
      const ch = str.split(" ")[2];
      if (cw >= 4 && ch >= 4) {
        setCanvas(str);
        dispatch({
          type: "GET_ERRORS",
          value: ""
        });
        setPictureFlag(true);
      } else {
        dispatch({
          type: "GET_ERRORS",
          value: "too small canvas param's values"
        });
      }
    } else {
      dispatch({ type: "GET_ERRORS", value: "No canvas description" });
    }
    const lines = arrOfContent.filter(elem => elem.split(" ")[0] === "L");
    if (lines.length >= 1) {
      const correctLines = [];
      const cw = canvas.split(" ")[1];
      const ch = canvas.split(" ")[2];
      for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(/\n/g, "");
        let x1 = Number(lines[i].split(" ")[1]);
        let y1 = Number(lines[i].split(" ")[2]);
        let x2 = Number(lines[i].split(" ")[3]);
        let y2 = Number(lines[i].split(" ")[4]);
        if (
          x1 < 1 ||
          x1 > cw ||
          y1 < 1 ||
          y1 > ch ||
          x2 < 1 ||
          x2 > cw ||
          y2 < 1 ||
          y2 > ch
        ) {
          dispatch({
            type: "GET_ERRORS",
            value: "Line values ​​do not fit canvas size"
          });
        } else {
          correctLines.push(lines[i]);
        }
      }
      setLines(correctLines);
    }
    const rectangles = arrOfContent.filter(elem => elem.split(" ")[0] === "R");
    if (rectangles.length >= 1) {
      const correctRectangles = [];
      const cw = canvas.split(" ")[1];
      const ch = canvas.split(" ")[2];
      for (let i = 0; i < rectangles.length; i++) {
        rectangles[i] = rectangles[i].replace(/\n/g, "");
        let x1 = Number(rectangles[i].split(" ")[1]);
        let y1 = Number(rectangles[i].split(" ")[2]);
        let x2 = Number(rectangles[i].split(" ")[3]);
        let y2 = Number(rectangles[i].split(" ")[4]);
        if (
          x1 < 1 ||
          x1 > cw ||
          y1 < 1 ||
          y1 > ch ||
          x2 < 1 ||
          x2 > cw ||
          y2 < 1 ||
          y2 > ch
        ) {
          dispatch({
            type: "GET_ERRORS",
            value: "Rectangle values ​​do not fit canvas size"
          });
        } else {
          correctRectangles.push(rectangles[i]);
        }
      }
      setRectangles(correctRectangles);
    }
    const bucketFill = arrOfContent.filter(elem => elem.split(" ")[0] === "B");
    if (bucketFill.length >= 1) {
      const correctBucketFill = [];
      const cw = canvas.split(" ")[1];
      const ch = canvas.split(" ")[2];
      for (let i = 0; i < bucketFill.length; i++) {
        bucketFill[i] = bucketFill[i].replace(/\n/g, "");
        let x1 = Number(bucketFill[i].split(" ")[1]);
        let y1 = Number(bucketFill[i].split(" ")[2]);
        if (x1 < 1 || x1 > cw || y1 < 1 || y1 > ch) {
          dispatch({
            type: "GET_ERRORS",
            value: "BucketFill values ​​do not fit canvas size"
          });
        } else {
          correctBucketFill.push(bucketFill[i]);
        }
      }
      setBucketFill(correctBucketFill);
    }
  };
  const [canvas, setCanvas] = useState("");
  const [lines, setLines] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [bucketFill, setBucketFill] = useState([]);
  let fileReader;
  const handleFileRead = () => {
    const content = fileReader.result;
    parse(content.split(/(?=[A-Z])/));
  };
  const handleFileChosen = file => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };
  const onDrop = useCallback(acceptedFiles => {
    handleFileChosen(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="Upload">
      <span className="Title">Upload one .txt File</span>
      {errors ? <span className="errors">{errors}</span> : null}
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <FontAwesomeIcon icon={faFileUpload} size="4x" className="uploadIcon" />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag 'n' drop some file here, or click to select file</p>
        )}
      </div>
      <Download
        canvas={canvas}
        lines={lines}
        rectangles={rectangles}
        bucketFill={bucketFill}
        pictureFlag={pictureFlag}
      />
    </div>
  );
};
