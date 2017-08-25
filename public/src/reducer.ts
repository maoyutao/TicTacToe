import { combineReducers } from 'redux'
import {
  REQUEST_PLACE_PIECE,
  REQUEST_CHANGE_CHESSBOARD,
  REQUEST_RESTART,
  REQUEST_LEAVE,
  REQUEST_READY,
  REQUEST_UPDATE,
  RECEIVE_PLACE_PIECE,
  RECEIVE_CHANGE_CHESSBOARD,
  RECEIVE_RESTART,
  RECEIVE_READY,
  RECEIVE_LEAVE,
  RECEIVE_UPDATE,
  ERROR_CHANGE_CHESSBOARD,
  ERROR_LEAVE,
  ERROR_PLACE_PIECE,
  ERROR_READY,
  ERROR_RESTART,
  ERROR_UPDATE,
  SUBMIT_USER_NAME,
} from './action-creators'

function request(state: mstate, action: any) {
  switch (action.type) {
    case REQUEST_PLACE_PIECE:
      return {
        ...state,
        isfetching: { ...state.isfetching, placePiece: true}
      }
    case REQUEST_CHANGE_CHESSBOARD:
      return {
        ...state,
        isfetching: { ...state.isfetching, changeChessboard: true}
      }
    case REQUEST_RESTART:
      return {
        ...state,
        isfetching: { ...state.isfetching, restart: true}
      }
    case REQUEST_READY:
      return {
        ...state,
        isfetching: { ...state.isfetching, ready: true}
      }
    case REQUEST_LEAVE:
      return {
        ...state,
        isfetching: { ...state.isfetching, leave: true}
      }
    case REQUEST_UPDATE:
      return {
        ...state,
        isfetching: { ...state.isfetching, update: true}
      }
  }
  return state
}

function receive(state: mstate, action: any) {
  switch (action.type) {
    case RECEIVE_PLACE_PIECE:
    case ERROR_PLACE_PIECE:
      return {
        ...state,
        isfetching: { ...state.isfetching, placePiece: false}
      }
    case RECEIVE_CHANGE_CHESSBOARD:
    case ERROR_CHANGE_CHESSBOARD:
      return {
        ...state,
        isfetching: { ...state.isfetching, changeChessboard: false}
      }
    case RECEIVE_RESTART:
    case ERROR_RESTART:
      return {
        ...state,
        isfetching: { ...state.isfetching, restart: false}
      }
    case RECEIVE_READY:
    case ERROR_READY:
      return {
        ...state,
        isfetching: { ...state.isfetching, ready: false}
      }
    case RECEIVE_LEAVE:
    case ERROR_LEAVE:
      return {
        ...state,
        isfetching: { ...state.isfetching, leave: false}
      }
    case RECEIVE_UPDATE:
    case ERROR_UPDATE:
      return {
        ...state,
        isfetching: { ...state.isfetching, update: false}
      }
  }
  return state
}

function chessboardData(state: mstate, action: any) {
  switch (action.type) {
    case RECEIVE_PLACE_PIECE:
    case RECEIVE_CHANGE_CHESSBOARD:
    case RECEIVE_RESTART:
    case RECEIVE_LEAVE:
    case RECEIVE_READY:
    case RECEIVE_UPDATE:
    case SUBMIT_USER_NAME:
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