

const Taskform = (props) => {
    const {name,createTask,handleInputChange,isEditing, updateTask} = props;
  return (
    <div>
        <form className="task-form" onSubmit={isEditing?updateTask : createTask}>
            <input type="text" placeholder="Add a task" name = "name" value = {name} onChange={handleInputChange}/>
            <button type="submit">
              {isEditing? "Edit" : "Add"}
            </button>
        </form>
    </div>
  )
}

export default Taskform