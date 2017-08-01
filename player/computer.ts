import { Chessboard } from '../chessboard'
import { Player } from './player'

export class ComputerPlayer extends Player {
  public level: number
  public init() {
    this.state = false
    this.level = 2
  }
  public setLevel(s: number) {
    if (s < 0 || s > 10) {
      return false
    }
    this.level = s
    return true
  }
  public randomPlace() {
    if (this.state) {
      while (!this.chessboard.placePiece(Math.floor(Math.random() * 9), this.side)) {
        // while
      }
      this.changeState()
    }
  }
  public intelligencePlace(level: number) {
    if (this.state) {
      const [ bestplace, fineplace ] = this.chessboard.outputProbability(this.side, level - 1)
      let finalPlace: number[]
      if (bestplace.length > 0) {
        finalPlace = bestplace
      } else {
        finalPlace = fineplace
      }
      const mfinalPlace = finalPlace.map(p => p + 1)
      // console.log('方法1会在' + mfinalPlace + '下棋')
      const i = Math.floor(Math.random() * finalPlace.length)
      this.chessboard.placePiece(finalPlace[i], this.side)
      this.changeState()
    }
  }
  public placeAccordingToLevel() {
    if (this.level === 0) {
        this.randomPlace()
    } else if (this.level === 1) {
      // console.log('原先的')
      let places: number[] = []
      let v: number[] = []
      let begin = new Date().getTime()
      this.chessboard.counter = 0
      ; [ places, , v ] = this.chessboard.findTheBestPlace1(this.side, this.side, 0)
      let end = new Date().getTime()
      // console.log('time = ' + (end - begin))
      // console.log('count =' + this.chessboard.counter)
      const mplaces = places.map(p => p + 1)
      // console.log(mplaces)
      // console.log(v)
      // console.log('改进后的')
      begin = new Date().getTime()
      this.chessboard.counter = 0
      ; [ places, , v ] = this.chessboard.findTheBestPlace(this.side, this.side, 0, -100, 100)
      end = new Date().getTime()
      // console.log('time = ' + (end - begin))
      // console.log('count=' + this.chessboard.counter)
      // console.log(mplaces)
      // console.log(v)
      const i = Math.floor(Math.random() * places.length)
      this.chessboard.placePiece(places[i], this.side)
      this.changeState()
    } else {
      const begin: number  = new Date().getTime()
      this.chessboard.counter = 0
      this.intelligencePlace(this.level)
      const end: number  = new Date().getTime()
      // console.log('time = ' + (end - begin))
      // console.log('count =' + this.chessboard.counter)
    }
  }
}
