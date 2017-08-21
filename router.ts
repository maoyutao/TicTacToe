
import * as http from 'http'
import * as querystring from 'querystring'
import * as url from 'url'
import * as fs from 'fs'
import * as mime from 'mime-types'
import * as path from 'path'

import { ServerRequest } from './types'

export function route(handle: {[key: string]: (req: ServerRequest, res: http.ServerResponse) => void},
                      pathname: string, req: ServerRequest,
                      res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Method', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  console.log(pathname)
  if (pathname in handle) {
    req.query = querystring.parse(url.parse(req.url as string).query)
    if (req.method === 'POST') {
      let postData: string = ''
      req.on('data', (data: any) => {
        postData += data
      })
      req.on('end', () => {
        req.body = JSON.parse(postData)
        handle[pathname](req, res)
      })
    } else if (req.method === 'OPTIONS') {
      res.write(JSON.stringify({ code: 200 }))
      res.end()
    } else {
      handle[pathname](req, res)
    }
  } else if (fs.existsSync(path.join('./public', pathname)))  {
    res.setHeader('Content-Type', mime.lookup(pathname))
    fs.createReadStream(path.join('./public', pathname)).pipe(res)
  } else  {
    res.statusCode = 404
    res.write(JSON.stringify({ code: 404 }))
    res.end()
  }
}