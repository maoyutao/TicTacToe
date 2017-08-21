import { combineReducers } from 'redux'
import {
  REQUEST_PLACE_PIECE,
  REQUEST_CHANGE_CHESSBOARD,
  REQUEST_RESTART,
  RECEIVE_PLACE_PIECE, RECEIVE_CHANGE_CHESSBOARD, RECEIVE_RESTART,
} from './action'

function request(state: mstate, action: any) {
  switch (action.type) {
    case REQUEST_PLACE_PIECE:
      return {
        ...state,
        placePiece: { isfetching: true}
      }
    case REQUEST_CHANGE_CHESSBOARD:
      return {
        ...state,
        changeChessboard: { isfetching: true}
      }
    case REQUEST_RESTART:
      return {
        ...state,
        restart: { isfetching: true}
      }
  }
  return state
}

function receive(state: mstate, action: any) {
  switch (action.type) {
    case RECEIVE_PLACE_PIECE:
      return {
        ...state,
        placePiece: { isfetching: false}
      }
    case RECEIVE_CHANGE_CHESSBOARD:
      console.log('RECEIVE_CHANGE_CHESSBOARD')
      return {
        ...state,
        changeChessboard: { isfetching: false}
      }
    case RECEIVE_RESTART:
      return {
        ...state,
        restart: { isfetching: false}
      }
  }
  return state
}

function chessboardData(state: mstate, action: any) {
  switch (action.type) {
    case RECEIVE_PLACE_PIECE:
    case RECEIVE_CHANGE_CHESSBOARD:
    case RECEIVE_RESTART:
      return {
        ...state,
        ...action.payload 
      }
  }
  
  return state
}

export function reducer(state: mstate, action: any) {
  let newState = request(state, action)
  newState = receive(newState, action)
  return chessboardData(newState, action)
}