import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface IReady {
  onClick: () => void
}
export const Ready: React.StatelessComponent<IReady> = (props) => {
  return <button id="ready" onClick={props.onClick}>ready</button>
}