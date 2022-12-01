import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
import path from "path";
import fs from "fs";
require("@babel/register")({
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    [
      "transform-assets",
      {
        extensions: ["css", "svg"],
        name: "static/media/[name].6ce24c58023cc2f8fd88fe9d219db6c6.[ext]",
      },
    ],
  ],
});
const App = require("../src/App").default;

const app = express();

app.get("/*", (req, res, next) => {
  console.log(`Request URL = ${req.url}`);
  if (req.url !== "/") {
    return next();
  }
  const reactApp = ReactDOMServer.renderToString(React.createElement(App));
  console.log(reactApp);

  const indexFile = path.resolve("build/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      const errMsg = `There is an error: ${err}`;
      console.error(errMsg);
      return res.status(500).send(errMsg);
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
    );
  });
});

app.use(express.static(path.resolve(__dirname, "../build")));

app.listen(8080, () =>
  console.log("Express server is running on localhost:8080")
);
