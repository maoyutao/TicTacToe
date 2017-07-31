type typeOfChessman = 'o' | 'x' | ' '

export class Chessboard {
    constructor() {
        for (let i = 1; i <= 9; i++) {
            this.chesspieces[i] = ' '
        }
    }

    private chesspieces: typeOfChessman[] = [];
    init() {
        for (let i = 1; i <= 9; i++) {
            this.chesspieces[i] = ' '
        }
    }
    private chessboard: string =
    `-------------
    | ${this.chesspieces[1]} | ${this.chesspieces[2]} | ${this.chesspieces[3]} |
    -------------
    | ${this.chesspieces[4]} | ${this.chesspieces[5]} | ${this.chesspieces[6]} |
    -------------
    | ${this.chesspieces[7]} | ${this.chesspieces[8]} | ${this.chesspieces[9]} |
    -------------`;
    public outPutChessboard() {
        console.log("当前棋盘如下：")
        this.chessboard = `-------------
    | ${this.chesspieces[1]} | ${this.chesspieces[2]} | ${this.chesspieces[3]} |
    -------------
    | ${this.chesspieces[4]} | ${this.chesspieces[5]} | ${this.chesspieces[6]} |
    -------------
    | ${this.chesspieces[7]} | ${this.chesspieces[8]} | ${this.chesspieces[9]} |
    -------------`;
        console.log(this.chessboard)
    }
    public placePiece(num: number, side: typeOfChessman): boolean {
        if (this.chesspieces[num] === ' ') {
            this.chesspieces[num] = side;
            return true //`${side}方在${num}号位置成功落子`
        } else {
            return false //`${num}号位置不可落子`
        }
    }
    private isFull(): boolean {
        let i: number = 1;
        for (i = 1; i <= 9; i++) {
            if (this.chesspieces[i] === ' ') {
                break;
            }
        }
        if (i === 10) return true
        else return false
    }
    public isOver(): [boolean, string] {
        if (this.isWin('o')) {
            this.init()
            return [true, "游戏结束，o方胜利"]
        } else if (this.isWin('x')) {
            this.init()
            return [true, "游戏结束，x方胜利"]
        } else if (this.isFull()) {
            this.init()
            return [true, "游戏结束，平局"]
        }
        return [false, "游戏继续"]
    }
    private isWin(side: typeOfChessman): boolean {
        for (let i = 0; i <= 2; i += 1) {
            if ((this.chesspieces[1 + i * 3] === side && this.chesspieces[2 + i * 3] === side && this.chesspieces[3 + i * 3] === side) ||
                (this.chesspieces[1 + i] === side && this.chesspieces[4 + i] === side && this.chesspieces[7 + i] === side)) {
                return true;
            }
        }
        if ((this.chesspieces[1] === side && this.chesspieces[5] === side && this.chesspieces[9] === side) ||
            (this.chesspieces[3] === side && this.chesspieces[5] === side && this.chesspieces[7] === side)) {
            return true
        } else {
            return false
        }
    }
    private getOpponent(now: typeOfChessman): typeOfChessman {
        return (now === 'o') ? 'x' : 'o'
    }
    private getRemainingPieceOfPossiblePlace(possiblePlace: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]): number {
        let result: number = 0
        for (let t = 1; t <= possiblePlace.length; t++) {
            if (this.chesspieces[possiblePlace[t]] === ' ') {
                result++
            }
        }
        return result
    }
    //计算side走在place处的输赢概率
    private getProbability([win, lose, draw]: number[], place: number, m_side: typeOfChessman, probability: number, side: typeOfChessman, level: number): number[] {
        //       console.log('走下面这步的概率为'+probability)
        //       console.log(`在${place}假装走棋`)
        this.placePiece(place, m_side)
        if (this.isWin(side)) {
            //            console.log("结束了，是赢的")
            this.chesspieces[place] = ' '
            //            console.log("收回"+place+"的棋子")
            return [win + probability, lose, draw]
        }
        else if (this.isWin(this.getOpponent(side))) {
            //            console.log("结束了，是输的")
            this.chesspieces[place] = ' '
            //           console.log("收回"+place+"的棋子")
            return [win, lose + probability, draw]
        }
        else if (this.isFull()) {
            //            console.log("结束了，平局")
            this.chesspieces[place] = ' '
            //            console.log("收回"+place+"的棋子")
            return [win, lose, draw + probability]
        }
        else {
            let possiblePlace: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            if (m_side === side) {
                if (level > 1) {
                    possiblePlace = this.findbestplace(this.getOpponent(m_side), level - 1)[0]
                    //outPutChessboard()
                    //console.log(getOpponent(m_side)+'落子最好点',possiblePlace)
                }
                probability *= (1 / this.getRemainingPieceOfPossiblePlace(possiblePlace))
            } else {
                probability *= (1 / this.getRemainingPieceOfPossiblePlace())
            }
            //            console.log("没结束"+getOpponent(m_side)+"走棋")
            if (m_side === side) {
                for (let t = 1; t < possiblePlace.length; t++) {
                    if (this.chesspieces[possiblePlace[t]] !== ' ') {
                        continue
                    }
                    [win, lose, draw] = this.getProbability([win, lose, draw], possiblePlace[t], this.getOpponent(m_side), probability, side, level)
                }
            } else {
                for (let t = 1; t <= 9; t++) {
                    if (this.chesspieces[t] !== ' ') {
                        continue
                    }
                    [win, lose, draw] = this.getProbability([win, lose, draw], t, this.getOpponent(m_side), probability, side, level)
                }
            }
            this.chesspieces[place] = ' '
            //            console.log("收回"+place+"的棋子")
            return [win, lose, draw]
        }
    }
    private getProbabilityAccordingToLevel(level: number, [win, lose, draw]: number[], place: number, m_side: typeOfChessman, probability: number, side: typeOfChessman) {
        return this.getProbability([win, lose, draw], place, m_side, probability, side, level)
    }
    private findbestplace(side: typeOfChessman, level: number): [number[], number, number] {
        let bestplace: number[] = []
        let maxprobability: number = 0
        let notloose: number[] = []
        let [win, lose, draw]: number[] = []
        let numberOfBestplace: number = 0
        for (let i = 1; i <= 9; i++) {
            if (this.chesspieces[i] !== ' ') {
                continue
            }
            [win, lose, draw] = this.getProbabilityAccordingToLevel(level, [ 0, 0, 0 ], i, side, 1, side)
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
        return [bestplace, maxprobability, numberOfBestplace]
    }
    public outputProbability(side: typeOfChessman, level: number): [number[], number, number[], number] {
        let bestplace: number[] = []
        let fineplace: number[] = []
        let maxprobability: number = 0
        let maxdrawprobability: number = 0
        let numberOfBestplace: number = 0
        let numberOfFineplace: number = 0
        let win: number[] = []
        let draw: number[] = []
        let lose: number
        for (let i = 1; i <= 9; i++) {
            if (this.chesspieces[i] !== ' ') {
                continue
            }
            [win[i], lose, draw[i]] = this.getProbabilityAccordingToLevel(level, [0, 0, 0], i, side, 1, side)
            console.log(
                `${side}在${i}号位置下棋的胜率为${win[i]},败率为${lose}，平局的概率为${draw[i]}`)
            if (win[i] > maxprobability) {
                maxprobability = win[i]
            }
            if (draw[i] > maxdrawprobability) {
                maxdrawprobability = draw[i]
            }
        }
        for (let i = 1; i <= 9; i++) {
            if (maxprobability > 0) {
                if (win[i] === maxprobability) {
                    bestplace[++numberOfBestplace] = i;
                }
            }
            if (draw[i] === maxdrawprobability) {
                fineplace[++numberOfFineplace] = i;
            }
        }
        let places: string = ''
        bestplace.forEach((value) => {
            places += `${value} `
        })
        console.log(
            `${side}在${places}位置下棋胜率最大，胜率为${maxprobability}`
        )
        return [bestplace, numberOfBestplace, fineplace, numberOfFineplace]
    }
    public findTheBestPlace(m_side: typeOfChessman, side: typeOfChessman): [number, number] {
        let place: number | undefined
        let value: number | undefined
        for (let i = 1; i <= 9; i++) {
            if (this.chesspieces[i] !== ' ') {
                continue
            }
            let v: number | undefined
            this.placePiece(i, m_side)
            if (this.isWin(side)) {
                v = 1
                this.chesspieces[i] = ' '
            } else if (this.isWin(this.getOpponent(side))) {
                v = -1
                this.chesspieces[i] = ' '
            } else if (this.isFull()) {
                v = 0
                this.chesspieces[i] = ' '
            } else {
                v = this.findTheBestPlace(this.getOpponent(m_side), side)[1]
                this.chesspieces[i] = ' '
            }
            if (side === m_side) {
                if ((value === undefined) || v >= value) {
                    value = v
                    place = i
                }
                if (value === 1) return [place as number, value as number]
            } else {
                if ((value === undefined) || v <= value) {
                    value = v
                    place = i
                }
                if (value === -1) return [place as number, value as number]
            }
        }
        return [place as number, value as number]
    }
}

