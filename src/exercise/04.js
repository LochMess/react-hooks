// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Move({current, moves, onClick}) {
  return moves.map((_, index) => {
    const btnText =
      (index === 0 ? 'Go to game start' : `Go to move #${index}`) +
      (current === index ? ' (current)' : '')

    return (
      <li key={index}>
        <button
          className="setMove"
          disabled={current === index}
          onClick={() => onClick(index)}
        >
          {btnText}
        </button>
      </li>
    )
  })
}

function Game() {
  const [current, setCurrent] = useLocalStorageState('current', 0)
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const winner = calculateWinner(history[current])
  const nextValue = calculateNextValue(history[current])
  const status = calculateStatus(winner, history[current], nextValue)

  function selectSquare(square) {
    if (history[current][square] !== null || winner) return

    const newSquares = [...history[current]]
    newSquares[square] = nextValue
    const newHistory = [...history.slice(0, current + 1), newSquares]

    setHistory(newHistory)
    setCurrent(current + 1)
  }

  function goToMove(moveIndex) {
    setCurrent(moveIndex)
  }

  function restart() {
    setCurrent(0)
    setHistory([Array(9).fill(null)])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={history[current]} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          <Move current={current} moves={history} onClick={goToMove} />
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
