interface resbody {
  code: number
  log: string
  chessboard: string[]
  allplayers: {[index: string]: object}
  player: string
  level?: number
}
interface mstate {
  log: string
  chessboard: string[]
  allplayers: {[index: string]: object}
  player: string
  level?: number
  placePiece: { isfetching: boolean }
  changeChessboard: { isfetching: boolean }
  restart: { isfetching: boolean }
}

interface NodeModule {
  hot: any
}
