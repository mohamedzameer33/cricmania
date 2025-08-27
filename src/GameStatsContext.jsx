import React, { createContext, useState, useEffect } from 'react';

export const GameStatsContext = createContext();

export const GameStatsProvider = ({ children }) => {
  const [stats, setStats] = useState(() => {
    try {
      const savedStats = localStorage.getItem('gameStats');
      return savedStats
        ? JSON.parse(savedStats)
        : {
            wins: 0,
            losses: 0,
            runs: 0,
            wickets: 0,
            fours: 0,
            sixes: 0,
            dots: 0,
            ballsFaced: 0,
          };
    } catch (error) {
      console.error('Error parsing gameStats:', error);
      return {
        wins: 0,
        losses: 0,
        runs: 0,
        wickets: 0,
        fours: 0,
        sixes: 0,
        dots: 0,
        ballsFaced: 0,
      };
    }
  });

  const [gameState, setGameState] = useState(() => {
    try {
      const savedState = localStorage.getItem('gameState');
      return savedState
        ? JSON.parse(savedState)
        : {
            Target: null,
            Run: 0,
            Wicket: 0,
            Overs: 0,
            CurrentBall: 'Start',
            BallBackground: 'white',
            GameOver: false,
            GameStatus: null,
            GameStarted: false,
          };
    } catch (error) {
      console.error('Error parsing gameState:', error);
      return {
        Target: null,
        Run: 0,
        Wicket: 0,
        Overs: 0,
        CurrentBall: 'Start',
        BallBackground: 'white',
        GameOver: false,
        GameStatus: null,
        GameStarted: false,
      };
    }
  });

  const [superOverState, setSuperOverState] = useState(() => {
    try {
      const savedState = localStorage.getItem('superOverState');
      return savedState
        ? JSON.parse(savedState)
        : {
            phase: 'toss',
            tossChoice: null,
            tossResult: null,
            tossWon: null, // Added to track toss win/loss
            userAction: null,
            bowlerType: null,
            runs: 0,
            wickets: 0,
            balls: 0,
            target: null,
            opponentRuns: 0,
            opponentWickets: 0,
            currentBall: 'Start',
            ballBackground: 'white',
            gameOver: false,
            gameStatus: null,
          };
    } catch (error) {
      console.error('Error parsing superOverState:', error);
      return {
        phase: 'toss',
        tossChoice: null,
        tossResult: null,
        tossWon: null,
        userAction: null,
        bowlerType: null,
        runs: 0,
        wickets: 0,
        balls: 0,
        target: null,
        opponentRuns: 0,
        opponentWickets: 0,
        currentBall: 'Start',
        ballBackground: 'white',
        gameOver: false,
        gameStatus: null,
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gameStats', JSON.stringify(stats));
      console.log('Stats saved:', stats);
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('gameState', JSON.stringify(gameState));
      console.log('Game state saved:', gameState);
    } catch (error) {
      console.error('Error saving gameState:', error);
    }
  }, [gameState]);

  useEffect(() => {
    try {
      localStorage.setItem('superOverState', JSON.stringify(superOverState));
      console.log('Super Over state saved:', superOverState);
    } catch (error) {
      console.error('Error saving superOverState:', error);
    }
  }, [superOverState]);

  const updateStats = (updates) => {
    setStats((prev) => {
      const newStats = { ...prev };
      Object.keys(updates).forEach((key) => {
        if (typeof prev[key] === 'number') {
          newStats[key] = (prev[key] || 0) + (updates[key] || 0);
        }
      });
      return newStats;
    });
  };

  const resetStats = () => {
    setStats({
      wins: 0,
      losses: 0,
      runs: 0,
      wickets: 0,
      fours: 0,
      sixes: 0,
      dots: 0,
      ballsFaced: 0,
    });
  };

  const updateGameState = (updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  const resetGameState = () => {
    setGameState({
      Target: Math.floor(Math.random() * (220 - 170 + 1)) + 170,
      Run: 0,
      Wicket: 0,
      Overs: 0,
      CurrentBall: 'Start',
      BallBackground: 'white',
      GameOver: false,
      GameStatus: null,
      GameStarted: false,
    });
  };

  const updateSuperOverState = (updates) => {
    setSuperOverState((prev) => ({ ...prev, ...updates }));
  };

  const resetSuperOverState = () => {
    setSuperOverState({
      phase: 'toss',
      tossChoice: null,
      tossResult: null,
      tossWon: null,
      userAction: null,
      bowlerType: null,
      runs: 0,
      wickets: 0,
      balls: 0,
      target: null,
      opponentRuns: 0,
      opponentWickets: 0,
      currentBall: 'Start',
      ballBackground: 'white',
      gameOver: false,
      gameStatus: null,
    });
  };

  return (
    <GameStatsContext.Provider
      value={{
        stats,
        updateStats,
        resetStats,
        gameState,
        updateGameState,
        resetGameState,
        superOverState,
        updateSuperOverState,
        resetSuperOverState,
      }}
    >
      {children}
    </GameStatsContext.Provider>
  );
};