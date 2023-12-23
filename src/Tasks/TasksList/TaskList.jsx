import React, { useState } from "react";
import "./TaskList.css";
// import { tasksList } from "../TaskData";
import { useNavigate } from "react-router-dom";
import AddTask from "../AddTask/AddTask";

const TaskList = ({
  tasks,
  handleComplete,
  handleDelete,
  undoComplete,
  logInUser,
}) => {
  // const [tasks, setTasks] = useState(tasksList);
  const navigateTo = useNavigate();

  // Function to handle marking a task as completed
  const handleMarkComplete = async (taskId, completion) => {
    try {
      console.log("Completion Status", completion);
      const response = await fetch(
        `https://my-tasks-ie4s.onrender.com/task/update-complete/${taskId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${logInUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !completion }),
        }
      );

      if (response.ok) {
        // If the request is successful, you can update the state or perform any other necessary actions
        handleComplete(taskId); // Update the state to reflect the completion status
      } else {
        // Handle error
        console.error("Error marking as completed:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking as completed:", error);
    }
  };

  const onEditClick = (taskId) => {
    navigateTo(`/edit-task/${taskId}`);
  };

  const onDeleteClick = async (taskId) => {
    try {
      const response = await fetch(
        `https://my-tasks-ie4s.onrender.com/task/delete/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${logInUser.token}`,
          },
        }
      );

      if (response.ok) {
        // If the request is successful, you can update the state or perform any other necessary actions
        handleDelete(taskId); // Update the state to remove the deleted task
        navigateTo("/tasks");
      } else {
        // Handle error
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  return (
    <div className="">
      Hi {logInUser.username},
      <button
        onClick={() => navigateTo("/add-task")}
        className="add-task-button"
      >
        Add Task
      </button>
      <div className="task-list ">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Deadline: {task.deadline}</p>
            <button onClick={() => onEditClick(task._id)}>Edit</button>
            <button onClick={() => onDeleteClick(task._id)}>Delete</button>
            {!task.completed ? (
              <button
                onClick={() => handleMarkComplete(task._id, task.completed)}
              >
                Mark as Completed
              </button>
            ) : (
              <span
                onClick={() => handleMarkComplete(task._id, task.completed)}
              >
                Undo Completed
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
