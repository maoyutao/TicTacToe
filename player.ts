import { Chessboard } from './chessboard'

class player {
    public state: boolean = false;
    constructor(public side: 'o' | 'x', public chessboard: Chessboard) { }
    changeState() {
        if (this.state) {
            this.state = false
        } else {
            this.state = true
        }
    }
    init() {
        this.state = false
    }
}
export class humanPlayer extends player {
    place(num: number): string {
        if (this.state) {
            if (num > 9) {
                return `${num}不代表棋格`
            }
            if (this.chessboard.placePiece(num, this.side)) {
                this.changeState()
                return `${this.side}方在${num}号位置成功落子`
            } else {
                return `${num}号位置不可落子`
            }
        } else {
            return "您现在不能下棋"
        }
    }

}

export class computerPlayer extends player {

    public level: number
    randomPlace() {
        if (this.state) {
            while (!this.chessboard.placePiece(Math.floor(Math.random() * 9), this.side)) { }
            this.changeState()
        }
    }
    intelligencePlace(level: number) {
        if (this.state) {
            let [bestplace, numberOfBestplace, fineplace, numberOfFineplace] = this.chessboard.outputProbability(this.side, level)
            let i: number, finalPlace: number
            if (numberOfBestplace > 0) {
                i = Math.floor(Math.random() * numberOfBestplace) + 1
                finalPlace = bestplace[i]
            } else {
                i = Math.floor(Math.random() * numberOfFineplace) + 1
                finalPlace = fineplace[i]
            }
            this.chessboard.placePiece(finalPlace, this.side)
            this.changeState()
        }
    }
    placeAccordingToLevel() {

        this.chessboard.placePiece(this.chessboard.findTheBestPlace(this.side, this.side)[0], this.side)
        /*if(this.level <= 1) {
            this.randomPlace()
        }else {
            this.intelligencePlace(this.level)
        }*/
    }
    setlevel(s: number) {
        if (!s) {
            return false
        }
        if (s < 1 || s > 10) {
            return false
        }
        this.level = s
        return true
    }
    init() {
        this.state = false
        this.level = 1
    }
}
