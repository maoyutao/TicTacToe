import { Chessboard } from '../chessboard'
import { TChessman } from '../types'
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
      const [ bestplace, fineplace ] = this.chessboard.outputProbability(this.side, level)
      let i: number
      let finalPlace: number
      if (bestplace.length > 0) {
        i = Math.floor(Math.random() * bestplace.length)
        finalPlace = bestplace[i]
      } else {
        i = Math.floor(Math.random() * fineplace.length)
        finalPlace = fineplace[i]
      }
      this.chessboard.placePiece(finalPlace, this.side)
      this.changeState()
    }
  }
  public placeAccordingToLevel() {
    if (this.level <= 1) {
      this.randomPlace()
    } else {
      // this.intelligencePlace(this.level)
      let places:number[] = []
      let v:number[] = [] 
      ;[ places,,v ]= this.chessboard.findTheBestPlace(this.side, this.side, 0)
      places.forEach((value) => {
        console.log(++value)
      });
      console.log(v)
      const i = Math.floor(Math.random() * places.length)
      this.chessboard.placePiece(places[i], this.side)
    }
  }
}
