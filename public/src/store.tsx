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
  log: '',
  chessboard: [],
  allplayers: {},
  player: '',
  placePiece: { isfetching: false },
  changeChessboard: { isfetching: false },
  restart: { isfetching: false },
}

export const store = createStore<mstate>(reducer, initalState, composeEnhancers(applyMiddleware(thunkMiddleware)))