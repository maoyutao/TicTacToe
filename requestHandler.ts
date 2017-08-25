import * as http from 'http'
import * as url from 'url'
import * as querystring from 'querystring'
import * as fs from 'fs'

import { Chessboard } from './chessboard'
import { ComputerPlayer, HumanPlayer } from './player'
import { TChessman, ServerRequest } from './types'

const humanplayers: {[index: string]: HumanPlayer} = {}
const computerplayers: {[index: string]: ComputerPlayer} = {}
const chessboards: {[index: string]: Chessboard} = {}

const chessboardInfo: {chessboardName: string, player1: string, player2: string, viewers: string[],
                      isPlayer1ready: boolean, isPlayer2ready: boolean
                      isPlayer1Computer: boolean, isPlayer2Computer: boolean,
                      isGameOn: boolean}[] = []
const log: {[index: string]: string} = {}
const side: {[index: string]: TChessman} = {}

function changeTChessmanToString(side: TChessman): string {
  switch (side) {
    case TChessman.N:
      return ' '
    case TChessman.O:
      return 'o'
    case TChessman.X:
      return 'x'
  }
}
export function status(req: ServerRequest, res: http.ServerResponse)  {
  const query = req.query
  if (!query.chessboard || !query.user) {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  if (!log[query.user]) {
    log[query.user] = ''
  }
  if (!(query.chessboard in chessboards)) {
    chessboards[query.chessboard] = new Chessboard()
    if (query.role === 'competitor') {
      log[query.user] = '您是玩家1<br/>'
      const mside = (query.side === 'x') ? TChessman.X : TChessman.O
      const Cside = (mside === TChessman.O) ? TChessman.X : TChessman.O
      log[query.user] += `设置棋子为${changeTChessmanToString(mside)}<br/>`
      side[query.user] = mside
      if (parseInt(query.opponent) === -1) {
        chessboardInfo.push({
          chessboardName: query.chessboard,
          player1: query.user,
          player2: '',
          viewers: [],
          isPlayer1ready: false,
          isPlayer2ready: false,
          isPlayer1Computer: false,
          isPlayer2Computer: false,
          isGameOn: false,
        })
      } else {
        chessboardInfo.push({
          chessboardName: query.chessboard,
          player1: query.user,
          player2: query.opponent+'级AI',
          viewers: [],
          isPlayer1ready: false,
          isPlayer2ready: true,
          isPlayer1Computer: false,
          isPlayer2Computer: true,
          isGameOn: false,
        })
        computerplayers[query.chessboard] = new ComputerPlayer(Cside, chessboards[query.chessboard])
        computerplayers[query.chessboard].setLevel(parseInt(query.opponent))
      }
    } else {
      chessboardInfo.push({
        chessboardName: query.chessboard,
        player1: '',
        player2: '',
        viewers: [],
        isPlayer1ready: false,
        isPlayer2ready: false,
        isPlayer1Computer: false,
        isPlayer2Computer: false,
        isGameOn: false,
      })
      log[query.user] = ''
    }
  } else {
    chessboardInfo.forEach((info) => {
      if (info.chessboardName === query.chessboard) {
        if (!query.role || query.role === 'competitor') {
          if (!info.player1) {
            info.player1 = query.user
            info.isPlayer1Computer = false
            log[query.user] += '您是玩家1<br/>'
            const mside = (query.side === 'x') ? TChessman.X : TChessman.O
            if (info.player2 && side[info.player2] === mside) {
              const Cside = (mside === TChessman.O) ? TChessman.X : TChessman.O
              log[query.user] += `此棋子已被对方选择，被动选择${changeTChessmanToString(Cside)}<br/>`
              side[query.user] = Cside
            } else {
              log[query.user] += `设置棋子为${changeTChessmanToString(mside)}<br/>`
              side[query.user] = mside
            }
          } else if (!info.player2) {
            info.player2 = query.user
            log[query.user] += '您是玩家2<br/>'
            const mside = (query.side === 'x') ? TChessman.X : TChessman.O
            if (info.player1 && side[info.player1] === mside) {
              const Cside = (mside === TChessman.O) ? TChessman.X : TChessman.O
              log[query.user] += `${changeTChessmanToString(mside)}已被对方选择，被动选择${changeTChessmanToString(Cside)}<br/>`
              side[query.user] = Cside
            } else {
              log[query.user] += `设置棋子为${changeTChessmanToString(mside)}<br/>`
              side[query.user] = mside
            }
            info.isPlayer2Computer = false
          } else {
            log[query.user] += '房间已满，您的身份变为观众<br/>'
            if (info.viewers.indexOf(query.user) === -1) {
              info.viewers.push(query.user)
            }
          }
        } else {
          if (info.viewers.indexOf(query.user) === -1) {
            info.viewers.push(query.user)
          }
        }
        return
      }
    })
  }
  let player1: string = ''
  let player2: string = ''
  let viewers: string[] = []
  chessboardInfo.forEach((info) => {
    if (info.chessboardName === query.chessboard) {
      player1 = info.player1
      player2 = info.player2
      viewers = info.viewers
      return
    }
  })
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.write(JSON.stringify({
    code: 200,
    chessboardName: query.chessboard,
    log: log[query.user],
    chessboard: chessboards[query.chessboard].Chessboard(),
    allChessboards: chessboardInfo.map((info) => info.chessboardName),
    player1: player1,
    player2: player2,
    viewers: viewers,
    }))
  res.end()
}

function computerPlace(computerName: string, opponent: string) {
  computerplayers[computerName].changeState()
  setTimeout(() => {
    while(computerplayers[computerName].state) {
      computerplayers[computerName].placeAccordingToLevel()
    }
      log[opponent] += '对方已落子，玩家下<br/>'
      humanplayers[opponent].changeState()
  }, 500)
}
export function ready(req: ServerRequest, res: http.ServerResponse) {
  const body = req.body
  if (!body.chessboard) {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  let isPlayer1ready: boolean = false
  let isPlayer2ready: boolean = false
  chessboardInfo.forEach((info) => {
    if (info.chessboardName === body.chessboard) {
      if (body.user === info.player1) {
        log[info.player1] += '您已经准备好了<br/>'
        info.isPlayer1ready = true
      } else if (body.user === info.player2) {
        log[info.player1] += '您已经准备好了<br/>'
        info.isPlayer2ready = true
      } else {
        log[body.user] += '您未参与游戏<br/>'
      }
      if (info.isPlayer1ready && info.isPlayer2ready) {
        setTimeout(() => {
          info.isPlayer1ready = info.isPlayer2ready = false
        }, 1000)
        chessboards[info.chessboardName].init()
        playersInit(info.chessboardName)
        const player1first = Math.random() > 0.5 
        if (!info.isPlayer1Computer) {
          humanplayers[info.player1] = new HumanPlayer(side[info.player1], chessboards[info.chessboardName])
          log[info.player1] += '游戏开始<br/>'
          info.isGameOn = true
          if (player1first) {
            log[info.player1] += '您先下<br/>'
            humanplayers[info.player1].changeState()
          } else {
            log[info.player1] += '您后下<br/>'
          }
        } else {
          if (player1first) {
            computerPlace(info.chessboardName, info.player2)
          }
        }
        if (!info.isPlayer2Computer) {
          humanplayers[info.player2] = new HumanPlayer(side[info.player2], chessboards[info.chessboardName])
          log[info.player2] += '游戏开始<br/>'
          info.isGameOn = true
          if (!player1first) {
            log[info.player2] += '您先下<br/>'
            humanplayers[info.player2].changeState()
          } else {
            log[info.player2] += '您后下<br/>'
          }
        } else {
          if (!player1first) {
            computerPlace(info.chessboardName, info.player1)
          }
        }
      }
      isPlayer1ready = info.isPlayer1ready
      isPlayer2ready = info.isPlayer2ready
      return
    }
  })
  console.log(isPlayer1ready)
  res.write(JSON.stringify({
    code: 200,
    log: log[body.user],
    isPlayer1ready: isPlayer1ready,
    isPlayer2ready: isPlayer2ready,
  }))
  res.end()
}

export function update(req: ServerRequest, res: http.ServerResponse) {
  const query = req.query
  let player1: string = ''
  let player2: string = ''
  let viewers: string[] = []
  let isPlayer1ready: boolean = false
  let isPlayer2ready: boolean = false
  let isGameOn: boolean = false
  chessboardInfo.forEach((info) => {
    if (info.chessboardName === query.chessboardName) {
      player1 = info.player1
      player2 = info.player2
      viewers = info.viewers
      isPlayer1ready = info.isPlayer1ready
      isPlayer2ready = info.isPlayer2ready
      return
    }
  })
  console.log(query.chessboardName)
  res.write(JSON.stringify({ 
    code: 200,
    log: log[query.user],
    chessboardName: chessboards[query.chessboardName] ? query.chessboardName : '',
    chessboard: (chessboards[query.chessboardName] && chessboards[query.chessboardName].Chessboard()) || [],
    allChessboards: chessboardInfo.map((info) => info.chessboardName),
    player1: player1,
    player2: player2,
    viewers: viewers,
    isPlayer1ready: isPlayer1ready,
    isPlayer2ready: isPlayer2ready,
  }))
  res.end()
}

export function placepiece(req: ServerRequest, res: http.ServerResponse) {
  const body = req.body
  console.log(body)
  if (!body || !body.user || !body.chessboard || !body.place) {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  console.log(computerplayers)
  chessboardInfo.forEach((info) => {
    if (info.chessboardName === body.chessboard) {
      if (!info.isGameOn) {
        log[body.user] += '游戏未开始<br/>'
        return
      }
      let [feedback, finishflag] = humanplayers[body.user].place(parseInt(body.place))
      feedback += '<br/>'
      switch (body.user) {
        case info.player1:
          log[body.user] += feedback
          console.log(chessboardInfo)
          if (finishflag) {
            if (tell(info.chessboardName)) {
              return
            }
            if (info.isPlayer2Computer) {
              computerPlace(info.chessboardName, info.player1)
              if (tell(info.chessboardName)) {
                return
              }
            } else {
              log[info.player2] += feedback
              humanplayers[info.player2].changeState()
            }
          }
          break
        case info.player2:
          log[body.user] += feedback
          if (finishflag) {
            if (tell(info.chessboardName)) {
              return
            }
            if (info.isPlayer1Computer) {
              computerPlace(info.chessboardName, info.player1)
              if (tell(info.chessboardName)) {
                return
              }
            } else {
              log[info.player1] += feedback
              humanplayers[info.player1].changeState()
            }
          }
          break
        default:
          log[body.user] += '您不能下棋<br/>'
        }
        return
      }
    })
  res.statusCode = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log(body)
  console.log(chessboards)
  res.write(JSON.stringify({ 
    code: 200,
    log: log[body.user],
    chessboard: (chessboards[body.chessboard] && chessboards[body.chessboard].Chessboard()) || [],
  }))
  res.end()
}

function playersInit(chessboard: string) {
  chessboardInfo.forEach((info) => {
    if (info.chessboardName === chessboard) {
      info.isGameOn = false
      computerplayers[chessboard] && computerplayers[chessboard].init()
      humanplayers[info.player1] && humanplayers[info.player1].init()
      computerplayers[chessboard] && computerplayers[chessboard].init()
      humanplayers[info.player1] && humanplayers[info.player2].init()
    }
  })
}

function tell(chessboardName: string): boolean {
  const [ flag, infoo ]: [ boolean, string ] = chessboards[chessboardName].isOver()
  if (flag) {
    chessboardInfo.forEach((info) => {
      if (info.chessboardName === chessboardName){
        log[info.player1] += (infoo + '<br/>')
        log[info.player2] += (infoo + '<br/>')
        playersInit(chessboardName)
      }
    })
  }
  return flag
}
export function restart(req: ServerRequest, res: http.ServerResponse) {
  const query = req.query
  if (!query.player)  {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  humanplayers[query.player].init()
  computerplayers[query.player].init()
  humanplayers[query.player].getChessboard().init()
  log[query.player] = '重新开始<br/>'
  if (Math.random() > 0.5)  {
    humanplayers[query.player].changeState()
    log[query.player] += '玩家先下<br/>'
  } else  {
    log[query.player] += '电脑先下<br/>'
    computerplayers[query.player].changeState()
    while (computerplayers[query.player].state)  {
      computerplayers[query.player].placeAccordingToLevel()
    }
    log[query.player] += '电脑已落子，玩家下<br/>'
    humanplayers[query.player].changeState()
  }
  res.write(JSON.stringify({ 
    code: 200,
    log: log[query.player],
    chessboard: humanplayers[query.player].getChessboard().Chessboard(),
    allplayers: humanplayers,
    player: query.player,
    level: computerplayers[query.player].level
  }))
  res.end()
}

export function root(req: ServerRequest, res: http.ServerResponse)  {
  const rs = fs.createReadStream('./public/assets/index.html')
  rs.pipe(res)
}

export function getChessboards(req: ServerRequest, res: http.ServerResponse) {
  res.write(JSON.stringify({ 
    code: 200,
    allChessboards: chessboardInfo.map((info) => info.chessboardName),
  }))
  res.end()
}

export function leave() {

}