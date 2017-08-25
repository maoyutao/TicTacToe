import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { changeChessboardIfOk } from '../action-creators'

interface IChessboardsProps {
  allChessboards: string[]
  onChangeChessboard: (chessboardname: string) => (dispatch: (action: any) => void, getState: () => any) => void
}

class TChessboards extends React.Component<IChessboardsProps> {
  onChangeChessboard(index: string) {
    this.props.onChangeChessboard(index)
  }
  render() {
    const players: JSX.Element[] = []
    this.props.allChessboards.forEach(chessboardname => {
      const content: JSX.Element = (
        <button key={chessboardname} name="player" onClick={this.onChangeChessboard.bind(this, chessboardname)}>
          { chessboardname }
        </button>
      )
      players.push(content)
    })
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
    allChessboards: state.allChessboards
  }
}
const mapDispatchToProp = (dispatch: (action: any) => void) => bindActionCreators({
  onChangeChessboard: changeChessboardIfOk
}, dispatch)

export const Chessboards = connect(mapStateToProps, mapDispatchToProp)(TChessboards)