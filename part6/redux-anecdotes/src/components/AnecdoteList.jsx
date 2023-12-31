import { useDispatch, useSelector } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter(anecdote => 
      anecdote.content.includes(filter)).sort((a,b) => b.votes - a.votes)
  })

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote 
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(incrementVote(anecdote))
            dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
          }}
        />
      )}
    </div>
  )
}

export default AnecdoteList