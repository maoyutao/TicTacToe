import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface ILog {
  log: string
}
export class Log extends React.Component<ILog> {
  render() {
    return (
      <div>
        <p>log:</p>
        <p dangerouslySetInnerHTML={{__html:this.props.log}}></p>
      </div>
    )
  }
}