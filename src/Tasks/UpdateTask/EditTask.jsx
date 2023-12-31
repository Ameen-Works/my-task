import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditTask.css";
import LoadingSpinner from "../../Loader/Loading";

const EditTask = ({ tasks, onEdit, logInUser }) => {
  const navigateTo = useNavigate();
  const { taskId } = useParams();
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(null);
  //   const currTask = tasks.filter((task) => task._id === taskId);
  // Local state for the edited task
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    const currTask = tasks.find((task) => task._id === taskId);
    setEditedTask({
      ...currTask,
      deadline: formatDate(currTask.deadline),
    });
  }, [taskId, tasks]);

  //   useEffect(() => {
  //     // Define an asynchronous function to fetch task details
  //     const fetchTaskDetails = async () => {
  //       try {
  //         // Simulate an API call to fetch task details
  //         // const response = await fetch(`/api/tasks/${taskId}`);
  //         // const response = await tasks.filter((task) => task._id === taskId);
  //         const taskToEdit = await tasks.filter((task) => task._id === taskId);

  //         // If the task is found, update the local state
  //         if (taskToEdit) {
  //           setEditedTask({
  //             title: taskToEdit.title,
  //             description: taskToEdit.description,
  //             deadline: taskToEdit.deadline,
  //           });
  //         } else {
  //           // If the task is not found, navigate back to the tasks page
  //           navigateTo("/tasks");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching task details:", error);
  //         // Handle error (e.g., redirect to an error page)
  //         navigateTo("/error");
  //       }
  //     };

  //     // Call the asynchronous function
  //     fetchTaskDetails();
  //   }, [taskId, navigateTo, tasks]);

  const handleEditTask = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(
        `https://my-tasks-ie4s.onrender.com/task/edit/${taskId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${logInUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTask.title,
            description: editedTask.description,
            deadline: formatDate(editedTask.deadline),
          }),
        }
      );

      if (response.ok) {
        const updatedTask = await response.json();
        let formattedNewTask = updatedTask.task;
        formattedNewTask = {
          ...updatedTask.task,
          deadline: formatDate(updatedTask.task.deadline),
        };
        onEdit(formattedNewTask); // Update the state with the edited task
        alert("Notification sent with updated task details!");
        navigateTo("/tasks"); // Navigate back to the tasks page after editing
      } else {
        console.error("Error editing task:", response.statusText);
        setError("Error editing task:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing task:", error);
      setError("Error editing task:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatDateString = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
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
    <div className="edit-task-container">
      {loading && <LoadingSpinner />}

      <h2 className="edit-task-title">Edit Task</h2>
      <label className="form-label">
        Title:
        <input
          required
          type="text"
          className="form-input"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
        />
      </label>
      <br />
      <label className="form-label">
        Description:
        <textarea
          required
          className="textarea-input"
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
        />
      </label>
      <br />
      <label className="form-label">
        Deadline:
        <input
          required
          className="date-input"
          type="date"
          value={editedTask.deadline}
          onChange={(e) =>
            setEditedTask({ ...editedTask, deadline: e.target.value })
          }
        />
      </label>
      <br />
      {error && <p className="error-message">{error}</p>}
      <button className="edit-button" onClick={handleEditTask}>
        Save Changes
      </button>
    </div>
  );
};

export default EditTask;
