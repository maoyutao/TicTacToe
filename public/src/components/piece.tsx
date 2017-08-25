import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { placePieceIfOk } from '../action-creators'

interface IPieceOwnProps {
  id: number,
  change: number,
}

interface IPieceOwnState {
  strokeDashoffset: number
  displaySide: string
}

interface IPieceProps extends IPieceOwnProps {
  side: string,
  onPlace: (value: number) => (dispatch: (action: any) => void, getState?: () => any)=> void
}

class TPiece extends React.Component<IPieceProps, IPieceOwnState> {
  constructor(props: any) {
    super(props)
    this.state = {
      strokeDashoffset: 0,
      displaySide: this.props.side
    }
  }
  onPlace = () => {
    this.props.onPlace(this.props.id + 1)
  }
  componentWillReceiveProps(nextProps: IPieceProps) {
    const nextlen = nextProps.side === 'x' ? 135.764 : 301.635
    const thislen = this.props.side === 'x' ? 135.764 : 301.635
    if (this.props.change !== nextProps.change) {
      this.setState({
        strokeDashoffset: thislen
      })
      setTimeout(()=>{
        this.setState({ 
          strokeDashoffset: nextlen,
          displaySide: nextProps.side,
        })
      }, 500)
      setTimeout(() => {
        this.setState({ strokeDashoffset: 0 })
      }, 600)
    } else if (this.props.side !== nextProps.side) {
      this.setState({
        strokeDashoffset: nextlen,
        displaySide: nextProps.side,
      })
      setTimeout(()=>{
        this.setState({ strokeDashoffset: 0 })
      }, 1)
    }
  }
  render() {
    return (
      <td onClick={ this.onPlace }>
        <svg className="x" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 128 128" visibility="visible" display={this.state.displaySide==="x"?"block":"none"}>
          <path d="M16,16L112,112"
          style = {{ stroke:"rgb(84, 84, 84)", strokeWidth:"15", strokeDasharray: "135.764", strokeDashoffset:this.state.strokeDashoffset }} />
          <path d="M112,16L16,112"
          style = {{ stroke:"rgb(84, 84, 84)", strokeWidth:"15", strokeDasharray: "135.764", strokeDashoffset:this.state.strokeDashoffset }} />
        </svg>
        <svg className="o" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 128 128" visibility="visible" display={this.state.displaySide==="o"?"block":"none"}>
          <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"
          style={{ fill:"none", stroke:"rgb(242, 235, 211)", strokeWidth:"15px", strokeDasharray: "301.635", strokeDashoffset:this.state.strokeDashoffset }}></path>
        </svg>
      </td>
    )
  }
}

const mapStateToProps = (state: mstate, ownprops: IPieceOwnProps) => {
  return {
    side: state.chessboard[ownprops.id]
  }
}
const mapDispatchToProps = (dispatch: (action: any) => void) => bindActionCreators({
  onPlace: placePieceIfOk,
}, dispatch)

export const Piece = connect(mapStateToProps, mapDispatchToProps)(TPiece)