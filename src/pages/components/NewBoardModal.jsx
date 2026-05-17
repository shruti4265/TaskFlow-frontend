import React, { useState } from 'react';

function NewBoardModal({ onClose, onBoardCreated }) {
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreateBoard() {
    if (!newBoardTitle.trim()) {
      alert("Please enter a board title");
      return;
    }
    const token = localStorage.getItem('token');
    setCreating(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/boards", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newBoardTitle.trim() })
      });
      const result = await response.json();
      if (response.ok) {
        onBoardCreated(result.board);
        onClose();
      } else {
        alert(result.message || "Failed to create board");
      }
    } catch (err) {
      console.error("Error creating board:", err);
      alert("Network error, please try again");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>Create New Board</h2>
        <p>Enter a name for your new board</p>
        <input
          className="modal-input"
          type="text"
          placeholder="e.g. Marketing Campaign"
          value={newBoardTitle}
          onChange={e => setNewBoardTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreateBoard()}
          autoFocus
        />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleCreateBoard} disabled={creating}>
            {creating ? "Creating..." : "Create Board"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewBoardModal;