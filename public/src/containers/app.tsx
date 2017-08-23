import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { placePieceIfOk, changeChessboardIfOk, restartIfOk, init } from '../action'
import { Info, Restart, CreateNewChessboard, Chessboards, Chessboard } from '../components'

interface ITicTacToeProps {
  onRestart: () => (dispatch: (action: any) => void, getState: () => any) => void,
  init: () => (dispatch: (action: any) => void) => void,
  log: string,
  player: string,
  level: number | undefined,
}

export class TTicTacToe extends React.Component<ITicTacToeProps> {
  componentDidMount() {
    this.props.init()
  }
  render() {
    return (
      <div>
        <h1>TicTacToe</h1>
        <Info player={this.props.player} level={this.props.level} log={this.props.log} />
        <Restart onClick={this.props.onRestart} />
        <div id="Players">
          <CreateNewChessboard />
          <Chessboards />
        </div>
        <Chessboard player={this.props.player}/>
      </div>
    )
  }
}

const mapStateToProps = (state: mstate) => {
  return {
    log: state.log,
    player: state.player,
    level: state.level,
  }
}
const mapDispatchToProps = (dispatch: (action: any) => void) => bindActionCreators({
    onRestart: restartIfOk,
    init: init,
}, dispatch)

const App = connect(mapStateToProps, mapDispatchToProps)(TTicTacToe)
export default App