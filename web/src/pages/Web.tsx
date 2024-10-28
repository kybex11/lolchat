import { checkLogin, getPassword, getUsername } from '../cookies';
import '../styles/index.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import FriendsComponent from './components/friends';
import FriendRequestsComponent from './components/requests';
import '../styles/chat.css';

interface FormData {
  username: string;
  password: string;
}

interface ResponseData {
  success: boolean;
  message: string;
}

interface ResponseDataTwo {
  success: boolean;
  friends: any;
}

interface MessageData {
  data: any;
}

interface MessageStruct {
  content: string; // Поле содержимого сообщения
  sender: string;
}

interface InputMessageProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  sendMessage: () => void;
}
export default function Web() {
  const [isFriends, setIsFriends] = useState<boolean>(false);
  const [isFriendRequests, setIsFriendRequests] = useState<boolean>(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [data, setData] = useState<ResponseData | null>(null);
  const [messages, setMessages] = useState<MessageStruct[]>([]);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [currFriend, setFriend] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>(''); // Состояние для текста в поле ввода

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const InputMessage: React.FC<InputMessageProps> = ({ messageInput, setMessageInput, sendMessage }) => {
    
  
    // Восстанавливаем фокус на поле ввода только при первом открытии чата
    useEffect(() => {
      if (messageInputRef.current) {
        // Сохраняем текущее состояние скролла
        const messageContainer = messageContainerRef.current;
        const { scrollTop, scrollHeight, clientHeight } = messageContainer!;
        const isAtBottom = scrollHeight - scrollTop === clientHeight;
  
        // Устанавливаем фокус на поле ввода
        messageInputRef.current.focus();
  
        // Если пользователь был внизу, прокручиваем обратно
        if (isAtBottom) {
            messageContainer!.scrollTop = messageContainer!.scrollHeight;
        }
      }
    }, [showChat]); // Зависимость от showChat
  
    return (
      <div>
        <input
          type="text"
          ref={messageInputRef}
          placeholder="Enter message here"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    );
  };

  const username = getUsername();
  const _username = getUsername() || '';
  const _password = getPassword() || '';

  // Функция для обновления списка друзей
  const updateFriends = useCallback(() => {
    fetch('http://localhost:3001/getFriends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
      .then((response: Response) => response.json())
      .then((data: ResponseDataTwo) => {
        if (data.success) {
          setFriends(data.friends);
        } else {
          console.error("Internal error");
        }
      })
      .catch(error => console.error('Error fetching friends:', error));
  }, [username]);

  // Эффект для проверки логина и получения списка друзей
  useEffect(() => {
    if (checkLogin()) {
      const formData: FormData = {
        username: _username,
        password: _password,
      };

      fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response: Response) => response.json())
        .then((data: ResponseData) => {
          setData(data);
          if (data.success) {
            updateFriends(); // Обновляем список друзей после успешного логина
          }
        })
        .catch((error: Error) => console.error(error));
    } else {
      window.location.href = "/router";
    }
  }, [_username, _password, updateFriends]);

  // Функция для открытия чата с другом
  const openDM = useCallback((friend: string) => {
    fetch('http://localhost:3001/getMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userone: username, usertwo: friend }),
    })
      .then((response: Response) => response.json())
      .then((data: MessageData) => {
        if (data.data === "DM not found") {
          // Создаем новый чат, если его не существует
          fetch('http://localhost:3001/newdm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userone: username, usertwo: friend }),
          })
            .then((response: Response) => response.json())
            .then((data: ResponseData) => {
              if (data.success) {
                setShowChat(true);
                setFriend(friend);
              }
            });
        } else {
          setShowChat(true);
          setMessages(data.data);
          setFriend(friend);
        }
      })
      .catch((error: Error) => console.error(error));
  }, [username]);

  // Функция для отправки сообщения
  const sendMessage = () => {
    if (!messageInput) return;

    const messageInputRefCurrent = messageInputRef.current;

    if (messageInputRefCurrent)
      setMessageInput(messageInputRefCurrent.value);

    fetch('http://localhost:3001/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userone: username, usertwo: currFriend, message: messageInput })
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error('Network response wat not ok');
        }
        return response.json();
      })
      .then((data: ResponseData) => {
        if (data.success) {
          setMessageInput(''); // Очищаем поле после отправки
          fetchMessages(currFriend); // Обновляем сообщения
        } else {
          console.error('Error sending message: ', data.message);
          alert('Failed to send message: ' + data.message);
        }
      })
      .catch((error: Error) => console.error(error));
  };

  document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  const fetchMessages = useCallback((friend: string) => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      const isAtBottomNow = scrollHeight - scrollTop === clientHeight;
  
      fetch('http://localhost:3001/getMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userone: username, usertwo: friend }),
      })
        .then((response: Response) => response.json())
        .then((data: MessageData) => {
          setMessages(data.data);
  
          // Используем setTimeout для восстановления скролла
          setTimeout(() => {
            if (messageContainerRef.current) {
              if (isAtBottomNow) {
                // Прокручиваем вниз, если пользователь был внизу
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
              } else {
                // Восстанавливаем позицию скролла
                messageContainerRef.current.scrollTop = scrollTop;
              }
            }
          }, 0); // Задержка в 0 мс, чтобы дождаться обновления состояния
        })
        .catch((error: Error) => console.error(error));
    }
  }, [username]);

  const ChatView = () => (
    <div ref={messageContainerRef} className="message-container">
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg, index) => (
          <div className="message-view" key={index}>
            <h3 className='h3_blk'>{msg.sender}</h3>
            <h4 className='h4_blk'>{msg.content}</h4>
          </div>
        ))
      ) : (
        <div>No messages yet.</div>
      )}
    </div>
  );

  const NoChatView = () => (
    <div>
      <h1>DM Not found</h1>
    </div>
  );

  const Chat = () => (
    <div>
      {showChat && (
        <div className="message-conatiner">
          <ChatView/>
        </div>
      )}
      {!showChat && <NoChatView />}
      {showChat && (
        <InputMessage
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );

  function setIsFriend() {
    setIsFriends(!friends);

    if (friends) {
      setIsFriendRequests(false);
    } else {
      setIsFriendRequests(true);
    }

  }

  function setIsFriendRequest() {
    setIsFriendRequests(!isFriendRequests);

    if (isFriendRequests) {
      setIsFriends(false);
    } else {
      setIsFriends(true);
    }
  }

  if (data && data.success) {
    return (
      <>
        <div className="container_chat">
          <div className="navbar_">
            <div className="buttons">
              <button onClick={setIsFriend}>Friends</button>
              <button onClick={setIsFriendRequest}>Friend Requests</button>
            </div>
            <div className="profile_button">
              <button>
                <img src="/profile.svg" alt="My Profile" height="30" />
              </button>
            </div>
          </div>
          <hr />
          <div className="chats_view">
            {friends.map(friend => (
              <button key={friend} onClick={() => openDM(friend)}>
                {friend}
              </button>
            ))}
          </div>
          <div className="viewer">
            {isFriends && <FriendsComponent />}
            {isFriendRequests && <FriendRequestsComponent />}
            {!isFriends && !isFriendRequests && <Chat />}
          </div>
        </div>
      </>
    );
  }

  return <div>Loading...</div>;
}
