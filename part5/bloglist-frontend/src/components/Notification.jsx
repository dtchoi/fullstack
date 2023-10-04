const Notification = ({ message, successful }) => {
    if (message === null) {
      return null
    }

    if (successful) {
      return (
        <div className='success'>
          {message}
        </div>
      )
    } else {
      return (
        <div className='error'>
          {message}
        </div>
      )
    }

}

export default Notification