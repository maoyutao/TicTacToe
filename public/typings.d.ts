interface resbody {
  code: number
  chessboardName?: string
  log?: string
  chessboard?: string[]
  allChessboards?: string[]
  user?: string
  player1?: string
  player2?: string
  viewers?: string[]
  isPlayer1ready?: boolean
  isPlayer2ready?: boolean
}
interface mstate {
  chessboardName: string
  log: string
  chessboard: string[]
  allChessboards: string[]
  user: string
  player1: string
  player2: string
  isPlayer1ready: boolean
  isPlayer2ready: boolean
  viewers: string[]
  isfetching: {
    placePiece: boolean 
    changeChessboard: boolean 
    restart: boolean 
    ready: boolean
    leave: boolean
    update: boolean
  }
}

interface NodeModule {
  hot: any
}
