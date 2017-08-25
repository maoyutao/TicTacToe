import * as http from 'http'
import * as url from 'url'

import { route } from './router'
import { status, placepiece, restart, root, getChessboards, ready, leave, update } from './requestHandler'

const handle = {
  '/': root,
  '/api/status': status,
  '/api/placepiece': placepiece,
  '/api/restart': restart,
  '/api/getChessboards': getChessboards,
  '/api/ready': ready,
  '/api/leave': leave,
  '/api/update': update,
}
const sever = http.createServer()
sever.listen(56700, () => {
  console.log('listen 56700')
})
sever.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname
  route(handle, pathname as string, req, res)
})