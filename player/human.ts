import { Chessboard } from '../chessboard'
import { TChessman } from '../types'
import { Player } from './player'

export class HumanPlayer extends Player {
  public place(num: number): string {
    num--
    if (this.state) {
      if (num > 8 || num < 0) {
        return `${num}不代表棋格`
      }
      if (this.chessboard.placePiece(num, this.side)) {
        this.changeState()
        return `${this.side}方在${num + 1}号位置成功落子`
      } else {
        return `${num + 1}号位置不可落子`
      }
    } else {
      return '您现在不能下棋'
    }
  }
}
