"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chessboard_1 = require("./chessboard");
class player {
    constructor(side) {
        this.side = side;
        this.state = false;
    }
    changeState() {
        if (this.state) {
            this.state = false;
        }
        else {
            this.state = true;
        }
    }
}
class humanPlayer extends player {
    place(num) {
        if (this.state) {
            if (num > 9) {
                return `${num}不代表棋格`;
            }
            if (chessboard_1.placePiece(num, this.side)) {
                this.changeState();
                return `${this.side}方在${num}号位置成功落子`;
            }
            else {
                return `${num}号位置不可落子`;
            }
        }
        else {
            return "您现在不能下棋";
        }
    }
}
exports.humanPlayer = humanPlayer;
class computerPlayer extends player {
    randomPlace() {
        if (this.state) {
            while (!chessboard_1.placePiece(Math.floor(Math.random() * 9), this.side)) { }
            this.changeState();
        }
    }
}
exports.computerPlayer = computerPlayer;
