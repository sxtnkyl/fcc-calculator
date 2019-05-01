import React from "react";
const Guide = () => {
  return (
    <div className="guide">
      <p>
        Welcome to the React Calculator! This calculator contains some
        additional features you should be aware of. All buttons are mapped to
        keyboard commands, just in case your mouse ran away. All numbers can be
        input with the numpad or number row, while the other buttons are as
        follows:
      </p>
      <ul id="list">
        <li>Clear : Delete</li>
        <li>Clear Last Input : Shift</li>
        <li>Undo Last Entry : Backspace</li>
        <li>Equal : Enter</li>
        <li>Plus/Minus : Pipe/Forward Slash</li>
      </ul>
      Clear resets the calculator memory. Clear Last Input removes a single
      character of current input. Undo Last Entry removes the previous operand
      or number in a stringed equation.
    </div>
  );
};

export default Guide;
