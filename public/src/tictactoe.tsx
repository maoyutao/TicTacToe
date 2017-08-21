import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'
import App from './containers/app'
import { reducer } from './reducer'
import { store } from './store'

if (process.env.NODE_ENV !== 'production') {
  const render = (Component: any) => {
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <Component />
        </Provider>
      </AppContainer>,
      document.getElementById('TicTacToe'),
    )
  }

  render(App)

  if (module.hot) {
    module.hot.accept('./containers/app', () => {
      const NewApp = require('./containers/app').default
      render(NewApp)
    })
  }
} else {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('TicTacToe'),
  )
}