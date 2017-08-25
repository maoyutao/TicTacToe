import { Chessboard } from '../chessboard'
import { TChessman } from '../types'

export class Player {

  public state: boolean = false

  constructor(public side: TChessman, public chessboard: Chessboard) { }

  public getChessboard() {
    return this.chessboard
  }

  public changeChessboard(chessboard: Chessboard) {
    this.chessboard = chessboard
  }

  public changeside(side: TChessman) {
    this.side = side
  }

  public init() {
    this.state = false
  }
  public changeState() {
    console.log(this.side, 'change')
    this.state = !this.state
  }
}
