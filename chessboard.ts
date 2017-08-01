import { TChessman } from './types'

export class Chessboard {

  public chesspieces: TChessman[] = []
  public counter: number = 0

  constructor() {
    this.init()
  }

  public outputChessboard() {
    console.log('当前棋盘如下：')
    const mchesspieces: string[] = []
    this.chesspieces.forEach((value, index) => {
      switch (value) {
        case TChessman.N:
          mchesspieces[index] = ' '
          break
        case TChessman.O:
          mchesspieces[index] = 'o'
          break
        case TChessman.X:
          mchesspieces[index] = 'x'
          break
      }
    })
    console.log(`-------------
| ${mchesspieces[0]} | ${mchesspieces[1]} | ${mchesspieces[2]} |
-------------
| ${mchesspieces[3]} | ${mchesspieces[4]} | ${mchesspieces[5]} |
-------------
| ${mchesspieces[6]} | ${mchesspieces[7]} | ${mchesspieces[8]} |
-------------`)
  }

  public placePiece(num: number, side: TChessman): boolean {
    if (this.chesspieces[num] === TChessman.N) {
      this.chesspieces[num] = side
      return true
    } else {
      return false
    }
  }

  public isOver(): [ boolean, string ] {
    if (this.isWin(TChessman.O)) {
      this.init()
      return [ true, '游戏结束，o方胜利' ]
    } else if (this.isWin(TChessman.X)) {
      this.init()
      return [ true, '游戏结束，x方胜利' ]
    } else if (this.isFull()) {
      this.init()
      return [ true, '游戏结束，平局' ]
    } else {
      return [ false, '游戏继续' ]
    }
  }

  public outputProbability(side: TChessman, level: number): [ number[], number[] ] {
    const bestplace: number[] = []
    const fineplace: number[] = []
    let maxprobability: number = 0
    let maxdrawprobability: number = 0
    const win: number[] = []
    const draw: number[] = []
    let lose: number
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== TChessman.N) {
        continue
      }
      [ win[i], lose, draw[i] ] = this.getProbability([ 0, 0, 0 ], i, side, 1, side, level)
      /* console.log(
        `${side}在${i + 1}号位置下棋的胜率为${win[i]},败率为${lose}，平局的概率为${draw[i]}`)*/
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
          bestplace.push(i)
        }
      }
      if (draw[i] === maxdrawprobability) {
        fineplace.push(i)
      }
    }
    const places = bestplace.map(p => p + 1).join()
    console.log(
      `${side}在${places}位置下棋胜率最大，胜率为${maxprobability}`)
    return [ bestplace, fineplace ]
  }

  public findTheBestPlace(mside: TChessman, side: TChessman, step: number,
                          min: number, max: number): [ number[], number, number[] ] {
    const place: number[] = []
    let value: number | undefined
    const v: number[] = []
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== TChessman.N) {
        continue
      }
      this.placePiece(i, mside)
      this.counter++
      if (this.isWin(side)) {
        v[i] = 10 - step
        this.chesspieces[i] = TChessman.N
        step--
      } else if (this.isWin(this.getOpponent(side))) {
        v[i] = -10 + step
        this.chesspieces[i] = TChessman.N
        step--
      } else if (this.isFull()) {
        v[i] = 0
        this.chesspieces[i] = TChessman.N
        step--
      } else {
        if (side === mside) {
          v[i] = this.findTheBestPlace(this.getOpponent(mside), side,
                                       ++step, value ? value : min, max)[1]
          this.chesspieces[i] = TChessman.N
          step--
        } else {
          v[i] = this.findTheBestPlace(this.getOpponent(mside), side,
                                       ++step, min, value ? value : max)[1]
          this.chesspieces[i] = TChessman.N
          step--
        }
      }
      if (side === mside) {
        if ((value === undefined) || v[i] >= value) {
          value = v[i]
        }
        if (v[i] > max) {
          return [ [i], v[i], v ]
        }
      } else  {
        if ((value === undefined) || v[i] <= value) {
          value = v[i]
        }
        if (v[i] < min) {
          return [ [i], v[i], v ]
        }
      }
    }
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== TChessman.N) {
        continue
      }
      if (v[i] === value)  {
        place.push(i)
      }
    }
    return [ place, value as number, v ]
  }

  public findTheBestPlace1(mside: TChessman, side: TChessman,
                           step: number): [ number[], number, number[] ] {
  const place: number[] = []
  let value: number | undefined
  const v: number[] = []
  for (let i = 0; i <= 8; i++) {
    if (this.chesspieces[i] !== TChessman.N) {
      continue
    }
    this.placePiece(i, mside)
    this.counter++
    if (this.isWin(side)) {
      v[i] = 10 - step
      this.chesspieces[i] = TChessman.N
      step--
    } else if (this.isWin(this.getOpponent(side))) {
      v[i] = -10 + step
      this.chesspieces[i] = TChessman.N
      step--
    } else if (this.isFull()) {
      v[i] = 0
      this.chesspieces[i] = TChessman.N
      step--
    } else {
      v[i] = this.findTheBestPlace1(this.getOpponent(mside), side, ++step)[1]
      this.chesspieces[i] = TChessman.N
      step--
    }
    if (side === mside) {
      if ((value === undefined) || v[i] >= value) {
        value = v[i]
      }
    } else {
      if ((value === undefined) || v[i] <= value) {
        value = v[i]
      }
    }
  }
  for (let i = 0; i <= 8; i++) {
    if (this.chesspieces[i] !== TChessman.N) {
      continue
    }
    if (v[i] === value)  {
      place.push(i)
    }
  }
  return [ place, value as number, v ]
}

  private init() {
    for (let i = 0; i <= 8; i++) {
      this.chesspieces[i] = TChessman.N
    }
  }

  private isFull(): boolean {
    let i: number = 1
    for (i = 0; i <= 8; i++) {
      if (this.chesspieces[i] === TChessman.N) {
        break
      }
    }
    if (i === 9) {
      return true
    }else {
      return false
    }
  }

  private isWin(side: TChessman): boolean {
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

  private getOpponent(now: TChessman): TChessman {
    return (now === TChessman.O) ? TChessman.X : TChessman.O
  }

  private getRemainingPieceOfPossiblePlace(possiblePlace: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8]): number {
    let result: number = 0
    for (const t of possiblePlace) {
      if (this.chesspieces[t] === TChessman.N) {
        result++
      }
    }
    return result
  }

  // 计算side走在place处的输赢概率
  private getProbability([ win, lose, draw ]: number[], place: number, mside: TChessman,
                         probability: number, side: TChessman, level: number): number[] {
    // 在place假装走棋
    this.placePiece(place, mside)
    this.counter++
    if (this.isWin(side)) {
      // 结束了，是赢的
      this.chesspieces[place] = TChessman.N
      // 收回'+place+'的棋子
      return [ win + probability, lose, draw ]
    } else if (this.isWin(this.getOpponent(side))) {
      // 结束了，是输的
      this.chesspieces[place] = TChessman.N
      // 收回'+place+'的棋子
      return [ win, lose + probability, draw ]
    } else if (this.isFull()) {
      // 结束了，平局
      this.chesspieces[place] = TChessman.N
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
          if (this.chesspieces[t] !== TChessman.N) {
            continue
          }
          [ win, lose, draw ] = this.getProbability([ win, lose, draw ], t,
                                                    this.getOpponent(mside), probability, side, level)
        }
      } else {
        for (let t = 0; t <= 8; t++) {
          if (this.chesspieces[t] !== TChessman.N) {
            continue
          }
          [ win, lose, draw ] = this.getProbability([ win, lose, draw ], t,
                                                    this.getOpponent(mside), probability, side, level)
        }
      }
      this.chesspieces[place] = TChessman.N
      // 收回place的棋子
      return [ win, lose, draw ]
    }
  }

  private findbestplace(side: TChessman, level: number): [ number[], number ] {
    const bestplace: number[] = []
    let maxprobability: number = 0
    const notloose: number[] = []
    let [ win, lose, draw ]: number[] = []
    for (let i = 0; i <= 8; i++) {
      if (this.chesspieces[i] !== TChessman.N) {
        continue
      }
      [ win, lose, draw ] = this.getProbability([ 0, 0, 0 ], i, side, 1, side, level)
      notloose[i] = win + draw
      if (notloose[i] > maxprobability) {
        maxprobability = notloose[i]
      }
    }
    for (let i = 0; i <= 8; i++) {
      if (notloose[i] === maxprobability) {
        bestplace.push(i)
      }
    }
    return [ bestplace, maxprobability ]
  }
}

/*
let chessboard = new Chessboard()
chessboard.chesspieces[0] = TChessman.O
chessboard.chesspieces[2] = TChessman.X
chessboard.chesspieces[5] = TChessman.O
chessboard.chesspieces[6] = TChessman.X
chessboard.chesspieces[7] = TChessman.O
chessboard.chesspieces[8] = TChessman.X
chessboard.outputProbability(TChessman.O,2)*/
