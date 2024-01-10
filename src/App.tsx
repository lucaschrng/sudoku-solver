import './App.css'
import { useState } from 'react';
import clsx from 'clsx';

function App() {
  const gridSize = 9;
  const gridTemplate: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

  const [grid, setGrid] = useState(gridTemplate);
  const [solvedGrid, setSolvedGrid] = useState(gridTemplate);
  const [isSolved, setIsSolved] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, boxIndex: number, cellIndex: number) => {
    const value = event.target.value;

    if (!(value === '') && !/^[1-9]$/.test(value)) return;
    setGrid(prevState => {
      const newState = prevState.map(row => [...row]);
      newState[boxIndex][cellIndex] = value;
      return newState;
    });
  }

  const solve = () => {
    const solvedGrid = solveGrid(flattenGrid(grid));
    
    if (solvedGrid) {
      setIsSolved(true);
      setSolvedGrid(nestGrid(solvedGrid))
    }
  }

  const flattenGrid = (grid: string[][]) => {
    const flatGrid: string[][] = [];

    for (let i = 0; i < grid.length; i += 3) {
      for (let j = 0; j < grid[i].length; j += 3) {
        const box = [];
        for (let k = 0; k < 3; k++) {
          box.push(grid[i + k].slice(j, j + 3));
        }
        flatGrid.push(box.flat());
      }
    }

    return flatGrid;
  }

  const nestGrid = (grid: string[][]) => {
    const nestedGrid: string[][] = [];

    for (let i = 0; i < grid.length; i += 3) {
      for (let j = 0; j < grid[i].length; j += 3) {
        const box = [];
        for (let k = 0; k < 3; k++) {
          box.push(grid[i + k].slice(j, j + 3));
        }
        nestedGrid.push(box.flat());
      }
    }

    return nestedGrid;
  }

  const findEmpty = (grid: string[][]) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '') return [i, j];
      }
    }
    return null;
  }

  const isValid = (grid: string[][], num: string, pos: number[]) => {
    const [row, col] = pos;

    // Check row
    for (let i = 0; i < grid[row].length; i++) {
      if (grid[row][i] === num && i !== col) return false;
    }

    // Check column
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][col] === num && i !== row) return false;
    }

    // Check box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (grid[i][j] === num && (i !== row || j !== col)) {
          return false;
        }
      }
    }

    return true;
  }

  const solveGrid = (grid: string[][]): string[][] | null => {
    const empty = findEmpty(grid);
    if (!empty) return grid;

    const [row, col] = empty;

    for (let i = 1; i <= 9; i++) {
      const num = i.toString();
      if (isValid(grid, num, [row, col])) {
        grid[row][col] = num;
        if (solveGrid(grid)) return grid;
        grid[row][col] = '';
      }
    }

    return null;
  }

  return (
    <>
      <div className="grid grid-cols-3 w-fit">
        {(isSolved ? solvedGrid : grid).map((box, boxIndex) => (
          <div
            key={boxIndex}
            className="grid grid-cols-3 w-fit border border-neutral-500"
          >
            {box.map((cell, cellIndex) => (
              <input
                key={cellIndex}
                className={clsx(
                  'border w-8 h-8 text-center',
                  grid[boxIndex][cellIndex] !== solvedGrid[boxIndex][cellIndex] && cell && 'text-green-500'
                )}
                value={cell}
                onChange={event => handleInputChange(event, boxIndex, cellIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={solve}>
        Solve
      </button>
    </>
  )
}

export default App
