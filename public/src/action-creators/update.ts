import { stringify } from './change-chessboard'
export const REQUEST_UPDATE = 'REQUEST_UPDATE'
export const ERROR_UPDATE = 'ERROR_UPDATE'
export const RECEIVE_UPDATE = 'RECEIVE_UPDATE'


function requestUpdate() {
  return { type: REQUEST_UPDATE }
}

function receiveUpdate(body: resbody) {
  return { 
    type: RECEIVE_UPDATE,
    payload: {
      log: body.log,
      chessboard: body.chessboard,
      allChessboards: body.allChessboards,
      player1: body.player1,
      player2: body.player2,
      isPlayer1ready: body.isPlayer1ready,
      isPlayer2ready: body.isPlayer2ready,
      viewers: body.viewers,
      chessboardName: body.chessboardName
    }
  }
}

function errorUpdate() {
  return { type: ERROR_UPDATE }
}
function update() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestUpdate())
    const url = '/api/update'
    const message = stringify({
      chessboardName: getState().chessboardName,
      user: getState().user
    })
    fetch(url + '?' + message)
      .then(res => res.json())
      .then((body: resbody) => {
        if (body.code === 200)  {
          console.log(body)
          dispatch(receiveUpdate(body))
        } else  {
          console.log('error')
          dispatch(errorUpdate())
        }
      })
      .catch(err => {
        console.log(err)
        dispatch(errorUpdate())
      })
  }
}

export function updateIfOk() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().isfetching.update) {
      dispatch(update())
    }
  }
}