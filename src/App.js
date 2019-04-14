import React, { Component } from "react";
import "./App.css";
import Buttons from "./buttons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  //func method to store initial state
  //https://stackoverflow.com/questions/30668326/what-is-the-difference-between-using-constructor-vs-getinitialstate-in-react-r
  getInitialState = () => {
    const initialState = {
      //power
      power: true,
      //active display
      activeDisplay: "0",
      //holds calc values
      activeCalc: [],
      notaKey: ""
    };
    return initialState;
  };

  //keypress listeners
  //lifecycle order map
  //https://cdn-images-1.medium.com/max/2400/1*sn-ftowp0_VVRbeUAFECMA.png
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  handleKeyPress = e => {
    e.preventDefault();
    console.log("keypress called", e.keyCode);
    //take e.keyCode, match to num.keycode
    const nums = this.props.numData;
    const isKey = nums.find(obj => {
      return obj.keycode.includes(e.keyCode);
    });
    //console.log("iskey is: ", isKey);
    isKey === undefined ? this.handleNotAKey(e.key) : this.fetchId(isKey);
  };

  handleNotAKey = e => {
    //console.log("notakey called", e);
    //show error message
    this.setState({
      notaKey: <p>The key "{e}" is not a valid input.</p>
    });
    setTimeout(() => {
      this.setState({ notaKey: "" });
    }, 3500);
  };

  handleClick = e => {
    //console.log("click handled", e);
    this.fetchId(e);
  };

  //passes an obj of which numkey we are using, to determine action
  fetchId = fetchedKey => {
    //console.log("fetched numkey", fetchedKey);

    //if clear
    if (fetchedKey.value === "delete") {
      this.resetCalc();
    }
    //if backspace
    if (fetchedKey.value === "backspace") {
      this.clearLast();
    }
    //if num
    if (typeof fetchedKey.value === "number") {
      //console.log("fetchkey num called");
      this.updateDisplay(fetchedKey.id);
      this.updateCalc(fetchedKey.value);
    }
    //if operand
    //if decimal
    if (fetchedKey.value === "decimal") {
    }
  };

  // gets obj from fetchId, updates activeDisplay(str)
  updateDisplay = e => {
    //console.log(typeof e);
    const activeDisplay = this.state.activeDisplay;
    if (activeDisplay === "0") {
      this.setState({ activeDisplay: e });
    } else this.setState({ activeDisplay: activeDisplay + e });
  };

  // gets obj value from fetchId, updates activeCalc (num)
  //https://www.robinwieruch.de/react-state-array-add-update-remove/
  updateCalc = e => {
    //console.log("updateCalc called", e);
    const activeCalc = this.state.activeCalc;
    this.setState({ activeCalc: activeCalc.concat(e) });
    console.log("stateactiveclac:", this.state.activeCalc);
  };

  //clear last input
  clearLast = () => {
    //console.log("clearlast called");
    const activeCalc = this.state.activeCalc;
    const activeDisplay = this.state.activeDisplay;
    if (activeCalc.length > 1) {
      this.setState({
        activeCalc: activeCalc.slice(0, activeCalc.length - 1),
        activeDisplay: activeDisplay.slice(0, activeDisplay.length - 1)
      });
    } else if (activeCalc.length === 1) {
      this.setState({
        activeDisplay: "0",
        activeCalc: []
      });
    }
    console.log("stateactiveclac:", this.state.activeCalc);
  };

  //reset input/state
  //https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  resetCalc = () => {
    console.log("resetCalc called", this.state.activeCalc);
    this.setState(this.getInitialState());
  };

  render() {
    return (
      <div className="container">
        <div className="col-sm-6" id="displayscreen">
          {this.state.activeDisplay}
          {this.state.notaKey}
        </div>
        <div className="col-sm-6" id="inputkeys">
          <Buttons numData={this.props.numData} onClick={this.handleClick} />
        </div>
      </div>
    );
  }
}

export default App;
