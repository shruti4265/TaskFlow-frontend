import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import './global.css'
import NewBoardModal from './components/NewBoardModal';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from '../hooks/useAuth';
const colors = ["blue", "purple", "teal", "pink", "green"];
function Dashboard() {
  useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search,setSearch]=useState("");
  const navigate = useNavigate();
  async function handleDeleteBoard(boardId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/boards/" + boardId, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        setBoards(prev => prev.filter(board => board.id !== boardId));
      } else {
        console.error("Error deleting board:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  }
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = localStorage.getItem('token'); // add this
        const savedData = JSON.parse(localStorage.getItem('user'));
        setAuthorized(true);
        setUserData(savedData);
        try {
          const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/boards", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          const result = await response.json();
          if (response.ok) {
            setBoards(result.boards);
          } else {
            console.error("Error fetching boards:", result.message);
          }
        } catch (err) {
          console.error("Network error:", err);
        } finally {
          setLoading(false);
        }
      }
    checkAuthAndFetch();
  }, [navigate]);

  return (
    <div className="dashboard">
      {showModal && (
  <NewBoardModal
    onClose={() => setShowModal(false)}
    onBoardCreated={(board) => setBoards(prev => [...prev, {...board, tasks: 0}])}
  />
)}
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Your Boards</h1>
            <p>Manage your projects and tasks</p>
          </div>
          <button className="btn-new-board" onClick={() => setShowModal(true)}>+ New Board</button>
        </div>
        <input className="board-search" placeholder="Search boards..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="boards-grid">
          {loading ? (
            <p>Loading...</p>
          ) : boards.length === 0 ? (
            <p>No boards yet. Create one to get started!</p>
          ) : (
            boards.filter(board => board.title.toLowerCase().startsWith(search.toLowerCase())).map((board, index) => (
              <div className={`board-card ${colors[index % colors.length]}`} key={board.id} onClick={()=> navigate(`/board/${board.id}`)}>
                <h3>{board.title}</h3>
                <div className="board-tasks">
                  <span className="task-count">{Number(board.tasks ?? 0)}</span>
                  <span className="task-label">tasks</span>
                </div>
                <button className="delete-btn" onClick={(e) => {
                     e.stopPropagation();
                    handleDeleteBoard(board.id);
                  }}>
                  <DeleteIcon />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
      
  )
}

export default Dashboard;