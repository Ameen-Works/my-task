// AddTask.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTask.css";

const AddTask = ({ onAdd, logInUser }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigateTo = useNavigate();

  const handleAddTask = async () => {
    try {
      const response = await fetch("http://localhost:3001/task/add-task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${logInUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, deadline }),
      });

      if (response.ok) {
        const newTask = await response.json();
        const formattedNewTask = {
          ...newTask,
          deadline: formatDate(newTask.deadline),
        };
        onAdd(formattedNewTask);
        navigateTo("/tasks");
      } else {
        // Handle error
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
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
    <div className="add-task-container">
      <h2 className="add-task-title">Add New Task</h2>
      <label className="form-label">
        Title:
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <br />
      <label className="form-label">
        Description:
        <textarea
          className="textarea-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label className="form-label">
        Deadline:
        <input
          className="date-input"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </label>
      <br />
      <button className="add-button" onClick={handleAddTask}>
        Add Task
      </button>
    </div>
  );
};

export default AddTask;
