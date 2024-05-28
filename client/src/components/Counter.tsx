import React, { useState } from "react";

const Counter: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);

  const handleIncrement = (): void => {
    setCounter(counter + 1);
  };

  const handleDecrement = (): void => {
    setCounter(counter - 1);
  };

  const handleReset = (): void => {
    setCounter(0);
  };

  return (
    <div>
      <h1>{counter}</h1>
      <br />
      <button onClick={handleIncrement}>increment</button>
      <button onClick={handleDecrement}>decrement</button>
      <button onClick={handleReset}>reset</button>
    </div>
  );
};

export default Counter;
