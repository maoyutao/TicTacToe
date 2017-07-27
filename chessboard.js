"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let chesspieces = [];
function init() {
    for (let i = 1; i <= 9; i++) {
        chesspieces[i] = ' ';
    }
}
init();
let chessboard = `-------------
| ${chesspieces[1]} | ${chesspieces[2]} | ${chesspieces[3]} |
-------------
| ${chesspieces[4]} | ${chesspieces[5]} | ${chesspieces[6]} |
-------------
| ${chesspieces[7]} | ${chesspieces[8]} | ${chesspieces[9]} |
-------------`;
function outPutChessboard() {
    console.log("当前棋盘如下：");
    chessboard = `-------------
| ${chesspieces[1]} | ${chesspieces[2]} | ${chesspieces[3]} |
-------------
| ${chesspieces[4]} | ${chesspieces[5]} | ${chesspieces[6]} |
-------------
| ${chesspieces[7]} | ${chesspieces[8]} | ${chesspieces[9]} |
-------------`;
    console.log(chessboard);
}
exports.outPutChessboard = outPutChessboard;
function placePiece(num, side) {
    if (chesspieces[num] === ' ') {
        chesspieces[num] = side;
        return true; //`${side}方在${num}号位置成功落子`
    }
    else {
        return false; //`${num}号位置不可落子`
    }
}
exports.placePiece = placePiece;
function isOver() {
    function isFull() {
        let i = 1;
        for (i = 1; i <= 10; i++) {
            if (chessboard[i] === ' ') {
                break;
            }
        }
        if (i === 10)
            return true;
        else
            return false;
    }
    if (isWin('o')) {
        init();
        return [true, "游戏结束，o方胜利"];
    }
    else if (isWin('x')) {
        init();
        return [true, "游戏结束，x方胜利"];
    }
    else if (isFull()) {
        init();
        return [true, "游戏结束，平局"];
    }
    return [false, "游戏继续"];
}
exports.isOver = isOver;
function isWin(side) {
    for (let i = 0; i <= 6; i += 3) {
        if ((chesspieces[1 + i] === side && chesspieces[2 + i] === side && chesspieces[3 + i] === side) ||
            (chesspieces[1 + i] === side && chesspieces[4 + i] === side && chesspieces[7 + i] === side)) {
            return true;
        }
    }
    if ((chesspieces[1] === side && chesspieces[5] === side && chesspieces[9] === side) ||
        (chesspieces[3] === side && chesspieces[5] === side && chesspieces[7] === side)) {
        return true;
    }
    else {
        return false;
    }
}
