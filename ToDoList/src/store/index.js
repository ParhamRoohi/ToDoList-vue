
import { createStore } from "vuex";

export default createStore({
  state: {
    tasks: [],
    filter: "All",
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    addTask(state, task) {
      state.tasks.push(task);
    },
    updateTaskStatus(state, { id, completed }) {
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.completed = completed;
      }
    },
    deleteTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    updateTaskTitle(state, { id, title }) {
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        task.title = title; 
      }
    },
  },
  getters: {
    filteredTasks(state) {
      if (state.filter === "Active") {
        return state.tasks.filter((task) => !task.completed);
      } else if (state.filter === "Completed") {
        return state.tasks.filter((task) => task.completed);
      }
      return state.tasks;
    },
  },
});
