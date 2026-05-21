import React, { useState,useEffect  } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import Navbar from './components/Navbar';
import NewCard from './components/NewCard';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuth from '../hooks/useAuth';
import './global.css';

function Board() {
    useAuth();
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [columns, setColumns] = useState(null);
    const [card, setCard] = useState(null);
    const navigate = useNavigate();
    const columnColors = ['column-box-one', 'column-box-two', 'column-box-three'];
    const [status_id, setStatus_id] = useState(null);
    const [showCard, setShowCard] = useState(false);
    const [deletingCardId, setDeletingCardId] = useState(null);
    
    const handleDragEnd = async (result) =>{
        const { source, destination, draggableId } = result;
        if(!destination) return;
        if(source.droppableId === destination.droppableId && source.index === destination.index) return;
        setCard(prev=>{
            const updated = [...prev];
            const cardIndex = updated.findIndex(c => c.id === draggableId);
            const [movedCard] = updated.splice(cardIndex,1);
            movedCard.column_id=destination.droppableId;
            const destCards = updated.filter(c => c.column_id === destination.droppableId);
            if(destCards.length === 0||destination.index >= destCards.length){
                updated.push(movedCard);
            }else {
                const insertAt = updated.indexOf(destCards[destination.index]);
                updated.splice(insertAt, 0, movedCard);
            }
            return updated;
        });
        try{
            await fetch(import.meta.env.VITE_API_BASE_URL + "/cards/" + draggableId + "/move", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },body: JSON.stringify({
                    column_id: destination.droppableId,
                    position: destination.index
                })
            });
        }
        catch(err){
            console.log(err);
            alert("Error updating card position");  
            fetchBoard();
        }
    }
    const handleDeleteCard = async (cardId) => {
        try {
            setDeletingCardId(cardId);
            const response = await fetch(
                import.meta.env.VITE_API_BASE_URL + "/cards/" + cardId,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            if (!response.ok) {
                throw new Error("Failed to delete card");
            }
            setCard(prev => prev.filter(c => c.id !== cardId));
        } catch(err) {
            console.log(err);
            alert("Error deleting card");
        } finally {
            setDeletingCardId(null);
        }
    }
    const fetchBoard = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_BASE_URL + "/boards/" + id,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            const result = await response.json();
            if (response.ok) {
                setBoard(result.board);
                setColumns(result.column);
                setCard(result.cards);
            } else {
                alert("Error fetching board");
            }
        } catch (err) {
            console.log(err);
            alert("Network error while fetching board");
        }
    };

    useEffect(() => {
        fetchBoard();
    }, [id]);

    return (
        <div>
            {showCard && (
                <NewCard onClose={() => setShowCard(false)} columnId={status_id} onTaskCreated={fetchBoard}/>
            )}
            <Navbar />

            <div className='board-page'>
                
                <Link className='back-link' to="/">
                    ← Back to Boards
                </Link>

                <h1 className='boardTitle'>{board?.title}</h1>

                <p className='boardDesc'>
                    {card ? card.filter(c => c.id !== null).length : 0} Tasks
                </p>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className='status'>
                        {columns && columns.map((col, index) => (
                            <div key={col.id}>
                                <div>
                                    <h3>{col.name}</h3>
                                    <div className="count">{card ? card.filter(c => c.column_id === col.id).length : 0}</div>
                                </div>
                                <Droppable droppableId={col.id}>
                                    {provided=>(
                                        <div className={`column-box ${columnColors[index % columnColors.length]}`} ref={provided.innerRef} {...provided.droppableProps}>
                                            {card && card
                                                .filter(c => c.column_id === col.id)
                                                .sort((a,b)=> a.position - b.position)
                                                .map((c,cardIndex) => (
                                                    <Draggable  draggableId={c.id} index={cardIndex} key={c.id}>
                                                        {provided=>(
                                                            <div className="task-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <button 
                                                                    className="task-delete-btn" 
                                                                    onClick={() => handleDeleteCard(c.id)}
                                                                    disabled={deletingCardId === c.id}
                                                                >
                                                                    {deletingCardId === c.id ? "..." : <DeleteIcon />}
                                                                </button>
                                                                <h4 className="task-title">{c.title}</h4>
                                                                <p className="task-description">{c.description}</p>
                                                                <div className="task-footer">
                                                                   <span className={`priority-badge priority-${c.priority.toLowerCase()}`}>
                                                                       {c.priority}
                                                                   </span>
                                                                   <span className="task-date">
                                                                        {new Date(c.due_date).toLocaleDateString('en-GB', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: '2-digit'
                                                                        })}
                                                                    </span>
                                                                    
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                    </Draggable>
                                                ))
                                            }
                                            <button className='add-task-btn' onClick={()=>{setShowCard(true); setStatus_id(col.id)}}>
                                                + Add Task
                                            </button>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
    
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}

export default Board;