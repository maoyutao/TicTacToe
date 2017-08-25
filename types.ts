import * as http from 'http'

export enum TChessman {
  O,
  X,
  N,
}

export enum TOpponent {
  Computer,
  Human,
}

export interface IServerRequest {
  query?: any
  body?: any
}

export type ServerRequest = http.ServerRequest & IServerRequest
