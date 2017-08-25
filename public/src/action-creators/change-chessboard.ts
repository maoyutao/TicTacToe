export const REQUEST_CHANGE_CHESSBOARD = 'REQUEST_CHANGE_CHESSBOARD'
export const RECEIVE_CHANGE_CHESSBOARD = 'RECEIVE_CHANGE_CHESSBOARD'
export const ERROR_CHANGE_CHESSBOARD = 'ERROR_CHANGE_CHESSBOARD'

export function stringify(obj: {[index: string]: string}, sep?: string, eq?: string) {
  sep = sep || '&'
  eq = eq || '='
  const tmp: string[] = []
  const res: string[] = []
  for(var item in obj) {
    tmp.push(item, obj[item])
    res.push(tmp.join(eq))
    tmp.length = 0
  }
  return res.join(sep)
}

function requestChangeChessboard() {
  return {
    type: REQUEST_CHANGE_CHESSBOARD,
  }
}

function receiveChangeChessboard(body: resbody) {
  return {
    type: RECEIVE_CHANGE_CHESSBOARD,
    payload: body,
  }
}

function errorChangeChessboard() {
  return {
    type: ERROR_CHANGE_CHESSBOARD,
  }
}

function changeChessboard(chessboard: string, role?: string, opponent?: number, side?: string) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestChangeChessboard())
    const url = '/api/status'
    let message = ''
    if ((opponent !== undefined) && side && role) {
      message = stringify({
        chessboard: chessboard,
        role: role,
        opponent: opponent.toString(),
        side: side,
        user: getState().user,
      })
    } else {
      message = stringify({
        chessboard: chessboard,
        user: getState().user,
      })
    }
    fetch(url + '?' + message)
      .then(res => res.json())
      .then((body: resbody) => {
        if (body.code === 200)  {
          dispatch(receiveChangeChessboard(body))
        } else  {
          console.log('error')
          dispatch(errorChangeChessboard())
        }
      })
      .catch(error => {
        console.log(error)
        dispatch(errorChangeChessboard())        
      })
  }
}

export function changeChessboardIfOk(chessboard: string, role?: string, opponent?: number, side?: string) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().isfetching.changeChessboard) {
      dispatch(changeChessboard(chessboard, role, opponent, side))
    }
  }
}

export function init() {
  return (dispatch: (action: any) => void) => {
    dispatch(requestChangeChessboard())
    fetch('/api/getChessboards')
      .then(res => res.json())
      .then((body: resbody) => {
        console.log(body)
        dispatch({
          type: RECEIVE_CHANGE_CHESSBOARD,
          payload: body,
        })
      })
      .catch(err => {
        console.log(err)
        dispatch(errorChangeChessboard)
      })
    }
}