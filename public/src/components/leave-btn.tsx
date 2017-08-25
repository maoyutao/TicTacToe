import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ILeave {
  onClick: () => void
}
export const Leave: React.StatelessComponent<ILeave> = (props) => {
  return <button id="leave" onClick={props.onClick}>leave</button>
}
