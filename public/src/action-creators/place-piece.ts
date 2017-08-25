export const REQUEST_PLACE_PIECE = 'REQUEST_PLACE_PIECE'
export const RECEIVE_PLACE_PIECE = 'RECEIVE_PLACE_PIECE'
export const ERROR_PLACE_PIECE = 'ERROR_PLACE_PIECE'

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
    const reqbody = {
      chessboard: getState().chessboardName,
      user: getState().user,
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
    if (!getState().isfetching.placePiece) {
      dispatch(placePiece(place))
    }
  }
}
