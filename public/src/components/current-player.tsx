import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ICurrentPlayer {
  currentPlayer1: string
  isPlayer1ready: boolean
  currentChessboard: string
  currentPlayer2: string
  isPlayer2ready: boolean
  currentViewers: string[]
}
export class CurrentPlayer extends React.Component<ICurrentPlayer> {
  render() {
    // console.log(this.props.currentLevel)
    return (
      <div>
        <p>player1:<span style={{visibility: this.props.isPlayer1ready ? "visible":"hidden"}} className="ready">ready</span></p>
        <p id="currentplayer1" className="displaybox">{this.props.currentPlayer1}</p>
        <p>chessboard:</p><p id="currentChessboard" className="displaybox">{this.props.currentChessboard}</p>
        <p>player2:<span  style={{visibility: this.props.isPlayer2ready ? "visible":"hidden"}} className='ready'>ready</span></p>
        <p id="currentplayer2" className="displaybox">{this.props.currentPlayer2}</p>
        <p>viewers:</p><p id="currentviewers" className="displaybox">{this.props.currentViewers.join(' ')}</p>
      </div>
    )
  }
}