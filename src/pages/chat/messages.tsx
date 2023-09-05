import styles from './styles.module.css';
import { useState, useEffect } from 'react';

interface Message {
    message: string;
    username: string;
    __createdtime__: number;
}

interface MessagesProps {
    socket: any; // Replace 'any' with the actual type of your socket
}

const Messages:React.FC<MessagesProps> = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState<Message[]>([]);

  // Runs whenever a socket event is received from the server
  useEffect(() => {
    socket.on('receive_message', (data:Message) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

	// Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp:number) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      {messagesReceived.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;