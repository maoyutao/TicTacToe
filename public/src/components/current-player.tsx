import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ICurrentPlayer {
  currentPlayer: string
  currentLevel?: number
}
export class CurrentPlayer extends React.Component<ICurrentPlayer> {
  render() {
    // console.log(this.props.currentLevel)
    return (
      <div>
        <p>player:</p><p id="currentplayer" className="displaybox">{this.props.currentPlayer}</p>
        <p>level:</p><p id="currentlevel" className="displaybox">{this.props.currentLevel}</p>  
      </div>
    )
  }
}