import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { bindActionCreators } from  'redux'
import { connect } from 'react-redux'
import { placePieceIfOk } from '../action'

interface IPieceOwnProps {
  id: number,
}

interface IPieceProps extends IPieceOwnProps {
  side: string,
  onPlace: (value: number) => (dispatch: (action: any) => void, getState?: () => any)=> void
}

class TPiece extends React.Component<IPieceProps> {
  onPlace = () => {
    this.props.onPlace(this.props.id + 1)
  }
  render() {
    return (
    <td className={this.props.side} onClick={ this.onPlace }>
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