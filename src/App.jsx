import './App.css'
import { useEffect, useMemo, useState } from 'react'

const initialChats = [
  {
    id: 1,
    name: 'Alex Johnson',
    phone: '+1 202 555 0147',
    avatar: 'A',
    messages: [
      {
        id: 1,
        text: 'Hey! How are you?',
        type: 'received'
      },
      {
        id: 2,
        text: "I'm good! How about you?",
        type: 'sent'
      },
      {
        id: 3,
        text: 'Doing great! 👋',
        type: 'received'
      }
    ]
  },

  {
    id: 2,
    name: 'Sarah Miller',
    phone: '+1 202 555 0188',
    avatar: 'S',
    messages: [
      {
        id: 4,
        text: 'Are you working on the project?',
        type: 'received'
      }
    ]
  },

  {
    id: 3,
    name: 'David Wilson',
    phone: '+1 202 555 0199',
    avatar: 'D',
    messages: [
      {
        id: 5,
        text: 'See you tomorrow!',
        type: 'received'
      }
    ]
  }
]

function App() {
  const [chats, setChats] = useState(initialChats)

  const [selectedChatId, setSelectedChatId] = useState(1)

  const [message, setMessage] = useState('')

  const [phone, setPhone] = useState('')

  const [showNewChat, setShowNewChat] = useState(false)

  const [search, setSearch] = useState('')

  const [connected, setConnected] = useState(false)

  const [idInstance, setIdInstance] = useState('')

  const [apiToken, setApiToken] = useState('')

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const selectedChat = chats.find(
    chat => chat.id === selectedChatId
  )

  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      chat.phone.includes(search)
    )
  }, [chats, search])


  // Fake GREEN-API connection
  function connect() {
    if (!idInstance || !apiToken) {
      setError(
        'Please enter idInstance and apiTokenInstance'
      )
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      setConnected(true)
      setLoading(false)
    }, 700)
  }


  // Create a fake chat
  function createChat() {
    if (!phone.trim()) {
      setError('Please enter a phone number')
      return
    }

    const newChat = {
      id: Date.now(),

      name: phone.trim(),

      phone: phone.trim(),

      avatar: phone.trim()[0],

      messages: []
    }

    setChats(prev => [
      newChat,
      ...prev
    ])

    setSelectedChatId(newChat.id)

    setPhone('')

    setShowNewChat(false)

    setError('')
  }


  // Send fake message
  function sendMessage() {
    if (!message.trim()) return

    if (!selectedChat) {
      setError('Please select a chat first')
      return
    }

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      type: 'sent'
    }

    setChats(prev =>
      prev.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,

              messages: [
                ...chat.messages,
                newMessage
              ]
            }
          : chat
      )
    )

    setMessage('')


    // Fake automatic reply
    setTimeout(() => {
      const replies = [
        'Sounds good! 👍',
        'Okay, got it!',
        'Nice! 😄',
        'Sure!',
        'That sounds great!',
        'I understand.',
        'Thanks for the message!',
        'Absolutely!'
      ]

      const randomReply =
        replies[
          Math.floor(
            Math.random() * replies.length
          )
        ]

      const reply = {
        id: Date.now() + 1,
        text: randomReply,
        type: 'received'
      }

      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,

                messages: [
                  ...chat.messages,
                  reply
                ]
              }
            : chat
        )
      )
    }, 1000)
  }


  // Delete selected chat
  function deleteChat() {
    if (!selectedChat) return

    setChats(prev =>
      prev.filter(
        chat => chat.id !== selectedChat.id
      )
    )

    const nextChat = chats.find(
      chat => chat.id !== selectedChat.id
    )

    setSelectedChatId(
      nextChat ? nextChat.id : null
    )
  }


  // Press Enter to send
  function handleKeyDown(e) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()
      sendMessage()
    }
  }


  // Clear error automatically
  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      setError('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [error])


  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-top">

          <h1 className="logo">
            MAX
          </h1>

          <span className="demo-badge">
            DEMO
          </span>

        </div>


        {/* API CONNECTION */}

        <div className="api-box">

          <div className="api-title">
            <h2>GREEN-API</h2>

            <span
              className={
                connected
                  ? 'api-dot online'
                  : 'api-dot'
              }
            />
          </div>


          <label>
            idInstance
          </label>

          <input
            value={idInstance}
            onChange={e =>
              setIdInstance(e.target.value)
            }
            placeholder="Enter idInstance"
          />


          <label>
            apiTokenInstance
          </label>

          <input
            value={apiToken}
            onChange={e =>
              setApiToken(e.target.value)
            }
            placeholder="Enter apiTokenInstance"
            type="password"
          />


          <button
            className="connect-button"
            onClick={connect}
            disabled={loading}
          >
            {loading
              ? 'Connecting...'
              : connected
                ? 'Connected'
                : 'Connect'}
          </button>


          <div
            className={
              connected
                ? 'status connected'
                : 'status'
            }
          >
            <span>●</span>

            {connected
              ? 'Connected'
              : 'Demo mode'}
          </div>

        </div>


        {/* SEARCH */}

        <div className="search-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            className="search"
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            placeholder="Search chats..."
          />

        </div>


        {/* NEW CHAT */}

        <button
          className="new-chat"
          onClick={() =>
            setShowNewChat(true)
          }
        >
          <span>+</span>

          New Chat
        </button>


        {/* CHAT LIST */}

        <div className="chat-list">

          {filteredChats.map(chat => {

            const lastMessage =
              chat.messages[
                chat.messages.length - 1
              ]

            return (
              <div
                key={chat.id}
                className={
                  selectedChatId === chat.id
                    ? 'chat active'
                    : 'chat'
                }
                onClick={() =>
                  setSelectedChatId(chat.id)
                }
              >

                <div className="avatar">
                  {chat.avatar}
                </div>


                <div className="chat-info">

                  <div className="chat-name">
                    {chat.name}
                  </div>

                  <p>
                    {lastMessage
                      ? lastMessage.text
                      : 'No messages yet'}
                  </p>

                </div>

              </div>
            )
          })}


          {!filteredChats.length && (

            <div className="no-chats">
              No chats found
            </div>

          )}

        </div>

      </aside>


      {/* MAIN CHAT */}

      <main className="chat-window">

        {selectedChat ? (

          <>

            {/* CHAT HEADER */}

            <header className="chat-header">

              <div className="header-user">

                <div className="avatar large">
                  {selectedChat.avatar}
                </div>


                <div>

                  <h2>
                    {selectedChat.name}
                  </h2>

                  <p>
                    {selectedChat.phone}
                  </p>

                </div>

              </div>


              <div className="header-actions">

                <button
                  title="Search"
                >
                  🔍
                </button>

                <button
                  title="More"
                  onClick={deleteChat}
                >
                  ⋮
                </button>

              </div>

            </header>


            {/* ERROR */}

            {error && (

              <div className="error">
                {error}
              </div>

            )}


            {/* MESSAGES */}

            <section className="messages">

              {selectedChat.messages.length === 0 && (

                <div className="empty">

                  <div className="empty-icon">
                    💬
                  </div>

                  <h2>
                    No messages yet
                  </h2>

                  <p>
                    Send a message to start
                    the conversation.
                  </p>

                </div>

              )}


              {selectedChat.messages.map(
                msg => (

                  <div
                    key={msg.id}
                    className={
                      `message ${msg.type}`
                    }
                  >
                    <span>
                      {msg.text}
                    </span>

                    <small>
                      {msg.type === 'sent'
                        ? '✓✓'
                        : ''}
                    </small>

                  </div>

                )
              )}

            </section>


            {/* MESSAGE INPUT */}

            <footer className="message-input">

              <button
                className="attach"
                title="Attach"
              >
                +
              </button>


              <input
                value={message}
                placeholder="Type a message..."
                onChange={e =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
              />


              <button
                className="emoji"
                title="Emoji"
              >
                😊
              </button>


              <button
                className="send-button"
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                ➤
              </button>

            </footer>

          </>

        ) : (

          <div className="no-chat-selected">

            <div>
              💬
            </div>

            <h2>
              Select a chat
            </h2>

            <p>
              Choose a conversation or
              create a new chat.
            </p>

          </div>

        )}

      </main>


      {/* NEW CHAT MODAL */}

      {showNewChat && (

        <div
          className="modal"
          onClick={() =>
            setShowNewChat(false)
          }
        >

          <div
            className="modal-box"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  New Chat
                </h2>

                <p>
                  Create a new conversation
                </p>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowNewChat(false)
                }
              >
                ×
              </button>

            </div>


            <label>
              Phone number
            </label>

            <input
              autoFocus
              value={phone}
              onChange={e =>
                setPhone(e.target.value)
              }
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  createChat()
                }
              }}
              placeholder="+1 202 555 0123"
            />


            <p className="demo-info">
              Demo mode: any phone number
              can be used.
            </p>


            <div className="modal-actions">

              <button
                className="cancel"
                onClick={() =>
                  setShowNewChat(false)
                }
              >
                Cancel
              </button>


              <button
                className="create"
                onClick={createChat}
              >
                Create Chat
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default App