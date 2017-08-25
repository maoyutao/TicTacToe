import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Log } from './log'
import { CurrentPlayer } from './current-player'

interface IInfo {
  chessboardName: string
  player1: string
  Player2: string
  isPlayer1ready: boolean
  isPlayer2ready: boolean
  log: string
  viewers: string[]
}
export class Info extends React.Component<IInfo> {
  render() {
    return <div id='info'>
      <CurrentPlayer currentPlayer1={this.props.player1} currentChessboard={this.props.chessboardName}
                     currentPlayer2={this.props.Player2} currentViewers={this.props.viewers}
                     isPlayer1ready={this.props.isPlayer1ready} isPlayer2ready={this.props.isPlayer2ready}/>
      <Log log={this.props.log} />
      </div>
  }
}