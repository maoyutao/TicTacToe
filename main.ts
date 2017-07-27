import {humanPlayer, computerPlayer} from "./player"
import {outPutChessboard, isOver, getProbability} from "./chessboard"

declare function require(path: string):any;

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


let HumanPlayer = new humanPlayer('o')
let ComputerPlayer = new computerPlayer('x')

function question() {
    return new Promise((resolve, reject) => {
        rl.question('请输入1-9（对应棋盘上的9个位置)', (answer: string) => {
            resolve(parseInt(answer))
        })
    })
}

console.log("游戏开始")
outPutChessboard()
if(Math.random()>0.5) {
    console.log("您先下")
}else {
    console.log("电脑先下")
    ComputerPlayer.changeState()
    ComputerPlayer.randomPlace()
    outPutChessboard();
}

async function main() {
while(1)
{
    console.log("您下棋")
    getProbability('o')
    HumanPlayer.changeState()

    while(HumanPlayer.state) {  
        let num:number = (await question()) as number
        let info = HumanPlayer.place(num)
        console.log(info)
    }
    
    outPutChessboard()
    let [flag,info]:[boolean,string] = isOver()
    if(flag) {
        console.log(info)
        break
    }
    console.log("电脑下棋")
    ComputerPlayer.changeState()
    ComputerPlayer.randomPlace()
    outPutChessboard();
    [flag,info] = isOver()
    if(flag) {
        console.log(info)
        break
    }
}
}
main()



