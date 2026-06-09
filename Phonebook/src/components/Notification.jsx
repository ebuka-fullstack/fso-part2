const Notification = ({ successMessage, errorMessage }) => {
  if (errorMessage) {
    return <div className="error">{errorMessage}</div>
  }

  if (successMessage) {
    return <div className="success">{successMessage}</div>
  }

  return null
}

export default Notification