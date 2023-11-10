import { useState } from 'react'

const useWordle = (solution, allSolutions, gameMode) => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState('')
  const [guesses, setGuesses] = useState([...Array(6)]) // each guess is an array
  const [history, setHistory] = useState([]) // each guess is a string
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState({}) // {a: 'green', b: 'yellow', c: 'grey'}

  // format a guess into an array of letter objects
  // e.g. [{key: 'a', color: 'yellow'}]
  const formatGuess = () => {
    let solutionArray = [...solution]
    let formattedGuess = [...currentGuess].map((l) => {
      return {key: l, color: 'grey'}
    })
    // find any green letters
    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = 'green'
        solutionArray[i] = null
      }
    })
    // find any yellow colors
    formattedGuess.forEach((l, i) => {
      if (l.color !== 'green' && solutionArray.includes(l.key)) {
        formattedGuess[i].color = 'yellow'
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }

  // add a new guess to the guesses state
  // update the isCorrect state if the guess is correct
  // add one to the turn state
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === solution) {
      setIsCorrect(true)
    }
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses]
      newGuesses[turn] = formattedGuess
      return newGuesses
    })
    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess]
    })
    setTurn((prevTurn) => {
      return prevTurn + 1
    })
    setUsedKeys((prevUsedKeys) => {
      let newKeys = {...prevUsedKeys}

      formattedGuess.forEach((l) => {
        const currentColor = newKeys[l.key]
        if (l.color === 'green') {
          newKeys[l.key] = 'green'
          return
        }
        if (l.color === 'yellow' && currentColor !== 'green') {
          newKeys[l.key] = 'yellow'
          return
        }
        if (l.color === 'grey' && currentColor !== 'green' && currentColor !== 'yellow') {
          newKeys[l.key] = 'grey'
          return
        }
      })

      return newKeys
    })
    setCurrentGuess('')
  }

  // check if a word is possible given history
  const possibleGuess = (word) => {
    return guesses.slice(0, turn).every((guess) => {
      let wordArray = word.split('')
      return guess.every((l, i) => {
        if (l.color === 'green') {
          if (word[i] !== l.key) {
            console.log('word does not include a known green character')
            return false
          }
          wordArray[i] = null
        }
        if (l.color === 'yellow') {
          if (word[i] === l.key) {
            console.log('a known yellow character is misplaced again')
            return false
          }
          if (!wordArray.includes(l.key)) {
            console.log('word does not include a known yellow character')
            return false
          }
          wordArray[wordArray.indexOf(l.key)] = null
        }
        return true
      }) && guess.every((l, i) => {
        if (l.color === 'grey' && wordArray.includes(l.key)) {
          console.log('word includes impossible character')
          return false
        }
        return true
      })
    })
  }

  // handle keyup event & track current guess
  // if user presses enter, add the new guess
  const handleKeyup = ({ key }) => {
    // regex: only accepts A-Z a-z
    if (key === 'Enter') {
      // only add guess if turn is less than 5
      if (turn > 5) {
        console.log('you used all your guesses')
        return
      }
      // do not allow duplicate words
      if (history.includes(currentGuess)) {
        console.log('you already tried that word')
        return
      }
      // check word is 5 chars long
      if (currentGuess.length !== 5) {
        console.log('word must be 5 chars long')
        return
      }
      // if game mode is restricted, check if word is in dictionary
      if (gameMode !== 'free' && !allSolutions.includes(currentGuess)) {
        console.log('word does not exist in database')
        return
      }
      // if game mode is more restricted, check if word contradicts history
      if (gameMode === 'more restricted' && !possibleGuess(currentGuess)) {
        console.log('word is impossible given history')
        return
      }
      const formatted = formatGuess()
      addNewGuess(formatted)
    }
    if (key === 'Backspace') {
      setCurrentGuess((prev) => {
        return prev.slice(0, -1)
      })
      return
    }
    if (/^[A-Za-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => {
          return prev + key
        })
      }
    } 
  }

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup }
}

export default useWordle