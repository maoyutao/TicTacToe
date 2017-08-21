export const REQUEST_PLACE_PIECE = 'REQUEST_PLACE_PIECE'
export const REQUEST_CHANGE_CHESSBOARD = 'REQUEST_CHANGE_CHESSBOARD'
export const REQUEST_RESTART = 'REQUEST_RESTART'
export const RECEIVE_PLACE_PIECE = 'RECEIVE_PLACE_PIECE'
export const RECEIVE_CHANGE_CHESSBOARD = 'RECEIVE_CHANGE_CHESSBOARD'
export const RECEIVE_RESTART = 'RECEIVE_RESTART'
export const ERROR_PLACE_PIECE = 'ERROR_PLACE_PIECE'
export const ERROR_CHANGE_CHESSBOARD = 'ERROR_CHANGE_CHESSBOARD'
export const ERROR_RESTART = 'ERROR_RESTART'

function stringify(obj: {[index: string]: string}, sep?: string, eq?: string) {
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

function requestPlacePiece() {
  return {
    type: REQUEST_PLACE_PIECE,
  }
}

function receivePlacePiece(body: resbody) {
  return {
    type: RECEIVE_PLACE_PIECE,
    payload: {
      log: body.log,
      chessboard: body.chessboard,
    }
  }
}

function errorPlacePiece() {
  return {
    type: ERROR_PLACE_PIECE,
  }
}

function placePiece(place: number) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    dispatch(requestPlacePiece())
    const url = '/api/placepiece'
    const mplayer = getState().player
    const reqbody = {
      player: mplayer,
      place: place
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
          dispatch(receivePlacePiece(body))
        } else  {
          console.log('error')
          dispatch(errorPlacePiece())
        }
      })
      .catch(e => {
        console.error(e)
        dispatch(errorPlacePiece())
      })
  }
}

export function placePieceIfOk(place: number) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().placePiece.isfetching) {
      dispatch(placePiece(place))
    }
  }
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

function changeChessboard(player: string, level?: number, side?: string) {
  return (dispatch: (action: any) => void) => {
    dispatch(requestChangeChessboard())
    const url = '/api/status'
    let message = ''
    if ((level !== undefined) && side) {
      message = stringify({
        player: player,
        level: level.toString(),
        side: side
      })
    } else {
      message = stringify({
        player: player,
      })
    }
    console.log(message)
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

export function changeChessboardIfOk(player: string, level?: number, side?: string) {
  return (dispatch: (action: any) => void, getState: () => any) => {
    if (!getState().changeChessboard.isfetching) {
      dispatch(changeChessboard(player, level, side))
    }
  }
}

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
      player: getState().player,
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
    if (!getState().restart.isfetching) {
      dispatch(restart())
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
