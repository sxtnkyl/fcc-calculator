import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import numData from "./numData";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App numData={numData} />, document.getElementById("root"));

serviceWorker.unregister();
