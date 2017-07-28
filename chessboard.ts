type typeOfChessman = 'o'|'x'|' '

let chesspieces:typeOfChessman[] = [];

function init()
{
    for(let i = 1; i<=9; i++)  {
        chesspieces[i] = ' '
    }
}
init()

let chessboard:string = 
`-------------
| ${chesspieces[1]} | ${chesspieces[2]} | ${chesspieces[3]} |
-------------
| ${chesspieces[4]} | ${chesspieces[5]} | ${chesspieces[6]} |
-------------
| ${chesspieces[7]} | ${chesspieces[8]} | ${chesspieces[9]} |
-------------`;

export function outPutChessboard()  {
console.log("当前棋盘如下：")
chessboard = `-------------
| ${chesspieces[1]} | ${chesspieces[2]} | ${chesspieces[3]} |
-------------
| ${chesspieces[4]} | ${chesspieces[5]} | ${chesspieces[6]} |
-------------
| ${chesspieces[7]} | ${chesspieces[8]} | ${chesspieces[9]} |
-------------`;
console.log(chessboard)
}

export function placePiece(num:number,side:typeOfChessman):boolean
{
    if(chesspieces[num] === ' ')  {
        chesspieces[num] = side;
        return true //`${side}方在${num}号位置成功落子`
    }else{
        return false //`${num}号位置不可落子`
    }
}
function isFull():boolean
{
    let i:number = 1;
    for( i =1;i<=9; i++) {
        if(chesspieces[i] === ' ') {
            break;
        }
    }
    if (i === 10) return true
        else return false
}
export function isOver():[boolean,string]
{
   if(isWin('o'))  {
        init()
        return [true,"游戏结束，o方胜利"]
   }else if (isWin('x'))  {
        init()
        return [true,"游戏结束，x方胜利"]
   }else if(isFull())  {
       init()
       return [true, "游戏结束，平局"]
   }
    return [false,"游戏继续"]
}


function isWin(side:typeOfChessman):boolean  {
    for (let i = 0; i <= 2; i += 1) {
        if ((chesspieces[1 + i*3] === side && chesspieces[2 + i*3] === side && chesspieces[3 + i*3] === side) ||
            (chesspieces[1 + i] === side && chesspieces[4 + i] === side && chesspieces[7 + i] === side)) {
            return true;
        }
    }
    if ((chesspieces[1] === side && chesspieces[5] === side && chesspieces[9] === side) ||
        (chesspieces[3] === side && chesspieces[5] === side && chesspieces[7] === side))  {
            return true
        }else {
            return false
        }
}



function getOpponent(now:typeOfChessman):typeOfChessman  {
return (now === 'o')?'x':'o'
}
function getRemainingPieceOfPossiblePlace(possiblePlace:number[]=[0,1,2,3,4,5,6,7,8,9]):number {
    let result:number = 0
    for(let t=1; t<=possiblePlace.length; t++) {
        if(chesspieces[possiblePlace[t]] === ' ') {
            result ++
        }
    }
    return result
}

//计算side走在place处的输赢概率 
function getProbability([win,lose,draw]:number[],place:number,m_side:typeOfChessman,probability:number,side:typeOfChessman,possiblePlace:number[]=[0,1,2,3,4,5,6,7,8,9]):number[]  
{
    if(m_side === side ) {
        probability *= (1/getRemainingPieceOfPossiblePlace())
    } else {
    probability *= (1/getRemainingPieceOfPossiblePlace(possiblePlace))
    }
//       console.log('走下面这步的概率为'+probability)
//       console.log(`在${place}假装走棋`)
        placePiece(place,m_side)
        if(isWin(side)) {
//            console.log("结束了，是赢的")
            chesspieces[place] = ' '
//            console.log("收回"+place+"的棋子")
            return [win+probability, lose, draw]
        }
        else if(isWin(getOpponent(side))) {
//            console.log("结束了，是输的")
            chesspieces[place] = ' '
//           console.log("收回"+place+"的棋子")
          return [win, lose+probability, draw]
        }
        else if(isFull())  {
//            console.log("结束了，平局")
            chesspieces[place] = ' '
//            console.log("收回"+place+"的棋子")
            return [win, lose, draw+probability]
        }
        else  {
//            console.log("没结束"+getOpponent(m_side)+"走棋")
            if(m_side === side)  {
                for(let t=1; t<possiblePlace.length; t++) {
                if(chesspieces[possiblePlace[t]] !== ' ') {
                    continue
                }
                [win,lose,draw] = getProbability([win,lose,draw],possiblePlace[t],getOpponent(m_side),probability,side,possiblePlace)
            }
            }else {
            for(let t=1; t<=9; t++) {
                if(chesspieces[t] !== ' ') {
                    continue
                }
                [win,lose,draw] = getProbability([win,lose,draw],t,getOpponent(m_side),probability,side,possiblePlace)
            }
            }
            chesspieces[place] = ' '
//            console.log("收回"+place+"的棋子")
            return [win,lose,draw]
    }
}
function getProbabilityAccordingToLevel(level:number,[win,lose,draw]:number[],place:number,m_side:typeOfChessman,probability:number,side:typeOfChessman) {
    if (level === 1)
        return getProbability([win,lose,draw],place,m_side,probability,side)
    else return getProbability([win,lose,draw],place,m_side,probability,side,findbestplace(side,level-1)[0])
}

function findbestplace(side:typeOfChessman,level:number):[number[],number,number]
{
    let bestplace:number[] = []
    let maxprobability:number = 0
    let win:number[] = []
    let numberOfBestplace:number = 0
    for(let i=1; i<=9; i++) {
        if(chesspieces[i] !== ' ') {
            continue
        }
        win[i] = getProbabilityAccordingToLevel(level,[0,0,0],i,side,getRemainingPieceOfPossiblePlace(),side)[0]
        if (win[i]>maxprobability) {
            maxprobability = win[i]
        }
    }
    for(let i =1; i<=9;i++) {
        if(win[i] === maxprobability)  {
        bestplace[++numberOfBestplace] = i;
        }
    }
    return [bestplace,maxprobability,numberOfBestplace]
}
export function outputProbability(side:typeOfChessman,level:number):[number[],number]
{
    let bestplace:number[] = []
    let maxprobability:number = 0
    let numberOfBestplace:number = 0
    let win:number[] = []
    let [lose,draw]:number[] = []
    for(let i=1; i<=9; i++) {
        if(chesspieces[i] !== ' ') {
            continue
        }
        [win[i],lose,draw] = getProbabilityAccordingToLevel(level,[0,0,0],i,side,getRemainingPieceOfPossiblePlace(),side)
        console.log(
        `在${i}号位置下棋的胜率为${win[i]},败率为${lose}，平局的概率为${draw}`)
        if (win[i]>maxprobability) {
        maxprobability = win[i]
        }
    }

    for(let i =1; i<=9;i++) {
        if(win[i] === maxprobability)  {
        bestplace[++numberOfBestplace] = i;
        }
    }

    let places:string = ''
    bestplace.forEach((value) => {
        places += `${value} `
    })
    console.log(
    `在${places}位置下棋胜率最大，胜率为${maxprobability}`
    )
    return [bestplace,numberOfBestplace]
}


//chesspieces[1]='o'
//chesspieces[3]='x'
//chesspieces[7]='x'
//chesspieces[6]='o'
//chesspieces[8]='o'
//chesspieces[9]='x'
outputProbability('o',3)
