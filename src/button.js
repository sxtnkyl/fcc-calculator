import React, { Component } from "react";
//represents a single button, handles click to pass to App

class Button extends Component {
  render() {
    return (
      <button
        id={this.props.num.id}
        onClick={() => this.props.onClick(this.props.num)}
      >
        {this.props.num.id}
      </button>
    );
  }
}

export default Button;
