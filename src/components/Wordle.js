import React, { useEffect, useState } from 'react'
import useWordle from '../hooks/useWordle'
import Grid from './Grid'
import Keypad from './Keypad'
import Modal from './Modal'

export default function Wordle({ solution, allSolutions }) {
  const [gameMode, setGameMode] = useState('free')  // free or restricted (every guess has to be a valid word)
  const { currentGuess, handleKeyup, guesses, isCorrect, turn, usedKeys } = useWordle(solution, allSolutions, gameMode)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)

    if (isCorrect) {
      setTimeout(() => setShowModal(true), 2000)
      window.removeEventListener('keyup', handleKeyup)
    }

    if (turn > 5) {
      setTimeout(() => setShowModal(true), 2000)
      window.removeEventListener('keyup', handleKeyup)
    }

    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup, isCorrect, turn])

  const onOptionChange = e => {
    if(turn === 0) {
      setGameMode(e.target.value)
    }
    else {
      console.log('cannot change game mode during a game')
    }
  }

  return (
    <div>
      <div className='mode'>
        Game Mode:
        <input
          type='radio' name='gameMode' value='free'
          checked={gameMode === 'free'} onChange={onOptionChange}
        /><label>Free</label>
        <input
          type='radio' name='gameMode' value='restricted'
          checked={gameMode === 'restricted'} onChange={onOptionChange}
        /><label>Restricted</label>
        <input
          type='radio' name='gameMode' value='more restricted'
          checked={gameMode === 'more restricted'} onChange={onOptionChange}
        /><label>More Restricted</label>
        {(gameMode !== 'free') && <div>All the words you guess must be present in the database.</div>}
        {(gameMode === 'more restricted') && <div>You may not make an impossible guess given your history.</div>}
      </div>
      <Grid currentGuess={currentGuess} guesses={guesses} turn={turn}/>
      <Keypad usedKeys={usedKeys}/>
      {showModal && <Modal isCorrect={isCorrect} turn={turn} solution={solution}/>}
    </div>
  )
}
