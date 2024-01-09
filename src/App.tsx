import './App.css'
import { useState } from 'react';

function App() {
  const gridSize = 9;
  const gridTemplate: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

  const [grid, setGrid] = useState(gridTemplate);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, boxIndex: number, cellIndex: number) => {
    const value = event.target.value;

    if (!(value === '') && !/^[1-9]$/.test(value)) return;
    setGrid(prevState => {
      const newState = [...prevState];
      newState[boxIndex][cellIndex] = value;
      return newState;
    });

    console.log(grid)
  }

  return (
    <div className="grid grid-cols-3 w-fit">
      {grid.map((box, boxIndex) => (
        <div
          key={boxIndex}
          className="grid grid-cols-3 w-fit border border-neutral-500"
        >
          {box.map((cell, cellIndex) => (
            <input
              key={cellIndex}
              className="border w-8 h-8 text-center"
              value={cell}
              onChange={event => handleInputChange(event, boxIndex, cellIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
