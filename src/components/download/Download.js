import React from "react";
import { useSelector } from "react-redux";

import "./Download.css";
import { Button } from "react-bootstrap";

export const Download = ({
  canvas,
  lines,
  rectangles,
  bucketFill,
  pictureFlag
}) => {
  const { errors } = useSelector(state => ({
    errors: state.errors.error
  }));
  let picture = [];
  const symbol = "\u{00D7}";
  const drawCanvas = canvas => {
    const cw = Number(canvas.split(" ")[1]);
    const ch = Number(canvas.split(" ")[2]);
    let topLine = ``;
    let innerLine = ``;
    for (let i = 1; i <= cw + 2; i++) {
      if (i === cw + 2) {
        topLine += `-\n`;
      } else {
        topLine += `-`;
      }
    }
    let bottomLine = topLine.slice(0, -1);
    for (let i = 1; i <= cw + 2; i++) {
      if (i === 1) {
        innerLine += `|`;
      } else if (i === cw + 2) {
        innerLine += `|\n`;
      } else {
        innerLine += ` `;
      }
    }
    picture.push(topLine);
    for (let i = 1; i <= ch; i++) {
      picture.push(innerLine);
    }
    picture.push(bottomLine);
  };
  const drawLines = lines => {
    for (let i = 0; i < lines.length; i++) {
      const x1 = Number(lines[i].split(" ")[1]);
      const y1 = Number(lines[i].split(" ")[2]);
      const x2 = Number(lines[i].split(" ")[3]);
      const y2 = Number(lines[i].split(" ")[4]);
      if (x1 === x2) {
        for (let i = y1; i <= y2; i++) {
          picture[i] =
            picture[i].substr(0, x1) +
            symbol +
            picture[i].substr(x1 + symbol.length);
        }
      } else if (y1 === y2) {
        for (let i = x1; i <= x2; i++) {
          picture[y1] =
            picture[y1].substr(0, i) +
            symbol +
            picture[y1].substr(i + symbol.length);
        }
      }
    }
  };
  const drawRectangles = rectangles => {
    for (let i = 0; i < rectangles.length; i++) {
      const x1 = Number(rectangles[i].split(" ")[1]);
      const y1 = Number(rectangles[i].split(" ")[2]);
      const x2 = Number(rectangles[i].split(" ")[3]);
      const y2 = Number(rectangles[i].split(" ")[4]);
      for (let i = y1; i <= y2; i++) {
        picture[i] =
          picture[i].substr(0, x1) +
          symbol +
          picture[i].substr(x1 + symbol.length);
      }
      for (let i = x1; i <= x2; i++) {
        picture[y1] =
          picture[y1].substr(0, i) +
          symbol +
          picture[y1].substr(i + symbol.length);
      }
      for (let i = y2; i >= y1; i--) {
        picture[i] =
          picture[i].substr(0, x2) +
          symbol +
          picture[i].substr(x2 + symbol.length);
      }
      for (let i = x2; i >= x1; i--) {
        picture[y2] =
          picture[y2].substr(0, i) +
          symbol +
          picture[y2].substr(i + symbol.length);
      }
    }
  };
  const drawBucketFill = bucketFill => {
    const cw = Number(canvas.split(" ")[1]);
    const ch = Number(canvas.split(" ")[2]);
    const floodFill4 = (x, y, newSymbol, oldSymbol) => {
      if (
        x >= 1 &&
        x <= cw &&
        y >= 1 &&
        y <= ch &&
        picture[y][x] !== symbol &&
        picture[y][x] !== newSymbol &&
        picture[y][x] === oldSymbol
      ) {
        picture[y] =
          picture[y].substr(0, x) +
          newSymbol +
          picture[y].substr(x + newSymbol.length);
        floodFill4(x + 1, y, newSymbol, oldSymbol);
        floodFill4(x - 1, y, newSymbol, oldSymbol);
        floodFill4(x, y + 1, newSymbol, oldSymbol);
        floodFill4(x, y - 1, newSymbol, oldSymbol);
      }
    };
    for (let i = 0; i < bucketFill.length; i++) {
      const x = Number(bucketFill[i].split(" ")[1]);
      const y = Number(bucketFill[i].split(" ")[2]);
      const newSymbol = bucketFill[i].split(" ")[3];
      floodFill4(x, y, newSymbol, " ");
    }
  };
  const downloadTxtFile = () => {
    if (canvas !== "" && errors === "") {
      drawCanvas(canvas);
      if (lines !== []) {
        drawLines(lines);
      }
      if (rectangles !== []) {
        drawRectangles(rectangles);
      }
      if (bucketFill !== []) {
        drawBucketFill(bucketFill);
      }
    }
    const pictureStr = picture.join("");
    const element = document.createElement("a");
    const file = new Blob([pictureStr], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "output.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    picture = [];
  };
  return (
    <div className="buttons">
      <Button
        variant="success"
        className="download"
        onClick={downloadTxtFile}
        disabled={pictureFlag && errors === "" ? false : true}
      >
        Download .txt result
      </Button>
      <span>Download button is disabled until file is loaded</span>
    </div>
  );
};
