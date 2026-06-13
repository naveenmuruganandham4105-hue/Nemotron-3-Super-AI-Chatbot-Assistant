import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [history, loading]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
  } else {
    loadHistory();
    loadUser();
  }
}, []);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/chat/history",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/profile",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setUser(res.data.user);

  } catch (err) {
    console.log(err);
  }
};

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/chat",
        {
          message,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setMessage("");

      await loadHistory();

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/chat/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      loadHistory();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteHistory = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      "http://localhost:5000/api/chat/history",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setHistory([]);

    // Reload history
    await loadHistory();

  } catch (err) {
    console.log(err);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={darkMode ? "container dark" : "container light"}>

      {/* Sidebar */}

      <div className={showSidebar ? "sidebar active" : "sidebar"}>
        

  {/* Top */}
  <div className="user-info">

  <h2 className="unameid">{user.username}</h2>
  <p className="unameid" >User ID : {user.id}</p>

 <button
  className="delete-all-btn"
  onClick={() => setShowDeletePopup(true)}
>
  Delete All Chats
</button>

</div>

  {/* Bottom */}
  <button
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
  >
    Logout
  </button>

</div>

      {/* Main Chat */}

      <div className="main-chat">

        <div className="header">

          <h1>Nemotron 3 Super</h1>
          <h2>AI Chatbot Assistant</h2>

          <div className="menu-icon"
onClick={() => setShowSidebar(!showSidebar)}
>
  {showSidebar ? "✖" : "☰"}
</div>

          <div className="btn-group">

            <button className="mode-button"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

          </div>

          

        </div>
        

        <div
          className="chat-box"
          ref={chatBoxRef}
        >
          {history.length === 0 ? (
  <p>No chats found</p>
) : (
  history.map((chat) => (
    <div key={chat.id}>

      <div className="user-message">
        {chat.user_message}
      </div>

      <div className="ai-message">
        <ReactMarkdown>
          {chat.ai_response}
        </ReactMarkdown>

        <button
          className="delete-msg-btn"
          onClick={() => deleteMessage(chat.id)}
        >
          🗑
        </button>

      </div>

    </div>
  ))
)}

          {loading && (
            <div className="ai-message typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

        </div>

        <div className="input-area">

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
          />

          <button
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>

        </div>

      </div>

      {
  showDeletePopup && (
    <div className="popup-overlay">

      <div className="popup-box">

        <h3>Delete All Chats?</h3>

        <p>
          Are you sure you want to delete all chats?
        </p>

        <div className="popup-buttons">

          <button
            className="yes-btn"
            onClick={() => {
              deleteHistory();
              setShowDeletePopup(false);
            }}
          >
            Yes
          </button>

          <button
            className="no-btn"
            onClick={() => setShowDeletePopup(false)}
          >
            No
          </button>

        </div>

      </div>

    </div>
  )
}

    </div>
  );
}

export default App;

