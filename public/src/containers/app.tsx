import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { placePieceIfOk, changeChessboardIfOk, restartIfOk, init, readyIfOk, leaveIfOk, updateIfOk } from '../action-creators'
import { Info, Restart, Ready, Leave, CreateNewChessboard, Chessboards, Chessboard } from '../components'

interface ITicTacToeProps {
  onRestart: () => (dispatch: (action: any) => void, getState: () => any) => void,
  onReady: () => (dispatch: (action: any) => void, getState: () => any) => void,
  onLeave: () => (dispatch: (action: any) => void, getState: () => any) => void,
  init: () => (dispatch: (action: any) => void) => void,
  update: () => (dispatch: (action: any) => void, getState: () => any) => void,
  log: string,
  player1: string,
  player2: string,
  isPlayer1ready: boolean,
  isPlayer2ready: boolean,
  viewers: string[],
  chessboardName: string
}

export class TTicTacToe extends React.Component<ITicTacToeProps> {
  componentDidMount() {
    this.props.init()
    setInterval(() => {
      this.props.update()
    }, 3000)
  }
  render() {
    return (
      <div>
        <h1>TicTacToe</h1>
        <Info player1={this.props.player1} chessboardName={this.props.chessboardName}log={this.props.log}
              Player2={this.props.player2} viewers={this.props.viewers} isPlayer1ready={this.props.isPlayer1ready} isPlayer2ready={this.props.isPlayer2ready}/>
        <div id="Buttons">
          <Restart onClick={this.props.onRestart} />
          <Ready onClick={this.props.onReady} />
          <Leave onClick={this.props.onLeave} />
        </div>
        <div id="Players">
          <CreateNewChessboard />
          <Chessboards />
        </div>
        <Chessboard chessboard={this.props.chessboardName}/>
      </div>
    )
  }
}

const mapStateToProps = (state: mstate) => {
  return {
    log: state.log,
    player1: state.player1,
    player2: state.player2,
    isPlayer1ready: state.isPlayer1ready,
    isPlayer2ready: state.isPlayer2ready,
    viewers: state.viewers,
    chessboardName: state.chessboardName,
  }
}
const mapDispatchToProps = (dispatch: (action: any) => void) => bindActionCreators({
    onRestart: restartIfOk,
    onReady: readyIfOk,
    onLeave: leaveIfOk,
    init: init,
    update: updateIfOk,
}, dispatch)

const App = connect(mapStateToProps, mapDispatchToProps)(TTicTacToe)
export default App