import React from 'react'

export default function Modal({ isCorrect, turn, solution }) {
  function refreshPage() {
    window.location.reload(false)
  }
  return (
    <div className="modal">
      {isCorrect && (
        <div>
          <h1>You Win!</h1>
          <p className='solution'>{solution}</p>
          <p>You found the solution in {turn} guesses :)</p>
          <button className='replay' onClick={refreshPage}>Play Again</button>
        </div>
      )}
      {!isCorrect && (
        <div>
          <h1>Never mind!</h1>
          <p className='solution'>{solution}</p>
          <p>Better luck next time :)</p>
          <button className='replay' onClick={refreshPage}>Play Again</button>
        </div>
      )}
    </div>
  )
}
