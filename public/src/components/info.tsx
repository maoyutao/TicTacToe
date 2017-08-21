import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Log } from './log'
import { CurrentPlayer } from './current-player'

interface IInfo {
  player: string,
  level?: number
  log: string
}
export class Info extends React.Component<IInfo> {
  render() {
    return <div id='info'>
      <CurrentPlayer currentPlayer={this.props.player} currentLevel={this.props.level} />
      <Log log={this.props.log} />
      </div>
  }
}