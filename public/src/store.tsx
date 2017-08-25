import { createStore, applyMiddleware, compose, Store } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { reducer } from './reducer'

declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  store: Store<mstate>
}

declare var window: Window

const composeEnhancers = (
    (process.env.NODE_ENV !== 'production' || location.hash === '#debug') &&
    window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose

const initalState: mstate = {
  chessboardName: '',
  log: '',
  chessboard: [],
  allChessboards: [],
  user: '',
  player1: '',
  player2: '',
  viewers: [],
  isPlayer1ready: false,
  isPlayer2ready: false,
  isfetching: {
    placePiece: false,
    changeChessboard: false,
    restart: false,
    ready: false,
    leave: false,
    update: false,
  }
}

export const store = createStore<mstate>(reducer, initalState, composeEnhancers(applyMiddleware(thunkMiddleware)))