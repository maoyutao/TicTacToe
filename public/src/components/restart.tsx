import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface IRestart {
  onClick: () => void
}
export const Restart: React.StatelessComponent<IRestart> = (props) => {
  return <button id="restart" onClick={props.onClick}>restart</button>
}
