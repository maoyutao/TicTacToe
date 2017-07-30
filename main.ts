import {humanPlayer, computerPlayer} from "./player"
import {outPutChessboard, isOver} from "./chessboard"

declare function require(path: string):any;

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function question() {
    return new Promise((resolve, reject) => {
        rl.question('请输入1-9（对应棋盘上的9个位置)', (answer: string) => {
            resolve(parseInt(answer))
        })
    })
}
function chooseLevel()  {
    return new Promise((resolve,reject) => {
        rl.question("请选择难度（输入1-10难度)", (answer: string) => {
            resolve(parseInt(answer))
        })
    })
}

function restart() {
    return new Promise((resolve, reject) => {
        rl.question("再来一局？（输入'q'退出，输入其他再来一局）", (answer:string) => {
            resolve(parseInt(answer));
        });
    });
}


async function main() {
let HumanPlayer = new humanPlayer('o')
let ComputerPlayer = new computerPlayer('x')
while(1){
console.log("游戏开始")
while(!ComputerPlayer.setlevel((await chooseLevel()) as number)) {

}
outPutChessboard()
if(Math.random()>0.5) {
    console.log("您先下")
}else {
    console.log("电脑先下")
    ComputerPlayer.changeState()
    ComputerPlayer.placeAccordingToLevel()
    outPutChessboard();
}
while(1)
{
    console.log("您下棋")

    HumanPlayer.changeState()

    while (HumanPlayer.state) {
        let num:number = (await question()) as number
        let info = HumanPlayer.place(num)
        console.log(info)
    }

    outPutChessboard()
    let [ flag, info ]:[boolean,string] = isOver()
    if (flag) {
        console.log(info)
        break
    }
    console.log("电脑下棋")
    ComputerPlayer.changeState()
    ComputerPlayer.placeAccordingToLevel()
    outPutChessboard();
    [flag,info] = isOver()
    if(flag) {
        console.log(info)
        break
    }
}

let restartOrNot = await restart()
    if(restartOrNot === 'q') {
        break
    }else {
        ComputerPlayer.init()
        HumanPlayer.init()
    }
}
}

main()
