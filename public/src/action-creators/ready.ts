export const REQUEST_READY = 'REQUEST_READY'
export const RECEIVE_READY = 'RECEIVE_READY'
export const ERROR_READY = 'ERROR_READY'

function requestReady() {
  return {
    type: REQUEST_READY,
  }
}

function receiveReady(body: resbody) {
  return {
    type: RECEIVE_READY,
    payload: {
      log: body.log,
      isPlayer1ready: body.isPlayer1ready,
      isPlayer2ready: body.isPlayer2ready,
    }
  }
}

function errorReady() {
  return {
    type: ERROR_READY,
  }
}

function ready() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestReady())
    const url = '/api/ready'
    const reqbody = {
      chessboard: getState().chessboardName,
      user: getState().user,
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(reqbody),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    })
      .then(res => res.json())
      .then((body: resbody) => {
        if (body.code === 200)  {
          dispatch(receiveReady(body))
        } else  {
          console.log('error')
          dispatch(errorReady())
        }
      })
      .catch(e => {
        console.error(e)
        dispatch(errorReady())
      })
  }
}

export function readyIfOk(place: number) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().isfetching.ready) {
      dispatch(ready())
    }
  }
}