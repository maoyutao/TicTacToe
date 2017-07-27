"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./player");
const chessboard_1 = require("./chessboard");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
let HumanPlayer = new player_1.humanPlayer('o');
let ComputerPlayer = new player_1.computerPlayer('x');
function question() {
    return new Promise((resolve, reject) => {
        rl.question('请输入1-9（对应棋盘上的9个位置)', (answer) => {
            resolve(parseInt(answer));
        });
    });
}
console.log("游戏开始");
chessboard_1.outPutChessboard();
if (Math.random() > 0.5) {
    console.log("您先下");
}
else {
    console.log("电脑先下");
    ComputerPlayer.changeState();
    ComputerPlayer.randomPlace();
    chessboard_1.outPutChessboard();
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            console.log("您下棋");
            chessboard_1.getProbability('o');
            HumanPlayer.changeState();
            while (HumanPlayer.state) {
                let num = (yield question());
                let info = HumanPlayer.place(num);
                console.log(info);
            }
            chessboard_1.outPutChessboard();
            let [flag, info] = chessboard_1.isOver();
            if (flag) {
                console.log(info);
                break;
            }
            console.log("电脑下棋");
            ComputerPlayer.changeState();
            ComputerPlayer.randomPlace();
            chessboard_1.outPutChessboard();
            [flag, info] = chessboard_1.isOver();
            if (flag) {
                console.log(info);
                break;
            }
        }
    });
}
main();
