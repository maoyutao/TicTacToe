import * as http from 'http'
import * as url from 'url'
import * as querystring from 'querystring'
import * as fs from 'fs'

import { Chessboard } from './chessboard'
import { ComputerPlayer, HumanPlayer } from './player'
import { TChessman, ServerRequest } from './types'

const humanplayers: {[index: string]: HumanPlayer} = {}
const computerplayers: {[index: string]: ComputerPlayer} = {}
const log: {[index: string]: string} = {}



export function status(req: ServerRequest, res: http.ServerResponse)  {
  const query = req.query
  if (!query.player)  {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  if (!(query.player in humanplayers))  {
    log[query.player] = ''
    const side = (query.side === 'x') ? TChessman.X : TChessman.O
    log[query.player] += `设置棋子为${side}<br/>`
    humanplayers[query.player] = new HumanPlayer(side, new Chessboard())
    const Cside = (humanplayers[query.player].side === TChessman.O) ? TChessman.X : TChessman.O
    computerplayers[query.player] = new ComputerPlayer(Cside, humanplayers[query.player].getChessboard())
    computerplayers[query.player].setLevel(parseInt(query.level))
    log[query.player] += `设置AI等级为${query.level}<br/>`
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
  } else if (('level' in query) && parseInt(query.level) !== computerplayers[query.player].level)  {
      computerplayers[query.player].setLevel(parseInt(query.level))
      log[query.player] += `设置AI等级为${query.level}<br/>`
  }
  res.setHeader('Access-Control-Allow-Origin', '*')
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

export function placepiece(req: ServerRequest, res: http.ServerResponse)  {
  const body = req.body
  console.log(body)
  if (!body || !body.player || !body.place)  {
    res.statusCode = 400
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.write(JSON.stringify({ code: 400 }))
    res.end()
    return
  }
  // console.log(humanplayers)
  log[body.player] += (humanplayers[body.player].place(parseInt(body.place)) + '<br/>')
  if (!humanplayers[body.player].state) {
    const [ flag, info ]: [ boolean, string ] = humanplayers[body.player].getChessboard().isOver()
    if (flag) {
      log[body.player] += (info + '<br/>')
      humanplayers[body.player].init()
      computerplayers[body.player].init()
    } else  {
      computerplayers[body.player].changeState()
      while (computerplayers[body.player].state)  {
        computerplayers[body.player].placeAccordingToLevel()
      }
      const [ flag, info ]: [ boolean, string ] = humanplayers[body.player].getChessboard().isOver()
      if (flag) {
        log[body.player] += (info + '<br/>')
        humanplayers[body.player].init()
        computerplayers[body.player].init()
      } else  {
        log[body.player] += '电脑已落子，玩家下<br/>'
        humanplayers[body.player].changeState()
      }
    }
  }
  res.statusCode = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log(body)
  res.write(JSON.stringify({ 
    code: 200,
    log: log[body.player],
    chessboard: humanplayers[body.player].getChessboard().Chessboard(),
    allplayers: humanplayers,
    player: body.player,
    level: computerplayers[body.player].level
  }))
  res.end()
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
    log: '',
    chessboard: '',
    allplayers: humanplayers,
    player: '',
  }))
  res.end()
}