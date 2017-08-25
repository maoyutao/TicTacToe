import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { changeChessboardIfOk, submitUserName } from '../action-creators'

interface ICreateNewChessboardProps {
  onChangeChessboard: (chessboard: string, role: string, opponent: number, side: string) => (dispatch: (action: any) => void, getState: () => any) => void,
  onUserSubmit: (username: string) => any,
}
interface ICreateNewChessboardState {
  chessboardName: string,
  opponent: number,
  side: string,
  role: string,
  userName: string,
  on: boolean,
}
class TCreateNewChessboard extends React.Component<ICreateNewChessboardProps, ICreateNewChessboardState> {
  constructor(props: ICreateNewChessboardProps) {
    super(props)
    this.state = {
      chessboardName: '',
      opponent: 0,
      side: 'o',
      role: 'competitor',
      userName: '',
      on: false,
    }
  }
  onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    this.setState({[event.target.id]: (event.target.value as any)} as ICreateNewChessboardState)
  }
  onSubmit = () => {
    // console.log('state:',this.state)
    this.props.onChangeChessboard(this.state.chessboardName, this.state.role, this.state.opponent, this.state.side)
  }
  onUserSubmit = () => {
    this.setState({
      on: true
    })
    this.props.onUserSubmit(this.state.userName)
  }
  onUserLogOut = () => {
    this.setState({
      on: false,
      userName: '',
    })
    this.props.onUserSubmit('')
  }
  render() {
    return (
    <div id="CreateNewChessboard">
      <p>your name</p>
      <input type="text" id="userName" value={this.state.userName} onChange={this.onChange}
        readOnly={this.state.on} /><span style={{visibility: this.state.on ? "visible" : "hidden"}}>  OK</span><br />
      <input type="submit" name="onUserSubmit" id="UserSubmit" onClick={this.onUserSubmit} value="登录"/>
      <input type="submit" name="onUserLogOut" id="onUserLogOut" onClick={this.onUserLogOut} value="退出"/>
      <p>进入棋盘:</p>
      chessboard:<input type="text" id="chessboardName" value={this.state.chessboardName} onChange={this.onChange} />*<br />
      role:<select name="role" value={this.state.role} id="role" onChange={this.onChange}>
            <option value="competitor">competitor</option>
            <option value="viewer">viewer</option>
          </select>
      <div style={{display: this.state.role === 'competitor' ? "block" : "none"}}>
        opponent:<select name="opponent" value={this.state.opponent} id="opponent" onChange={this.onChange}>
          <option value={0}>0级AI</option>
          <option value={1}>1级AI</option>
          <option value={2}>2级AI</option>
          <option value={3}>3级AI</option>
          <option value={-1}>与其他玩家对战</option>
          </select><br/>
        side:<select value={this.state.side} id="side" onChange={this.onChange}>
          <option value="o">o</option>
          <option value="x">x</option>
          </select>
      </div>
      <input type="submit" name="getnewchessboard" id="getnewchessboard" onClick={this.onSubmit}/>
    </div>
    )
  }
}

const mapDispatchToProp = (dispatch: (action: any) => void) => bindActionCreators({
  onChangeChessboard: changeChessboardIfOk,
  onUserSubmit: submitUserName,
}, dispatch)

export const CreateNewChessboard = connect(undefined, mapDispatchToProp)(TCreateNewChessboard)