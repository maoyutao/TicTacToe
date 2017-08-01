import { Chessboard } from '../chessboard'
import { Player } from './player'

export class ComputerPlayer extends Player {
  public level: number
  public init() {
    this.state = false
    this.level = 2
  }
  public setLevel(s: number) {
    if (!s) {
      return false
    }
    if (s < 1 || s > 10) {
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
      console.log('方法1会在' + mfinalPlace + '下棋')
      const i = Math.floor(Math.random() * finalPlace.length)
      this.chessboard.placePiece(finalPlace[i], this.side)
      // this.changeState()
    }
  }
  public placeAccordingToLevel() {
    if (this.level <= 1) {
      // this.randomPlace()
      let places: number[] = []
      let v: number[] = []
      this.chessboard.counter = 0
      ; [ places, , v ] = this.chessboard.findTheBestPlace(this.side, this.side, 0, -100, 100)
      console.log('count =' + this.chessboard.counter)
      const i = Math.floor(Math.random() * places.length)
      this.chessboard.placePiece(places[i], this.side)
      this.changeState()
    } else {
      const begin: number  = new Date().getTime()
      this.chessboard.counter = 0
      this.intelligencePlace(this.level)
      console.log('count =' + this.chessboard.counter)
      /*
      let end: number  = new Date().getTime()
      console.log('time = ' + (end - begin))
      console.log('count =' + this.chessboard.counter)
      console.log('原先的')
      let places1: number[] = []
      let v1: number[] = []
      begin = new Date().getTime()
      this.chessboard.counter = 0
      ; [ places1, , v1 ] = this.chessboard.findTheBestPlace1(this.side, this.side, 0)
      end = new Date().getTime()
      console.log('time = ' + (end - begin))
      console.log('count =' + this.chessboard.counter)
      const mplaces1 = places1.map(p => p + 1)
      console.log(mplaces1)
      console.log(v1)
      console.log('改进后的')
      let places: number[] = []
      let v: number[] = []
      begin = new Date().getTime()
      this.chessboard.counter = 0
      ; [ places, , v ] = this.chessboard.findTheBestPlace(this.side, this.side, 0, -100, 100)
      end = new Date().getTime()
      console.log('time = ' + (end - begin))
      console.log('count=' + this.chessboard.counter)
      const mplaces = places.map(p => p + 1)
      console.log(mplaces)
      console.log(v)
      const i = Math.floor(Math.random() * places.length)
      this.chessboard.placePiece(places[i], this.side)*/
      this.changeState()
    }
  }
}
