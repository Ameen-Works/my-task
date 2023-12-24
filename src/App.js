import React, { useEffect, useState } from "react";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import TaskList from "./Tasks/TasksList/TaskList.jsx";
import EditTask from "./Tasks/UpdateTask/EditTask.jsx";
import AddTask from "./Tasks/AddTask/AddTask.jsx";
import { Route, Navigate, Routes } from "react-router-dom";
import { tasksList } from "./Tasks/TaskData.js";

const App = () => {
  const [tasks, setTasks] = useState(tasksList);
  const [showLogin, setShowLogin] = useState(true);
  // const [selectedTask, setSelectedTask] = useState(null);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const response = await fetch("https://my-tasks-ie4s.onrender.com/task/all-tasks", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const formattedTasks = data.map((task) => ({
              ...task,
              deadline: formatDate(task.deadline),
            }));
            setTasks(formattedTasks);
          } else {
            // Handle error
            console.error("Error fetching tasks:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [user]);
  // Function to update user state when the user logs in
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowLogin(false); // Hide the login component after successful login
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
  };

  // Function to handle adding a new task
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  // Function to handle editing an existing task
  const handleEditTask = (updatedTask) => {
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    // setSelectedTask(null);
  };
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };
  // Function to handle marking a task as completed
  const handleMarkComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleUndoComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: false } : task
      )
    );
  };
  // const formatDateString = (dateString) => {
  //   const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  //   return new Date(dateString).toLocaleDateString("en-GB", options);
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  return (
    <Routes>
      {console.log(tasks)}
      <Route
        exact
        path="/"
        element={
          user ? <Navigate to="/tasks" /> : <Login onLogin={handleLogin} />
        }
      />
      <Route
        exact
        path="/register"
        element={
          user ? (
            <Navigate to="/tasks" />
          ) : (
            <Register onRegister={handleRegisterClick} />
          )
        }
      />
      <Route
        exact
        path="/tasks"
        element={
          user ? (
            <TaskList
              logInUser={user}
              tasks={tasks}
              handleComplete={handleMarkComplete}
              handleDelete={handleDeleteTask}
              undoComplete={handleUndoComplete}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        exact
        path="/add-task"
        element={
          user ? (
            <AddTask onAdd={handleAddTask} logInUser={user} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        exact
        path="/edit-task/:taskId"
        element={
          user ? (
            <EditTask tasks={tasks} onEdit={handleEditTask} logInUser={user} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default App;
