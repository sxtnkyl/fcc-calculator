import React, { Component } from "react";
import "./App.css";
import Buttons from "./buttons";
import Guide from "./guide";

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
      activeDisplay: [],
      //holds calc values
      storedValue: [],
      error: ""
    };
    return initialState;
  };

  ////////keypress/click listeners
  //lifecycle order map
  //https://cdn-images-1.medium.com/max/2400/1*sn-ftowp0_VVRbeUAFECMA.png
  //https://codeburst.io/how-to-use-react-lifecycle-methods-ddc79699b34e
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = e => {
    e.preventDefault();
    //take e.keyCode, match to num.keycode
    const nums = this.props.numData;
    const isKey = nums.find(obj => {
      return obj.keycode.includes(e.keyCode);
    });
    //console.log("iskey is: ", isKey);
    isKey === undefined ? this.handleError(e.key) : this.fetchId(isKey);
  };

  handleClick = e => {
    //console.log("click handled", e);
    this.fetchId(e);
  };

  handleError = e => {
    //console.log("error called", e);
    //show error message
    this.setState({
      error: <p>The key "{e}" is not a valid input.</p>
    });
    setTimeout(() => {
      this.setState({ error: "" });
    }, 3500);
  };

  //gets obj from click/keypress of which numkey we are using, to determine action
  fetchId = fetchedKey => {
    const storedValue = [...this.state.storedValue];
    const activeDisplay = [...this.state.activeDisplay];
    const displayandOperand = storedValue.concat(activeDisplay, fetchedKey.id);

    //console.log("fetched numkey", fetchedKey);
    //if clear
    if (fetchedKey.value === "delete") {
      this.resetCalc();
    }
    //if backspace
    if (fetchedKey.value === "backspace") {
      this.clearLast();
    }
    //if undo last
    if (fetchedKey.value === "rightshift") {
      this.undoLast();
    }
    //if num
    if (typeof fetchedKey.value === "number") {
      //console.log("fetchkey num called");
      this.updateDisplay(fetchedKey.value);
    }
    ////////////////////////////////////////////////////////if operand
    //set the storedValule = activeDisplay, store operand, reset activeDisplay
    if (fetchedKey.value === "operand") {
      //error: if first input is operand
      if (storedValue.length === 0 && activeDisplay.length === 0) {
        this.setState({
          error: <p>First input cannot be an operand. Please enter a number.</p>
        });
        setTimeout(() => {
          this.setState({ storedValue: [], error: "" });
        }, 3500);
      }
      //error: operand to op in equation or num to num after equals
      if (
        (typeof storedValue[storedValue.length - 1] === "string" &&
          activeDisplay.length === 0) ||
        typeof storedValue[storedValue.length - 1] === typeof activeDisplay[0]
      ) {
        this.setState({
          error: <p>A number must follow an operand.</p>
        });
        setTimeout(() => {
          this.setState({ activeDisplay: [], error: "" });
        }, 3500);
      } else
        this.setState({ storedValue: displayandOperand, activeDisplay: [] });
    }
    ////////////////////////////////////////////////if plusminus, stored as key 220 or backslash
    if (fetchedKey.value === "plusminus") {
      //removes first index, makes inverse
      //takes the inverted first index and adds it back to display
      //set activedisplay or storedvalue as new variable
      //if storedvalue has num and display is blank, plusminus the storedvalue

      //only storedValue has data
      if (storedValue.length && !activeDisplay.length) {
        const firstStoredElement = -1 * storedValue.shift();
        storedValue.unshift(firstStoredElement);
        const inverseStored = [...storedValue];
        this.setState({ storedValue: inverseStored });
      }

      //activeDisplay has data
      else {
        console.log(activeDisplay[0]);
        //if starts with a decimal
        if (activeDisplay[0] === ".") {
          activeDisplay.unshift("-");
          console.log(activeDisplay);
          this.setState({ activeDisplay: activeDisplay });
        }
        //if starts with a negative
        else if (activeDisplay[0] === "-") {
          const y = activeDisplay.slice(1);
          this.setState({ activeDisplay: y });
        }
        //if starts with a num
        else {
          const firstElement = -1 * activeDisplay.shift();
          activeDisplay.unshift(firstElement);
          const inverseDisplay = [...activeDisplay];
          this.setState({ activeDisplay: inverseDisplay });
        }
      }
    }
    //if decimal
    if (fetchedKey.value === "decimal") {
      //only one decimal, does display have decimal?
      const decimal = ".";
      if (!this.state.activeDisplay.includes(decimal)) {
        this.updateDisplay(fetchedKey.id);
      } else return;
    }
    //////////////////////////////////////////////////if equals
    if (fetchedKey.value === "equal") {
      //if last input in storedvalue was num and not operand
      const lastInput = [...storedValue];
      const equationArr = lastInput.concat(activeDisplay);
      if (
        typeof storedValue[storedValue.length - 1] === "string" &&
        (typeof activeDisplay[activeDisplay.length - 1] === "number" || ".")
      ) {
        // this.setState({
        //   storedValue: equationArr,
        //   activeDisplay: []
        // });
        // !!!computeValue was not getting "storedValue: equationArr" onClick, but did on keyPress
        // still dont know why, ended up passing the equationArr as arg for func to ensure it recieved updated state array
        // console.log(equationArr);
        this.computeValue(equationArr);
      } else {
        this.setState({
          activeDisplay: [],
          error: (
            <p>
              Cannot calculate an answer without an operand. Please enter an
              operand before a number.
            </p>
          )
        });
        setTimeout(() => {
          this.setState({ error: "" });
        }, 3500);
      }
    }
  };

  //receives inputs in an array, computes the answer, sets storedValue to answer
  //https://stackoverflow.com/questions/33476637/what-are-the-variable-types-for-different-colors-in-chrome-developer-console
  computeValue = equationArr => {
    //console.log("compvalue called", equationArr);
    const stringedEquation = equationArr.join("");
    //console.log(stringedEquation);
    const answer = eval(stringedEquation);
    //console.log(answer);
    //error: remove operand if last index in stored
    this.setState({
      storedValue: [answer],
      activeDisplay: []
    });
  };

  // gets obj from fetchId, updates activeDisplay(str)
  updateDisplay = e => {
    const activeDisplay = [...this.state.activeDisplay];
    const udpatedDisplay = [...activeDisplay, e];
    if (activeDisplay[0] === 0 && activeDisplay.length === 1) {
      this.setState({ activeDisplay: [e] });
    } else this.setState({ activeDisplay: udpatedDisplay });
  };

  //clear last input
  clearLast = () => {
    //console.log("clearlast called");
    const activeDisplay = [...this.state.activeDisplay];
    const resetDisplay = [];
    const slicedDisplay = activeDisplay.slice(0, activeDisplay.length - 1);
    if (activeDisplay.length > 0) {
      this.setState({
        activeDisplay: slicedDisplay
      });
    } else if (activeDisplay.length === 0) {
      this.setState({
        activeDisplay: resetDisplay
      });
    }
  };

  //undo last removes last entry in storedValue
  undoLast = () => {
    const storedValue = [...this.state.storedValue];
    if (storedValue.length > 1) {
      storedValue.splice(storedValue.length - 1, 1);
      this.setState({ storedValue: storedValue });
    }
  };

  //reset input/state
  //https://stackoverflow.com/questions/38558200/react-setstate-not-updating-immediately
  resetCalc = () => {
    this.setState(this.getInitialState(this.state));
  };

  render() {
    return (
      <div className="container">
        <div className="col-sm-6" id="displayscreen">
          <p>{this.state.storedValue}</p>
          {this.state.activeDisplay}
          {this.state.error}
        </div>
        <div className="col-sm-6" id="inputkeys">
          <Buttons numData={this.props.numData} onClick={this.handleClick} />
        </div>
        <Guide />
      </div>
    );
  }
}

export default App;
