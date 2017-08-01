import { Chessboard } from '../chessboard'
import { TChessman } from '../types'

export class Player {

  public state: boolean = false

  constructor(public side: TChessman, public chessboard: Chessboard) { }

  public init() {
    this.state = false
  }
  public changeState() {
    this.state = !this.state
  }
}
