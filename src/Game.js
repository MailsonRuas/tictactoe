import React, { Component } from 'react';
import {IntlProvider} from 'react-intl';
import {FormattedMessage} from 'react-intl';
import messages from './messages';

function Square(props){
  return(
    <button className={"square stateIs"+props.value} onClick={()=>props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends Component{
  constructor(props){
    super(props);
    this.state={
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  renderSquare(i){
    return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />;
  }
  render(){
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i){
    const history=this.state.history.slice(0,this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if(calculateWinner(squares)||squares[i]){
      return;
    }
    squares[i]=this.state.xIsNext?'X':'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step){
    if(step>=0){
      this.setState({
        stepNumber: step,
        xIsNext: (step%2)===0,
      });
    }else return;
  }
  render(){
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner=calculateWinner(current.squares);
    let status;
    if(winner){
      status=<FormattedMessage id="winner" defaultMessage="Winner: {x}" values={{x: winner}} />;
    }else{
      status=<FormattedMessage id="next" defaultMessage="Next player: {x}" values={{x: this.state.xIsNext?'X':'O'}} />;
    }
    return (
      <IntlProvider locale={navigator.language} messages={messages[navigator.language]}>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i)=>this.handleClick(i)} />
          </div>
          <div className="status">
            <p>{status}</p>
            <button onClick={()=>{this.jumpTo(0)}}>
              <FormattedMessage id="restart" defaultMessage="Restart" />
            </button>
            <button onClick={()=>this.jumpTo(this.state.stepNumber-1)}>
              <FormattedMessage id="undo" defaultMessage="Undo" />
            </button>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

function calculateWinner(squares){
  const lines=[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i=0;i<lines.length;i++){
    const [a,b,c]=lines[i];
    if(squares[a]&&squares[a]===squares[b]&&squares[a]===squares[c]){
      return squares[a];
    }
  }
  return null;
}

// ========================================

export default Game;
