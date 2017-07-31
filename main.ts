import * as readline from 'readline'

import { Chessboard } from './chessboard'
import { ComputerPlayer, HumanPlayer } from './player'
import { TChessman } from './types'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(): Promise<number> {
  return new Promise((resolve, reject) => {
    rl.question('请输入1-9（对应棋盘上的9个位置)', (answer: string) => {
      resolve(parseInt(answer))
    })
  })
}

function chooseLevel(): Promise<number> {
  return new Promise((resolve, reject) => {
    rl.question('请选择难度（输入1-10难度)', (answer: string) => {
      resolve(parseInt(answer))
    })
  })
}

function restart(): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question("再来一局？（输入'q'退出，输入其他再来一局）", (answer: string) => {
      resolve(answer)
    })
  })
}

async function main() {
  const chessboard = new Chessboard()
  const humanPlayer = new HumanPlayer(TChessman[0], chessboard)
  const computerPlayer = new ComputerPlayer(TChessman[1], chessboard)
  while (1) {
    console.log('游戏开始')
    while (!computerPlayer.setLevel((await chooseLevel()) as number)) {
      // while
    }
    chessboard.outputChessboard()
    if (Math.random() > 0.5) {
      console.log('您先下')
    } else {
      console.log('电脑先下')
      computerPlayer.changeState()
      computerPlayer.placeAccordingToLevel()
      chessboard.outputChessboard()
    }
    while (1) {
      console.log('您下棋')
      humanPlayer.changeState()
      while (humanPlayer.state) {
        const num: number = (await question()) as number
        const result = humanPlayer.place(num)
        console.log(result)
      }
      chessboard.outputChessboard()
      let [flag, info]: [boolean, string] = chessboard.isOver()
      if (flag) {
        console.log(info)
        break
      }
      console.log('电脑下棋')
      computerPlayer.changeState()
      computerPlayer.placeAccordingToLevel()
      chessboard.outputChessboard()
      ; [ flag, info ] = chessboard.isOver()
      if (flag) {
        console.log(info)
        break
      }
    }
    const restartOrNot = await restart()
    if (restartOrNot === 'q') {
      break
    } else {
      computerPlayer.init()
      humanPlayer.init()
    }
  }
}

main().catch((err: any) => {
  console.error(err)
})
