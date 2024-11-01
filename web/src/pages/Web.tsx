import { checkLogin, getPassword, getUsername } from '../cookies';
import '../styles/index.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import FriendsComponent from './components/friends';
import FriendRequestsComponent from './components/requests';
import '../styles/chat.css';
import ProfileInverted from '/profile_inverted.svg';

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

export default function Web() {
  const [isFriends, setIsFriends] = useState<boolean>(false);
  const [isFriendRequests, setIsFriendRequests] = useState<boolean>(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [data, setData] = useState<ResponseData | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [currFriend, setFriend] = useState<string>('');

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

    setIsMobile(isMobileDevice);
  }, [])

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const [displayedMessages, setDisplayedMessages] = useState<MessageStruct[]>([]);

  const InputMessage = () => {

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

    const handleSend = () => {
      const message = messageInputRef.current?.value;
      sendMessageFunction(message);
      if (messageInputRef.current) {
        messageInputRef.current.value = '';
      }
    }
  
    return (
      <div>
        <input
          type="text"
          ref={messageInputRef}
          placeholder="Enter message here"
          className='input_field_chat'
        />
        <button onClick={handleSend} className='send_field_chat'>Send</button>
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
          } else {
            if (data.message == "Invalid username or password") {
              window.location.href = "/router"
            }
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
          setFriend(friend);
        }
      })
      .catch((error: Error) => console.error(error));
  }, [username]);

  // Функция для отправки сообщения
  const sendMessageFunction = (message: string | undefined) => {

    if (!message || !message.trim()) return;


    fetch('http://localhost:3001/createMessage', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify({ userone: username, usertwo: currFriend, message })

    })

      .then((response: Response) => {

        if (!response.ok) {

          throw new Error('Network response was not ok');

        }

        return response.json();

      })

      .then((data: ResponseData) => {

        if (data.success) {

          // После успешной отправки сообщения обновляем список сообщений

          fetchMessages(currFriend);


          // Прокрутка вниз после отправки сообщения

          if (messageContainerRef.current) {

            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;

          }

        } else {

          console.error('Error sending message: ', data.message);

          alert('Failed to send message: ' + data.message);

        }

      })

      .catch((error: Error) => console.error(error));

  };

  document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      sendMessageFunction('');
    }
  });

  const fetchMessages = useCallback((friend: string) => {

    if (messageContainerRef.current) {

      fetch('http://localhost:3001/getMessages', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({ userone: username, usertwo: friend }),

      })

        .then((response: Response) => response.json())

        .then((data: MessageData) => {

          const newMessages = data.data;


          // Сравниваем новые сообщения с отображаемыми

          if (JSON.stringify(newMessages) !== JSON.stringify(displayedMessages)) {

            setDisplayedMessages(newMessages); // Обновляем отображаемые сообщения только если они изменились


            // Прокрутка вниз при необходимости

            setTimeout(() => {

              if (messageContainerRef.current) {

                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;

              }

            }, 0);

          }

        })

        .catch((error: Error) => console.error(error));

    }

  }, [username, displayedMessages]);

  useEffect(() => {

    let interval: number;


    if (showChat && currFriend) {

      // Первоначальная загрузка сообщений

      fetchMessages(currFriend);


      interval = window.setInterval(() => {

        fetchMessages(currFriend);

      }, 1000); // обновляем каждую секунду

    }


    return () => {

      if (interval) {

        clearInterval(interval); // Очищаем интервал при размонтировании или изменении currFriend

      }

    };

  }, [showChat, currFriend, fetchMessages]);

  const ChatView = () => (

    <div ref={messageContainerRef} className="message-container">

      {Array.isArray(displayedMessages) && displayedMessages.length > 0 ? (

        displayedMessages.map((msg, index) => (

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
        <InputMessage/>
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
      {isMobile ? <DesktopComponent /> : <DesktopComponent />}
    </>
    );
  
  }

  function DesktopComponent() {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
  <>
    <div className="container_chat">
      <div className="navbar_">
        <div className="buttons">
          <button onClick={setIsFriend}>Friends</button>
          <button onClick={setIsFriendRequest}>Friend Requests</button>
          <button onClick={toggleMenu} className="icon-button">
            <img src={ProfileInverted} className="friends_nav" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="dropdown-menu">
          <button onClick={() => console.log('Settings')}>Settings</button>
          <button onClick={() => console.log('Logout')}>Logout</button>
        </div>
      )}

  
          <div className="chat_layout">
  
          <div className="friends_list">
  <h1>Friends</h1>
  {friends.map(friend => (
    <div key={friend}>
      <button className='friends_button' onClick={() => openDM(friend)}>
        <div className="friend_item">
          {friend}
          <img className='friends_button_image' src={ProfileInverted} alt="profile-invert" />
        </div>
      </button>
    </div>
  ))}
</div>
  
              {isFriends && <FriendsComponent />}
  
              {isFriendRequests && <FriendRequestsComponent />}
  
            <div className="chat_container">
  
              {showChat && <Chat />}
  
              {!showChat && <NoChatView />}
  
            </div>
  
          </div>
  
        </div>
  
      </>
  )
}

  return <div>Loading...</div>;
}



// <div className="profile_button">
  
//<button>
  
//<img src="/profile.svg" alt="My Profile" height="30" />

//</button>

//</div> 