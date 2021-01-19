import React from 'react';
import socket from '../socket';
import classNames from 'classnames';

function Chat({ users, messages, onAddMessage, roomId, userName }) {

  const [message, setMessage] = React.useState('');
  const messageRef = React.useRef();
  
  
  const onSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      text: message,
      userName,
      roomId,
    });
    onAddMessage({
      text: message,
      userName,
    })
    setMessage('')
  }
  React.useEffect(() => {
    messageRef.current.scrollTo(0, 99999);
  }, [messages])
  console.log('users: ',users, '|','message.userName: ', messages.userName, '|', 'userName', userName)
  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name, index) => <li key={index}>{name}</li>)}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messageRef} className={ classNames( "messages", {
              'from': userName !== messages.userName,
            }) }>
          {messages.map((messages, index) => (
            <div className={ classNames( "message", {
              'from-me': userName === messages.userName,
              'from-them': userName !== messages.userName,
            }) } key={index} >
              <div>
              <p>{messages.text}</p>
              <div>
                <span> {messages.userName == userName ? 'You' : `User Name ${messages.userName}` }</span>
              </div>
              </div>
            </div>))}
        </div>
        <form>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            value={message}>

          </textarea>
          <button onClick={message && onSendMessage} type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;