'use client';

import React, { Component } from "react";

class TodoList extends Component {
  state = {
    tasks: [],
    task: "",
    updateMessage: "",
    editingIndex: -1,
  };

  handleInputChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleAddTask = () => {
    const { task, tasks } = this.state;
    if (task.trim()) {
      this.setState({
        tasks: [...tasks, task],
        task: "",
        updateMessage: "Task added successfully!",
        editingIndex: -1,
      });
      this.clearMessage();
    }
  };

  handleDeleteTask = (index) => {
    const { tasks } = this.state;
    this.setState({ tasks: tasks.filter((_, i) => i !== index) });
  };

  handleEditTask = (index) => {
    const { tasks } = this.state;
    this.setState({
      task: tasks[index],
      editingIndex: index,
    });
  };

  handleSaveEdit = () => {
    const { task, tasks, editingIndex } = this.state;
    if (task.trim()) {
      tasks[editingIndex] = task;
      this.setState({
        tasks: [...tasks],
        task: "",
        updateMessage: "Task updated successfully!",
        editingIndex: -1,
      });
      this.clearMessage();
    }
  };

  clearMessage = () => {
    setTimeout(() => this.setState({ updateMessage: "" }), 2000);
  };

  render() {
    const { tasks, task, updateMessage, editingIndex } = this.state;

    const inputPlaceholder = editingIndex === -1 ? "Enter a new task" : "Edit your task";
    const buttonText = editingIndex === -1 ? "Add Task" : "Save Task";
    const handleButtonClick = editingIndex === -1 ? this.handleAddTask : this.handleSaveEdit;

    const styles = {
      container: {
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
      },
      header: {
        fontSize: "2em",
        color: "#333",
        marginBottom: "20px",
        fontWeight: "600",
      },
      inputContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      },
      input: {
        width: "75%",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "1em",
        outline: "none",
      },
      inputFocus: {
        borderColor: "#4e90a3",
      },
      addButton: {
        width: "20%",
        padding: "10px",
        backgroundColor: "#4e90a3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1em",
      },
      addButtonHover: {
        backgroundColor: "#3b7a8b",
      },
      list: {
        listStyle: "none",
        padding: "0",
      },
      todoItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fafafa",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
      },
      deleteButton: {
        background: "transparent",
        border: "none",
        color: "#d9534f",
        fontSize: "1.5em",
        cursor: "pointer",
      },
      deleteButtonHover: {
        color: "#c9302c",
      },
      updateMessage: {
        color: "#4e90a3",
        fontSize: "1em",
        marginBottom: "15px",
        fontWeight: "bold",
      },
      editButton: {
        background: "transparent",
        border: "none",
        color: "#4e90a3",
        fontSize: "1.5em",
        cursor: "pointer",
      },
      editButtonHover: {
        color: "#357a9e",
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>My Todo List</h1>
        </div>

        {updateMessage && <div style={styles.updateMessage}>{updateMessage}</div>}

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={task}
            onChange={this.handleInputChange}
            placeholder={inputPlaceholder}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = styles.inputFocus.borderColor)}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <button
            onClick={handleButtonClick}
            style={styles.addButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = styles.addButtonHover.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4e90a3")}
          >
            {buttonText}
          </button>
        </div>

        <ul style={styles.list}>
          {tasks.map((task, index) => (
            <li key={index} style={styles.todoItem}>
              <span>{task}</span>
              <button
                onClick={() => this.handleEditTask(index)}
                style={styles.editButton}
                onMouseEnter={(e) => (e.target.style.color = styles.editButtonHover.color)}
                onMouseLeave={(e) => (e.target.style.color = "#4e90a3")}
              >
                ✎
              </button>
              <button
                onClick={() => this.handleDeleteTask(index)}
                style={styles.deleteButton}
                onMouseEnter={(e) => (e.target.style.color = styles.deleteButtonHover.color)}
                onMouseLeave={(e) => (e.target.style.color = "#d9534f")}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoList;
