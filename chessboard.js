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
    for (let i = 0; i <= 2; i += 1) {
        if ((chesspieces[1 + i * 3] === side && chesspieces[2 + i * 3] === side && chesspieces[3 + i * 3] === side) ||
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
//只是返回另一个  没改变  等下再换名字
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
//计算side走在place处的输赢概率 
function getProbability1([win, lose, draw], place, m_side, probability, side) {
    probability *= (1 / getRemainingPiece());
    //      console.log('走下面这步的概率为'+probability)
    //       console.log(`在${place}假装走棋`)
    placePiece(place, m_side);
    if (isWin(side)) {
        //           console.log("结束了，是赢的")
        chesspieces[place] = ' ';
        //           console.log("收回"+place+"的棋子")
        return [win + probability, lose, draw];
    }
    else if (isWin(change(side))) {
        //           console.log("结束了，是输的")
        chesspieces[place] = ' ';
        //          console.log("收回"+place+"的棋子")
        return [win, lose + probability, draw];
    }
    else if (isFull()) {
        //          console.log("结束了，平局")
        chesspieces[place] = ' ';
        //          console.log("收回"+place+"的棋子")
        return [win, lose, draw + probability];
    }
    else {
        //           console.log("没结束"+change(m_side)+"走棋")
        for (let t = 1; t <= 9; t++) {
            if (chesspieces[t] !== ' ') {
                continue;
            }
            [win, lose, draw] = getProbability1([win, lose, draw], t, change(m_side), probability, side);
        }
        chesspieces[place] = ' ';
        //           console.log("收回"+place+"的棋子")
        return [win, lose, draw];
    }
}
function getProbability2([win, lose, draw], place, probability, side) {
    probability *= (1 / getRemainingPiece());
    let theOther = change(side);
    //     console.log('走下面这步的概率为'+probability)
    //      console.log(`在${place}假装走棋`)
    placePiece(place, side);
    if (isWin(side)) {
        //          console.log("结束了，是赢的")
        chesspieces[place] = ' ';
        //          console.log("收回"+place+"的棋子")
        return [win + probability, lose, draw];
    }
    else if (isWin(change(side))) {
        //          console.log("结束了，是输的")
        chesspieces[place] = ' ';
        //          console.log("收回"+place+"的棋子")
        return [win, lose + probability, draw];
    }
    else if (isFull()) {
        //         console.log("结束了，平局")
        chesspieces[place] = ' ';
        //          console.log("收回"+place+"的棋子")
        return [win, lose, draw + probability];
    }
    else {
        //         console.log("没结束"+change(side)+"走棋")
        let placeOfOpponent = findbestplace(theOther, 1)[0];
        placePiece(placeOfOpponent, theOther); //找的时候还是用第一种方法找呃
        //           console.log('对手在'+placeOfOpponent+'走棋')
        for (let t = 1; t <= 9; t++) {
            if (chesspieces[t] !== ' ') {
                continue;
            }
            [win, lose, draw] = getProbability2([win, lose, draw], t, probability, side);
        }
        chesspieces[placeOfOpponent] = ' ';
        chesspieces[place] = ' ';
        //           console.log("收回"+place+'和'+placeOfOpponent+"的棋子")
        return [win, lose, draw];
    }
}
function getProbability(level, [win, lose, draw], place, m_side, probability, side) {
    if (level === 1)
        return getProbability1([win, lose, draw], place, m_side, probability, side);
    else
        return getProbability2([win, lose, draw], place, probability, side);
}
function findbestplace(side, level) {
    let bestplace = 0;
    let maxprobability = 0;
    let win = 0;
    for (let i = 1; i <= 9; i++) {
        if (chesspieces[i] !== ' ') {
            continue;
        }
        win = getProbability(level, [0, 0, 0], i, side, getRemainingPiece(), side)[0];
        if (win > maxprobability) {
            maxprobability = win;
            bestplace = i;
        }
    }
    return [bestplace, maxprobability];
}
function outputProbability(side, level) {
    let [win, lose, draw] = [];
    for (let i = 1; i <= 9; i++) {
        if (chesspieces[i] !== ' ') {
            continue;
        }
        [win, lose, draw] = getProbability(level, [0, 0, 0], i, side, getRemainingPiece(), side);
        console.log(`在${i}号位置下棋的胜率为${win},败率为${lose}，平局的概率为${draw}`);
    }
    let [bestplace, maxprobability] = findbestplace(side, level);
    console.log(`在${bestplace}号位置下棋胜率最大，胜率为${maxprobability}`);
    return bestplace;
}
exports.outputProbability = outputProbability;
outputProbability('o', 2);
