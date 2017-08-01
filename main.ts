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
    rl.question('请选择难度（输入0选择随机，输入1选择一个机智的AI，输入2-10选择一个魔性的AI)', (answer: string) => {
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
  const humanPlayer = new HumanPlayer(TChessman.O, chessboard)
  const computerPlayer = new ComputerPlayer(TChessman.X, chessboard)
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

function test()  {
  const chessboard = new Chessboard()
  const computerPlayer1 = new ComputerPlayer(TChessman.O, chessboard)
  const computerPlayer2 = new ComputerPlayer(TChessman.X, chessboard)
  computerPlayer1.setLevel(10)
  computerPlayer2.setLevel(1)
  console.log('o是方法一，x是决策树')
  let flag: boolean
  let info: string = ' '
  while (1)  {
    computerPlayer2.changeState()
    computerPlayer2.placeAccordingToLevel()
    chessboard.outputChessboard()
    ; [ flag, info ] = chessboard.isOver()
    if (flag) {
      console.log(info)
      break
    }
    computerPlayer1.changeState()
    computerPlayer1.placeAccordingToLevel()
    chessboard.outputChessboard()
    ; [ flag, info ] = chessboard.isOver()
    if (flag) {
      console.log(info)
      break
    }
  }
  return info
}
/*
for (let i = 0; i < 100; i++)  {
  if (test() !== '游戏结束，平局')  {
    console.log('有错有错有错')
    break
  }
}*/
