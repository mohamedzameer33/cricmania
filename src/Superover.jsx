import React, { useContext, useState } from 'react';
import "./Superover.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameStatsContext } from './GameStatsContext';

const Superover = () => {
  const { stats, updateStats, superOverState, updateSuperOverState, resetSuperOverState } = useContext(GameStatsContext);

  const {
    phase,
    tossChoice,
    tossResult,
    userAction,
    bowlerType,
    runs,
    wickets,
    balls,
    target,
    opponentRuns,
    opponentWickets,
    currentBall,
    ballBackground,
    gameOver,
    gameStatus,
  } = superOverState;

  const [usedSpecialBall, setUsedSpecialBall] = useState(null); // Track Yorker/Googly

  // Generate random target (15–25)
  const generateTarget = () => Math.floor(Math.random() * (15 - 7 + 1)) + 7;

  // Handle toss (Chasing/Defending)
  const handleToss = (choice) => {
    updateSuperOverState({
    
      userAction: choice === 'chasing' ? 'chase' : 'defend',
      target: generateTarget(),
      phase: 'tossResult',
    });
  };

  // Proceed after toss
  const proceedAfterToss = () => {
    updateSuperOverState({
      phase: userAction === 'chase' ? 'batting' : 'chooseBowler',
    });
  };

  // Handle bowler choice
  const handleBowlerChoice = (type) => {
    updateSuperOverState({
      bowlerType: type,
      phase: 'bowling',
    });
  };

  // Batting logic (Chasing)
  const handleBat = (shotType) => {
    if (gameOver || balls >= 6 || wickets >= 2 || runs >= target) return;

    const isWide = Math.random() < 0.05;
    if (isWide) {
      updateSuperOverState({
        runs: runs + 1,
        currentBall: 'Wide',
        ballBackground: 'yellow',
      });
      updateStats({ runs: 1 });
      if (runs + 1 >= target) {
        updateSuperOverState({
          phase: 'result',
          gameOver: true,
          gameStatus: 'You Won the Super Over!',
        });
        updateStats({ wins: 1 });
      }
      return;
    }

    let outcome;
    if (shotType === 'stroke') {
      outcome = Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2;
    } else {
      const isOut = Math.random() < 0.1;
      outcome = isOut ? 'wicket' : Math.random() < 0.2 ? 6 : Math.random() < 0.3 ? 4 : Math.random() < 0.4 ? 1 : 0;
    }

    let newRuns = runs;
    let newWickets = wickets;
    let newStats = {};
    let ballDisplay = outcome;
    let background = 'grey';

    if (outcome === 'wicket') {
      newWickets += 1;
      ballDisplay = 'OUT';
      background = 'var(--red)';
      newStats.wickets = 1;
      newStats.ballsFaced = 1;
    } else {
      newRuns += outcome;
      newStats.runs = outcome;
      newStats.ballsFaced = 1;
      if (outcome === 0) newStats.dots = 1;
      if (outcome === 4) newStats.fours = 1;
      if (outcome === 6) newStats.sixes = 1;
      background = outcome === 4 ? 'var(--blue)' : outcome === 6 ? 'var(--grn)' : 'grey';
    }

    updateSuperOverState({
      runs: newRuns,
      wickets: newWickets,
      balls: balls + 1,
      currentBall: ballDisplay,
      ballBackground: background,
    });

    updateStats(newStats);

    if (newRuns >= target) {
      updateSuperOverState({
        phase: 'result',
        gameOver: true,
        gameStatus: 'You Won the Super Over!',
      });
      updateStats({ wins: 1 });
    } else if (balls + 1 >= 6 || newWickets >= 2) {
      updateSuperOverState({
        phase: 'result',
        gameOver: true,
        gameStatus: 'You Lost the Super Over!',
      });
      updateStats({ losses: 1 });
    }
  };

  // Bowling logic (Defending)
  const handleBowl = (ballType) => {
    if (gameOver || balls >= 6 || opponentWickets >= 2 || opponentRuns >= target) return;

    if ((ballType === 'yorker' || ballType === 'googly') && usedSpecialBall) {
      alert(`You used special ball ${usedSpecialBall}!`);
      return;
    }

    const isWide = Math.random() < 0.05;
    if (isWide) {
      updateSuperOverState({
        opponentRuns: opponentRuns + 1,
        currentBall: 'Wide',
        ballBackground: 'yellow',
      });
      updateStats({ runs: 1 });
      if (opponentRuns + 1 >= target) {
        updateSuperOverState({
          phase: 'result',
          gameOver: true,
          gameStatus: 'You Lost the Super Over!',
        });
        updateStats({ losses: 1 });
      }
      return;
    }

    let outcome;
    if (ballType === 'yorker' && bowlerType === 'fast') {
      outcome = 'wicket';
      setUsedSpecialBall('Yorker');
    } else if (ballType === 'googly' && bowlerType === 'spin') {
      outcome = 'wicket';
      setUsedSpecialBall('Googly');
    } else if (bowlerType === 'fast') {
      switch (ballType) {
        case 'slow':
          outcome = Math.random() < 0.15 ? 'wicket' : Math.random() < 0.4 ? 4 : Math.random() < 0.3 ? 1 : Math.random() < 0.1 ? 6 : 2;
          break;
        case 'short':
          outcome = Math.random() < 0.1 ? 'wicket' : Math.random() < 0.2 ? 0 : Math.random() < 0.3 ? 4 : Math.random() < 0.3 ? 6 : 4;
          break;
        case 'full':
          outcome = Math.random() < 0.05 ? 'wicket' : Math.random() < 0.2 ? 0 : Math.random() < 0.3 ? 4 : Math.random() < 0.8 ? 6 : 4;
          const isNoball = Math.random() < 0.5;
          if (isNoball) {
            updateSuperOverState({
              opponentRuns: opponentRuns + 1,
              currentBall: 'No Ball',
              ballBackground: 'orange',
             prevball: balls -1,
            });
            updateStats({ runs: 1 });
            if (opponentRuns + 1 >= target) {
              updateSuperOverState({
                phase: 'result',
                gameOver: true,
                gameStatus: 'You Lost the Super Over!',
              });
              updateStats({ losses: 1 });
            }
            return;
            
          }
          break;
        default:
          outcome = 0;
      }
    } else {
      switch (ballType) {
        case 'legspin':
          outcome = Math.random() < 0.15 ? 'wicket' : Math.random() < 0.3 ? 6 : Math.random() < 0.3 ? 4 : Math.random() < 0.15 ? 0 : 2;
          break;
        case 'carrom':
          outcome = Math.random() < 0.05 ? 'wicket' : Math.random() < 0.3 ? 6 : Math.random() < 0.3 ? 1 : Math.random() < 0.1 ? 4 : 2;
          break;
        case 'topspin':
          outcome = Math.random() < 0.1 ? 'wicket' : Math.random() < 0.3 ? 6 : Math.random() < 0.3 ? 2 : Math.random() < 0.35 ? 4 : 6;
          break;
        default:
          outcome = 0;
      }
    }

    let newRuns = opponentRuns;
    let newWickets = opponentWickets;
    let newStats = {};
    let ballDisplay = outcome;
    let background = 'grey';

    if (outcome === 'wicket') {
      newWickets += 1;
      ballDisplay = 'OUT';
      background = 'var(--red)';
      newStats.wickets = 1;
      newStats.ballsFaced = 1;
    } else {
      newRuns += outcome;
      newStats.runs = outcome;
      newStats.ballsFaced = 1;
      if (outcome === 0) newStats.dots = 1;
      if (outcome === 4) newStats.fours = 1;
      if (outcome === 6) newStats.sixes = 1;
      background = outcome === 4 ? 'var(--blue)' : outcome === 6 ? 'var(--grn)' : 'grey';
    }

    updateSuperOverState({
      opponentRuns: newRuns,
      opponentWickets: newWickets,
      balls: balls + 1,
      currentBall: ballDisplay,
      ballBackground: background,
    });

    updateStats(newStats);

    if (newWickets >= 2) {
      updateSuperOverState({
        phase: 'result',
        gameOver: true,
        gameStatus: 'You Won the Super Over!',
      });
      updateStats({ wins: 1 });
    } else if (newRuns >= target) {
      updateSuperOverState({
        phase: 'result',
        gameOver: true,
        gameStatus: 'You Lost the Super Over!',
      });
      updateStats({ losses: 1 });
    } else if (balls + 1 >= 6) {
      updateSuperOverState({
        phase: 'result',
        gameOver: true,
        gameStatus: 'You Won the Super Over!',
      });
      updateStats({ wins: 1 });
    }
  };

  // Reset special ball on new game
  const handleReset = () => {
    setUsedSpecialBall(null);
    resetSuperOverState();
  };

  return (
    <div class="supovr">
    <div
      className="game d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ textAlign: 'center', padding: '1rem' }}
    >
      <h1 className="mb-4 text-dark" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold' }}>
        Super Over Challenge
      </h1>

      {phase === 'toss' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>Choose Chasing or Defending</h3>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => handleToss('chasing')}
              className="btn"
              style={{
                background: 'var(--blue)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Chasing
            </button>
            <button
              onClick={() => handleToss('defending')}
              className="btn"
              style={{
                background: 'var(--blue)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Defending
            </button>
          </div>
        </div>
      )}

      {phase === 'tossResult' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            You chose {tossResult}! Target: {target} runs
          </h3>
          <button
            onClick={proceedAfterToss}
            className="btn"
            style={{
              background: 'var(--blue)',
              color: 'white',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
          >
            Continue
          </button>
        </div>
      )}

      {phase === 'chooseBowler' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>Choose Bowler Type</h3>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => handleBowlerChoice('fast')}
              className="btn"
              style={{
                background: 'var(--grn)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Fast Bowler
            </button>
            <button
              onClick={() => handleBowlerChoice('spin')}
              className="btn"
              style={{
                background: 'var(--red)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Spinner
            </button>
          </div>
        </div>
      )}

      {phase === 'bowling' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            Bowling: {opponentRuns}/{opponentWickets} ({balls}/6 balls) - Defend: {target} runs
          </h3>
          <div
            className="currentrun mb-4"
            style={{
              height: 'clamp(80px, 20vw, 140px)',
              width: 'clamp(80px, 20vw, 140px)',
              borderRadius: '50%',
              background: ballBackground,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'clamp(1.5rem, 6vw, 3rem)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              color: ballBackground === 'white' ? 'green' : 'white',
            }}
          >
            {currentBall}
          </div>
          {usedSpecialBall && (
            <p style={{ color: 'red', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
              You used special ball {usedSpecialBall}!
            </p>
          )}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {bowlerType === 'fast' ? (
              <>
                <button
                  onClick={() => handleBowl('yorker')}
                  disabled={usedSpecialBall === 'Yorker'}
                  className="btn"
                  style={{
                    background: usedSpecialBall === 'Yorker' ? 'grey' : 'var(--blue)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Yorker
                </button>
                <button
                  onClick={() => handleBowl('slow')}
                  className="btn"
                  style={{
                    background: 'var(--blue)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Slow Ball
                </button>
                <button
                  onClick={() => handleBowl('short')}
                  className="btn"
                  style={{
                    background: 'var(--blue)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Short Ball
                </button>
                <button
                  onClick={() => handleBowl('full')}
                  className="btn"
                  style={{
                    background: 'var(--blue)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Full Toss
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleBowl('legspin')}
                  className="btn"
                  style={{
                    background: 'var(--grn)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Leg Spin
                </button>
                <button
                  onClick={() => handleBowl('googly')}
                  disabled={usedSpecialBall === 'Googly'}
                  className="btn"
                  style={{
                    background: usedSpecialBall === 'Googly' ? 'grey' : 'var(--grn)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Googly
                </button>
                <button
                  onClick={() => handleBowl('carrom')}
                  className="btn"
                  style={{
                    background: 'var(--grn)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Carrom Ball
                </button>
                <button
                  onClick={() => handleBowl('topspin')}
                  className="btn"
                  style={{
                    background: 'var(--grn)',
                    color: 'white',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    padding: '8px 20px',
                    borderRadius: '8px',
                  }}
                >
                  Top Spin
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {phase === 'batting' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
          <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            Batting: {runs}/{wickets} ({balls}/6 balls) - Target: {target}
          </h3>
          <div
            className="currentrun mb-4"
            style={{
              height: 'clamp(80px, 20vw, 140px)',
              width: 'clamp(80px, 20vw, 140px)',
              borderRadius: '50%',
              background: ballBackground,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'clamp(1.5rem, 6vw, 3rem)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              color: ballBackground === 'white' ? 'green' : 'white',
            }}
          >
            {currentBall}
          </div>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => handleBat('stroke')}
              className="btn"
              style={{
                background: 'var(--grn)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Stroke
            </button>
            <button
              onClick={() => handleBat('loft')}
              className="btn"
              style={{
                background: 'var(--red)',
                color: 'white',
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                padding: '10px 20px',
                borderRadius: '8px',
              }}
            >
              Loft
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="phase-container d-flex flex-column align-items-center gap-3">
            <div
            className="currentrun mb-4"
            style={{
              height: 'clamp(80px, 20vw, 140px)',
              width: 'clamp(80px, 20vw, 140px)',
              borderRadius: '50%',
              background: ballBackground,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 'clamp(1.5rem, 6vw, 3rem)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              color: ballBackground === 'white' ? 'green' : 'white',
            }}
          >
            {currentBall}
          </div>
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              color: gameStatus.includes('Won') ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {gameStatus}
          </h3>
          <p>
            Opponent Score: {userAction === 'chase' ? runs : opponentRuns}/{userAction === 'chase' ? wickets : opponentWickets} ({balls}/6)
          </p>
          <p>
            Your Score: {userAction === 'chase' ? target : target-1}/{userAction === 'chase' ? '0' : 1} ({6}/6)
          </p>
          <button
            onClick={handleReset}
            className="btn"
            style={{
              background: 'var(--blue)',
              color: 'white',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              padding: '10px 20px',
              borderRadius: '8px',
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Superover;