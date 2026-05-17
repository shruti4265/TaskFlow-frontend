import React, {useState} from "react";
function NewCard({ columnId, onClose,onTaskCreated  }) {
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [priority,setPriority]=useState("Low");
    const [dueDate,setDueDate]=useState("");
    const [creating, setCreating] = useState(false);
    async function handleAddingTask(columnId){
        if(!title.trim()){
            alert("Please enter a task title");
            return;
        }
        if(!description.trim()){
            alert("Please enter a task description");
            return;
        }
        if(priority!=="Low" && priority!=="Medium" && priority!=="High"){
            alert("Invalid priority selected");
            return;
        }
        if(!dueDate){
            alert("Please select a due date");
            return;
        }
        try{
            setCreating(true);
            const token = localStorage.getItem('token');
            const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/cards/" + columnId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    dueDate
                })
            });
            const result= await response.json();
            if(response.ok){
                alert("Task created successfully");
                await onTaskCreated();
                onClose();
            }
            else{
                alert(result.message || "Error creating task");
            }
        }catch(err){
            console.log(err);
        }finally {
            setCreating(false);  // add this
        }
    }
    return(
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Create New Task</h2>
                <p>Enter details for your new task</p>
                <label>Task Title</label>
                <input
                    className="modal-input"
                    type="text"
                    placeholder="Title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label>Description</label>
                <input
                    className="modal-input"
                    type="text"
                    placeholder="Description..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="modal-input">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <label>Due Date</label>
                <input
                    className="modal-input"
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                />
                <button className="btn-cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn-primary" onClick={() => handleAddingTask(columnId)} disabled={creating}>
                    {creating ? "Creating..." : "Create Board"}
                </button>
            </div>
        </div>
    )
}
export default NewCard;