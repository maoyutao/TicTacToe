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
    for(let i = 0; i<=6; i+=3)  {
        if ((chesspieces[1+i] === side && chesspieces[2+i] === side && chesspieces[3+i] === side) ||
            (chesspieces[1+i] === side && chesspieces[4+i] === side && chesspieces[7+i] === side) )  {
                return true
            }
    }
    if ((chesspieces[1] === side && chesspieces[5] === side && chesspieces[9] === side) ||
        (chesspieces[3] === side && chesspieces[5] === side && chesspieces[7] === side))  {
            return true
        }else {
            return false
        }
}





export function getProbability(side:typeOfChessman)
{

    function change(now:typeOfChessman):typeOfChessman  {
    return (now === 'o')?'x':'o'
    }
    function getRemainingPiece():number  {
        let result:number = 0
        for(let k=1; k<=9; k++)  {
            if(chesspieces[k] === ' ') {
                result ++
            }
        }
        return result
    }

    function s([win,lose,draw]:number[],place:number,m_side:typeOfChessman,probability:number):number[]
    {
        probability *= (1/getRemainingPiece())
//       console.log('走下面这步的概率为'+probability)
//        console.log(`在${place}假装走棋`)
        placePiece(place,m_side)
        if(isWin(side)) {
//            console.log("结束了，是赢的")
            chesspieces[place] = ' '
 //           console.log("收回"+place+"的棋子")
            return [win+probability, lose, draw]
        }
        else if(isWin(theOther)) {
//            console.log("结束了，是输的")
            chesspieces[place] = ' '
 //           console.log("收回"+place+"的棋子")
          return [win, lose+probability, draw]
        }
        else if(isFull())  {
 //           console.log("结束了，平局")
            chesspieces[place] = ' '
 //           console.log("收回"+place+"的棋子")
            return [win, lose, draw+probability]
        }
        else  {
//            console.log("没结束"+change(m_side)+"走棋")
            for(let t=1; t<=9; t++) {
                if(chesspieces[t] !== ' ') {
                    continue
                }
                [win,lose,draw] = s([win,lose,draw],t,change(m_side),probability)
            }
            chesspieces[place] = ' '
 //           console.log("收回"+place+"的棋子")
            return [win,lose,draw]
        }
        
    }

    let theOther:typeOfChessman = change(side)
    let [win,lose,draw]:number[] = []
    for(let i=1; i<=9; i++) {
        if(chesspieces[i] !== ' ') {
            continue
        }
        [win,lose,draw] = s([0,0,0],i,side,getRemainingPiece())
        console.log(
        `在${i}号位置下棋的胜率为${win},败率为${lose}，平局的概率为${draw}`)
    }

}

