import React, { Component } from "react";
import Button from "./button";

//this component handles all the buttons we expect to have
//and provide them to the App

class Buttons extends Component {
  render() {
    const buttons = this.props.numData.map(num => {
      return (
        <Button key={num.id} num={num} onClick={this.props.onClick}>
          {num.id}
        </Button>
      );
    });

    return <div>{buttons}</div>;
  }
}

export default Buttons;
