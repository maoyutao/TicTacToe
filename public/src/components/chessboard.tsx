import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Piece } from './piece'

interface IChessboardProps {
  player: string
}

interface IChessboardState {
  strokeDashoffset: number
  change: number
}
export class Chessboard extends React.Component<IChessboardProps, IChessboardState> {
  constructor(props: IChessboardProps) {
    super()
    this.state = {
      strokeDashoffset: 0,
      change: 0,
    }
  }
  componentWillReceiveProps(nextProps: IChessboardProps) {
    if (this.props.player !== nextProps.player) {
      this.setState({ 
        strokeDashoffset: this.state.strokeDashoffset+102,
        change: this.state.change + 1,
      })
      setTimeout(() => {
        this.setState({ strokeDashoffset: this.state.strokeDashoffset-102 })
      }, 600)
    }
  }
  render() {
    return (
      <div id="chessboard">
        <div id="chessboardsvg">
          <svg viewBox="0 10 216 216" >
            <path d="M108,83L6,83" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M108,83L210,83" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M73,118L73,16" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M73,118L73,220" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M108,153L6,153" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M108,153L210,153" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M143,118L143,16" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
            <path d="M143,118L143,220" style={{ strokeDashoffset: this.state.strokeDashoffset }}></path>
          </svg>
        </div>
        <table>
          <tbody>
            <tr>
              <Piece id={0} change={this.state.change} />
              <Piece id={1} change={this.state.change} />
              <Piece id={2} change={this.state.change} />
            </tr>
            <tr>
              <Piece id={3} change={this.state.change} />
              <Piece id={4} change={this.state.change} />
              <Piece id={5} change={this.state.change} />
            </tr>
            <tr>
              <Piece id={6} change={this.state.change} />
              <Piece id={7} change={this.state.change} />
              <Piece id={8} change={this.state.change} />
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

