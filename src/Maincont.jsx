import React, { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GameStatsContext } from './GameStatsContext';

const Maincont = () => {
  const { stats, updateStats, gameState, updateGameState, resetGameState, loading } =
    useContext(GameStatsContext);

  const {
    Target,
    Run,
    Wicket,
    Overs,
    CurrentBallRun,
    BallBackground,
    GameOver,
    GameStatus,
    GameStarted,
  } = gameState;

  // Initialize target
  useEffect(() => {
    if (!Target) {
      updateGameState({ Target: Math.floor(Math.random() * (220 - 170 + 1)) + 170 });
    }
  }, [Target, updateGameState]);

  // Check game status only when game is active
  useEffect(() => {
    if (GameStarted && Target && !GameOver) {
      checkGameStatus();
    }
  }, [GameStarted, Target, Run, Wicket, Overs, GameOver]);

  const checkGameStatus = () => {
    if (!Target || GameOver) return;
    if (Run >= Target) {
      updateGameState({
        GameStatus: `You Won by ${10 - Wicket} Wickets`,
        GameOver: true,
      });
      updateStats({ wins: 1 });
    } else if (Wicket >= 10 || Overs >= 20) {
      updateGameState({
        GameStatus: `Game Over! You Lost By ${Target - Run} Runs!`,
        GameOver: true,
      });
      updateStats({ losses: 1 });
    }
  };

  function dot() {
    if (GameOver) return;
    updateGameState({ GameStarted: true });
    const newRun = Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2;
    const isRunout = Math.random() < 0.02;
    const isWide = Math.random() < 0.03;

    updateGameState({
      Run: Run + newRun,
      CurrentBallRun: newRun,
      BallBackground: 'grey',
    });

    if (isRunout) {
      updateGameState({
        Wicket: Wicket + 1,
        CurrentBallRun: 'Run Out',
        BallBackground: 'var(--red)',
      });
      updateStats({ wickets: 1, ballsFaced: 1 });
    } else if (isWide) {
      updateGameState({
        Run: Run + 1,
        CurrentBallRun: 'Wide',
        BallBackground: 'Yellow',
        Overs: Overs - 0.1,
      });
      updateStats({ runs: 1 });
    } else {
      updateStats({
        runs: newRun,
        ballsFaced: 1,
        dots: newRun === 0 ? 1 : 0,
      });
    }

    updateGameState({
      Overs: (() => {
        const integerPart = Math.floor(Overs);
        const decimalPart = Overs - integerPart + 0.1;
        return decimalPart >= 0.6
          ? parseFloat((integerPart + 1).toFixed(1))
          : parseFloat((integerPart + decimalPart).toFixed(1));
      })(),
    });
  }

  function loft() {
    if (GameOver) return;
    updateGameState({ GameStarted: true });
    const isOut = Math.random() < 0.1;

    if (isOut) {
      updateGameState({
        Wicket: Wicket + 1,
        CurrentBallRun: 'OUT',
        BallBackground: 'var(--red)',
      });
      updateStats({ wickets: 1, ballsFaced: 1 });
    } else {
      const isSix = Math.random() < 0.2;
      const isFour = !isSix && Math.random() < 0.3;
      const isSingle = !isSix && !isFour && Math.random() < 0.4;
      const isDot = !isSix && !isFour && !isSingle;

      if (isSix) {
        updateGameState({
          Run: Run + 6,
          CurrentBallRun: 6,
          BallBackground: 'var(--grn)',
        });
        updateStats({ runs: 6, sixes: 1, ballsFaced: 1 });
      } else if (isFour) {
        updateGameState({
          Run: Run + 4,
          CurrentBallRun: 4,
          BallBackground: 'var(--blue)',
        });
        updateStats({ runs: 4, fours: 1, ballsFaced: 1 });
      } else if (isSingle) {
        updateGameState({
          Run: Run + 1,
          CurrentBallRun: 1,
          BallBackground: 'grey',
        });
        updateStats({ runs: 1, ballsFaced: 1 });
      } else if (isDot) {
        updateGameState({
          CurrentBallRun: 0,
          BallBackground: 'grey',
        });
        updateStats({ dots: 1, ballsFaced: 1 });
      }
    }

    updateGameState({
      Overs: (() => {
        const integerPart = Math.floor(Overs);
        const decimalPart = Overs - integerPart + 0.1;
        return decimalPart >= 0.6
          ? parseFloat((integerPart + 1).toFixed(1))
          : parseFloat((integerPart + decimalPart).toFixed(1));
      })(),
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game" style={{position: 'relative',top:"50px"}}>
      <h1 className="text-center mb-4 text-dark" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 'bold' }}>
        Chase The Score
      </h1>
      <h3 className="text-center mb-5 text-dark" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
        Chase {Target || 'Loading...'} Runs in 20 overs
      </h3>
      <div className="scoreboard position-relative text-center" style={{ marginBottom: '4rem' }}>
        <h2 className="mb-4 text-dark" style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}>
          {Run}/{Wicket} - {Overs}
        </h2>
        <div
          className="currentrun mx-auto"
          style={{
            height: 'clamp(80px, 20vw, 140px)',
            width: 'clamp(80px, 20vw, 140px)',
            borderRadius: '50%',
            background: BallBackground,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 'clamp(1.5rem, 6vw, 3rem)',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            color: BallBackground === 'white' ? 'green' : 'white',
          }}
        >
          {CurrentBallRun}
        </div>
      </div>
      {GameOver && (
        <div
          className="text-center mb-4"
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            color: GameStatus.includes('Won') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {GameStatus}
          <br />
          <button
            onClick={resetGameState}
            style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer',border: 'none', background: 'none' }}
          >
            <ion-icon name="refresh"></ion-icon>
          </button>
        </div>
      )}
      {!GameOver && (
        <div className="buttons d-flex justify-content-center gap-3">
          <button
            onClick={dot}
            className="btn"
            style={{
              background: 'var(--grn)',
              color: 'white',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              border: '3px solid #00cc88',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0 6px 8px rgba(0,0,0,0.3)',
              minWidth: '120px',
            }}
          >
            Stroke
          </button>
          <button
            onClick={loft}
            className="btn"
            style={{
              background: 'var(--red)',
              color: 'white',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              border: '3px solid #ff4500',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0 6px 8px rgba(0,0,0,0.3)',
              minWidth: '120px',
            }}
          >
            Loft
          </button>
        </div>
      )}
    </div>
  );
};

export default Maincont;