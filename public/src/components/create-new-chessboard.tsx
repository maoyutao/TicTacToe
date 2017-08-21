import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { changeChessboardIfOk } from '../action'

interface ICreateNewChessboardProps {
  onChangeChessboard: (player: string, level: number, side: string) => (dispatch: (action: any) => void, getState: () => any) => void,
}
interface ICreateNewChessboardState {
  player: string,
  level: number,
  side: string,
}
class TCreateNewChessboard extends React.Component<ICreateNewChessboardProps, ICreateNewChessboardState> {
  constructor(props: ICreateNewChessboardProps) {
    super(props)
    this.state = {
      player: '',
      level: 0,
      side: 'o'
    }
  }
  onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({[event.target.id]: (event.target.value as any)} as ICreateNewChessboardState)
  }
  onSubmit = () => {
    // console.log('state:',this.state)
    this.props.onChangeChessboard(this.state.player, this.state.level, this.state.side)
  }
  render() {
    return (
    <div id="CreateNewChessboard">
      <p>进入棋盘:</p>
    player:<input type="text" value={this.state.player} id="player" onChange={this.onChange} />*<br />
    level:<select name="level" value={this.state.level} id="level" onChange={this.onChange}>
      <option value={0}>0</option>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      </select><br/>
    side:<select value={this.state.side} id="side" onChange={this.onChange}>
      <option value="o">o</option>
      <option value="x">x</option>
      </select>
      <input type="submit" name="getnewchessboard" id="getnewchessboard" onClick={this.onSubmit}/>
    </div>
    )
  }
}

const mapDispatchToProp = (dispatch: (action: any) => void) => bindActionCreators({
  onChangeChessboard: changeChessboardIfOk,
}, dispatch)

export const CreateNewChessboard = connect(undefined, mapDispatchToProp)(TCreateNewChessboard)