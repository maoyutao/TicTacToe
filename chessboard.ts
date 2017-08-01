import { TChessman } from './types'

export class Chessboard {


  constructor() {
    this.init()
  }

  public outputChessboard() {
    console.log('当前棋盘如下：')
    console.log(`-------------
| ${this.chesspieces[0]} | ${this.chesspieces[1]} | ${this.chesspieces[2]} |
-------------
| ${this.chesspieces[3]} | ${this.chesspieces[4]} | ${this.chesspieces[5]} |
-------------
| ${this.chesspieces[6]} | ${this.chesspieces[7]} | ${this.chesspieces[8]} |
-------------`)
  }

  public placePiece(num: number, side: string): boolean {
    if (this.chesspieces[num] === ' ') {
      this.chesspieces[num] = side
      return true
    } else {
      return false
    }
  }

  public isOver(): [boolean, string] {
    if (this.isWin('o')) {
      this.init()
      return [ true, '游戏结束，o方胜利' ]
    } else if (this.isWin('x')) {
      this.init()
      return [ true, '游戏结束，x方胜利' ]
    } else if (this.isFull()) {
      this.init()
      return [ true, '游戏结束，平局' ]
    } else {
      return [ false, '游戏继续' ]
    }
  }

  public outputProbability(side: string, level: number): [number[], number[]] {
    const bestplace: number[] = []
    const fineplace: number[] = []
    let maxprobability: number = 0
    let maxdrawprobability: number = 0
    let numberOfBestplace: number = 0
    let numberOfFineplace: number = 0
    const win: number[] = []
    const draw: number[] = []
    let lose: number
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== ' ') {
        continue
      }
      [win[i], lose, draw[i]] = this.getProbabilityAccordingToLevel(level, i, side )
      console.log(
        `${side}在${i + 1}号位置下棋的胜率为${win[i]},败率为${lose}，平局的概率为${draw[i]}`)
      if (win[i] > maxprobability) {
        maxprobability = win[i]
      }
      if (draw[i] > maxdrawprobability) {
        maxdrawprobability = draw[i]
      }
    }
    for (let i = 0; i <= 8; i++) {
      if (maxprobability > 0) {
        if (win[i] === maxprobability) {
          bestplace[numberOfBestplace++] = i
        }
      }
      if (draw[i] === maxdrawprobability) {
        fineplace[numberOfFineplace++] = i
      }
    }
    const places = bestplace.join()
    console.log(
      `${side}在${places}位置下棋胜率最大，胜率为${maxprobability}`)
    return [ bestplace, fineplace ]
  }

    const place:number[] = []
    let value: number | undefined
    const v: number[] = []
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== ' ') {
        continue
      }    
      this.placePiece(i, mside)
      if (this.isWin(side)) {
        v[i] = 10 - step
        this.chesspieces[i] = ' '
      } else if (this.isWin(this.getOpponent(side))) {
        v[i] = -10 + step
        this.chesspieces[i] = ' '
      } else if (this.isFull()) {
        v[i] = 0
        this.chesspieces[i] = ' '
      } else {
      }
      if (side === mside) {
        if ((value === undefined) || v[i] >= value) {
          value = v[i]
        }
        if ((value === undefined) || v[i] <= value) {
          value = v[i]
        }
      }
    }
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== ' ') {
        continue
      }
      if(v[i] === value)  {
        place.push(i)
      }
    }
    return [ place, value as number, v ]
  }

  private init() {
    for (let i = 0; i <= 8; i++) {
      this.chesspieces[i] = TChessman[2]
    }
  }

  private isFull(): boolean {
    let i: number = 1
    for (i = 0; i <= 8; i++) {
      if (this.chesspieces[i] === ' ') {
        break
      }
    }
    if (i === 9) {
      return true
    }else {
      return false
    }
  }

  private isWin(side: string): boolean {
    for (let i = 0; i <= 2; i += 1) {
      if ((this.chesspieces[0 + i * 3] === side
            && this.chesspieces[1 + i * 3] === side && this.chesspieces[2 + i * 3] === side)
          || (this.chesspieces[0 + i] === side && this.chesspieces[3 + i] === side
            && this.chesspieces[6 + i] === side)) {
        return true
      }
    }
    if ((this.chesspieces[0] === side && this.chesspieces[4] === side && this.chesspieces[8] === side) ||
      (this.chesspieces[2] === side && this.chesspieces[4] === side && this.chesspieces[6] === side)) {
      return true
    } else {
      return false
    }
  }

  private getOpponent(now: string): string {
    return (now === 'o') ? 'x' : 'o'
  }

  private getRemainingPieceOfPossiblePlace(possiblePlace: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]): number {
    let result: number = 0
    for (const t of possiblePlace) {
      if (this.chesspieces[possiblePlace[t]] === ' ') {
        result++
      }
    }
    return result
  }

  // 计算side走在place处的输赢概率
  private getProbability([ win, lose, draw ]: number[], place: number, mside: string,
                         probability: number, side: string, level: number): number[] {
    // 在place假装走棋
    this.placePiece(place, mside)
    if (this.isWin(side)) {
      // 结束了，是赢的
      this.chesspieces[place] = ' '
      // 收回'+place+'的棋子
      return [ win + probability, lose, draw ]
    } else if (this.isWin(this.getOpponent(side))) {
      // 结束了，是输的
      this.chesspieces[place] = ' '
      // 收回'+place+'的棋子
      return [ win, lose + probability, draw ]
    } else if (this.isFull()) {
      // 结束了，平局
      this.chesspieces[place] = ' '
      //  收回'+place+'的棋子
      return [ win, lose, draw + probability ]
    } else {
      let possiblePlace: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]
      if (mside === side) {
        if (level > 1) {
          possiblePlace = this.findbestplace(this.getOpponent(mside), level - 1)[0]
        }
        probability *= (1 / this.getRemainingPieceOfPossiblePlace(possiblePlace))
      } else {
        probability *= (1 / this.getRemainingPieceOfPossiblePlace())
      }
      // 没结束getOpponent(mside)走棋
      if (mside === side) {
        for (const t of possiblePlace) {
          if (this.chesspieces[possiblePlace[t]] !== ' ') {
            continue
          }
          [ win, lose, draw ] = this.getProbability([ win, lose, draw ], possiblePlace[t],
                                                    this.getOpponent(mside), probability, side, level)
        }
      } else {
        for (let t = 0; t <= 8; t++) {
          if (this.chesspieces[t] !== ' ') {
            continue
          }
          [ win, lose, draw ] = this.getProbability([ win, lose, draw ], t,
                                                    this.getOpponent(mside), probability, side, level)
        }
      }
      this.chesspieces[place] = ' '
      // 收回place的棋子
      return [ win, lose, draw ]
    }
  }

  private getProbabilityAccordingToLevel(level: number, place: number, side: string) {
    return this.getProbability([ 0, 0, 0 ], place, side, 1, side, level)
  }

  private findbestplace(side: string, level: number): [number[], number, number] {
    const bestplace: number[] = []
    let maxprobability: number = 0
    const notloose: number[] = []
    let [win, lose, draw]: number[] = []
    let numberOfBestplace: number = 0
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== ' ') {
        continue
      }
      [ win, lose, draw ] = this.getProbabilityAccordingToLevel(level, i, side)
      notloose[i] = win + draw
      if (notloose[i] > maxprobability) {
        maxprobability = notloose[i]
      }
    }
    for (let i = 1; i <= 9; i++) {
      if (notloose[i] === maxprobability) {
        bestplace[++numberOfBestplace] = i
      }
    }
    return [ bestplace, maxprobability, numberOfBestplace ]
  }
}

