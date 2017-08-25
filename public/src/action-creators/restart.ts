import { stringify } from './change-chessboard'
export const REQUEST_RESTART = 'REQUEST_RESTART'
export const ERROR_RESTART = 'ERROR_RESTART'
export const RECEIVE_RESTART = 'RECEIVE_RESTART'


function requestRestart() {
  return { type: REQUEST_RESTART }
}

function receiveRestart(body: resbody) {
  return { 
    type: RECEIVE_RESTART,
    payload: {
      log: body.log,
      chessboard: body.chessboard,
    }
  }
}

function errorRestart() {
  return { type: ERROR_RESTART }
}
function restart() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestRestart())
    const url = '/api/restart'
    const message = stringify({
      chessboard: getState().chessboard,
    })
    fetch(url + '?' + message)
      .then(res => res.json())
      .then((body: resbody) => {
        if (body.code === 200)  {
          dispatch(receiveRestart(body))
        } else  {
          console.log('error')
          dispatch(errorRestart())
        }
      })
      .catch(err => {
        console.log(err)
        dispatch(errorRestart())
      })
  }
}

export function restartIfOk() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().isfetching.restart) {
      dispatch(restart())
    }
  }
}