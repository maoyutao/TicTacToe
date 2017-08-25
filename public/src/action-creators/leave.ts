export const REQUEST_LEAVE = 'REQUEST_LEAVE'
export const RECEIVE_LEAVE = 'RECEIVE_LEAVE'
export const ERROR_LEAVE = 'ERROR_LEAVE'

function requestLeave() {
  return {
    type: REQUEST_LEAVE,
  }
}

function receiveLeave(body: resbody) {
  return {
    type: RECEIVE_LEAVE,
    payload: {
      log: body.log,
      chessboard: body.chessboard,
    }
  }
}

function errorLeave() {
  return {
    type: ERROR_LEAVE,
  }
}

function ready() {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestLeave())
    const url = '/api/ready'
    const reqbody = {
      chessboard: getState().chessboard,
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
          dispatch(receiveLeave(body))
        } else  {
          console.log('error')
          dispatch(errorLeave())
        }
      })
      .catch(e => {
        console.error(e)
        dispatch(errorLeave())
      })
  }
}

export function leaveIfOk(place: number) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().isfetching.leave) {
      dispatch(ready())
    }
  }
}