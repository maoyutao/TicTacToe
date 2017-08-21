import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Piece } from './piece'

export class Chessboard extends React.Component {
  render() {
    return (
      <table id="chessboard">
        <tbody>
          <tr>
            <Piece id={0} />
            <Piece id={1} />
            <Piece id={2} />
          </tr>
          <tr>
            <Piece id={3} />
            <Piece id={4} />
            <Piece id={5} />
          </tr>
          <tr>
            <Piece id={6} />
            <Piece id={7} />
            <Piece id={8} />
          </tr>
        </tbody>
      </table>
    )
  }
}

