import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { changeChessboardIfOk } from '../action'

interface IChessboardsProps {
  allplayers: {[index: string]: object}
  onChangeChessboard: (player: string) => (dispatch: (action: any) => void, getState: () => any) => void
}

class TChessboards extends React.Component<IChessboardsProps> {
  onChangeChessboard(index: string) {
    this.props.onChangeChessboard(index)
  }
  render() {
    const players: JSX.Element[] = []
    for (const index in this.props.allplayers) {
      const content: any = (
        <button key={index} name="player" onClick={this.onChangeChessboard.bind(this, index)}>
          { index }
        </button>
      )
      if (!(content in players)) {
        players.push(content)
      }
    }
    return (
      <div>
        <p>已有棋盘:</p>
        <div id="createdPlayers">
          { players }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: mstate) => {
  return {
    allplayers: state.allplayers
  }
}
const mapDispatchToProp = (dispatch: (action: any) => void) => bindActionCreators({
  onChangeChessboard: changeChessboardIfOk
}, dispatch)

export const Chessboards = connect(mapStateToProps, mapDispatchToProp)(TChessboards)