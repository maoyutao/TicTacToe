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
function isFull() {
    let i = 1;
    for (i = 1; i <= 9; i++) {
        if (chesspieces[i] === ' ') {
            break;
        }
    }
    if (i === 10)
        return true;
    else
        return false;
}
function isOver() {
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
function getProbability(side) {
    function change(now) {
        return (now === 'o') ? 'x' : 'o';
    }
    function getRemainingPiece() {
        let result = 0;
        for (let k = 1; k <= 9; k++) {
            if (chesspieces[k] === ' ') {
                result++;
            }
        }
        return result;
    }
    function s([win, lose, draw], place, m_side, probability) {
        probability *= (1 / getRemainingPiece());
        //       console.log('走下面这步的概率为'+probability)
        //        console.log(`在${place}假装走棋`)
        placePiece(place, m_side);
        if (isWin(side)) {
            //            console.log("结束了，是赢的")
            chesspieces[place] = ' ';
            //           console.log("收回"+place+"的棋子")
            return [win + probability, lose, draw];
        }
        else if (isWin(theOther)) {
            //            console.log("结束了，是输的")
            chesspieces[place] = ' ';
            //           console.log("收回"+place+"的棋子")
            return [win, lose + probability, draw];
        }
        else if (isFull()) {
            //           console.log("结束了，平局")
            chesspieces[place] = ' ';
            //           console.log("收回"+place+"的棋子")
            return [win, lose, draw + probability];
        }
        else {
            //            console.log("没结束"+change(m_side)+"走棋")
            for (let t = 1; t <= 9; t++) {
                if (chesspieces[t] !== ' ') {
                    continue;
                }
                [win, lose, draw] = s([win, lose, draw], t, change(m_side), probability);
            }
            chesspieces[place] = ' ';
            //           console.log("收回"+place+"的棋子")
            return [win, lose, draw];
        }
    }
    let bestplace = 0;
    let maxprobability = 0;
    let theOther = change(side);
    let [win, lose, draw] = [];
    for (let i = 1; i <= 9; i++) {
        if (chesspieces[i] !== ' ') {
            continue;
        }
        [win, lose, draw] = s([0, 0, 0], i, side, getRemainingPiece());
        if (win > maxprobability) {
            maxprobability = win;
            bestplace = i;
        }
        console.log(`在${i}号位置下棋的胜率为${win},败率为${lose}，平局的概率为${draw}`);
    }
    console.log(`在${bestplace}号位置下棋胜率最大，胜率为${maxprobability}`);
    return bestplace;
}
exports.getProbability = getProbability;
