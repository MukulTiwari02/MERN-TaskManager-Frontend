import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Taskform from './TaskForm';
import Task from './Task';
import axios from 'axios';
import { URL } from '../App';
import loadingGif from "../assets/loader.gif"

const TaskList = () => {
    const [formData, setFormData] = useState({name : "", completed : false})
    const {name} = formData; 

    const [tasks,setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([])
    const [isLoading,setIsLoading] = useState(false);
    const [taskId, setTaskId] = useState("");
    const [isEditing, setIsEditing] = useState(false)

    const getTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${URL}/api/tasks`);
            setTasks(response.data);
            // console.log(response)
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    }

    useEffect( () => {
        getTasks();
    }, [])


    useEffect( () => {
        const compTasks = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(compTasks)
    },[tasks])



    const handleInputChange = (e) => {
        const {name,value} = e.target;
        setFormData({...formData, [name]:value});
    }

    const createTask = async (e) => {
        e.preventDefault();
        if(name === "")
            return toast.error("Input field cannot be empty");

        try {
            await axios.post(`${URL}/api/tasks`, formData) 
            setFormData({...formData, name:""});
            getTasks()
            toast.success("Task created successfully");
        } catch (error) {
            toast.error(error.message)
        }
    } 

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            toast.success("Task deleted successfully")
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getSingleTask = async (task) => {
        setFormData({name : task.name, completed:false})
        setIsEditing(true);
        setTaskId(task._id);
    }

    const updateTask = async (e) => {
        e.preventDefault();
        if(name === "")
            return toast.error("Input field cannot be empty")

        try {
            await axios.patch(`${URL}/api/tasks/${taskId}`, formData) 
            setFormData({...formData, name:""});
            getTasks()
            setIsEditing(false)
            toast.success("Task edited successfully");
        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeTask = async (task) => {
        let change = task.completed;
        change = !change;
        const newFormData = {name : task.name , completed : change}
        try {
            await axios.patch(`${URL}/api/tasks/${task._id}`, newFormData)
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }



  return (
    <div>
        <h2>Task Manager</h2>
        <Taskform 
            name = {name}  
            handleInputChange={handleInputChange} 
            createTask={createTask}
            isEditing = {isEditing}
            updateTask={updateTask}
        />
        {tasks.length > 0 && (
        <>    <div className="--flex-between --pb">
            <p>
                <b>Total Tasks :</b> {tasks.length}
            </p>
            <p>
                <b>Completed Tasks :</b> {completedTasks.length}
            </p>
        </div>
        <hr />
        </>
        )}
        
        {
            isLoading && (
                <div className="--flex-center">
                    <img src={loadingGif} alt="Loading" />
                </div>
            )
        }
        {
            !isLoading && tasks.length === 0 ? (
                    <p className='--py'>No task added. Please add a task.</p>
            ) : (
                <>
                    {tasks.map((task,index) => {
                        return (
                            <Task 
                                key = {task._id} 
                                task = {task} 
                                index={index} 
                                deleteTask={deleteTask}
                                getSingleTask = {getSingleTask}
                                completeTask = {completeTask}
                            />
                        )
                    })}
                </>
            ) 
        }
    </div>
  )
}

export default TaskList