import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const success = useSelector(state => state.success)
  if (notification === '') {
    return null;
  }

  if (success) {
    return <div className="success">{notification}</div>;
  } else {
    return <div className="error">{notification}</div>;
  }
};

export default Notification;
