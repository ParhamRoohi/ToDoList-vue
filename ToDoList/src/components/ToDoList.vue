<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import "@/styles/todolist.css";


const items = ref([]);
const newTaskTitle = ref("");
const editingTaskId = ref(null);
const editingTaskTitle = ref("");

const BASE_URL = "https://6734c937a042ab85d11b9e03.mockapi.io/api/todos";

const formatToPersianDate = (date) => {
  return dayjs(date).locale("fa").format("YYYY/MM/DD");
};

const fetchTodos = async () => {
  try {
    const response = await axios.get(BASE_URL);
    items.value = response.data.map((todo) => ({
      ...todo,
      createdDatePersian: formatToPersianDate(todo.createdDate),
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  try {
    const response = await axios.post(BASE_URL, {
      title: newTaskTitle.value,
      createdDate: new Date().toISOString(),
    });
    items.value.push({
      ...response.data,
      createdDatePersian: formatToPersianDate(response.data.createdDate),
    });
    newTaskTitle.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

const startEditing = (id, title) => {
  editingTaskId.value = id;
  editingTaskTitle.value = title;
};

const editTask = async (id) => {
  if (!editingTaskTitle.value.trim()) return;
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, {
      title: editingTaskTitle.value,
    });
    const task = items.value.find((todo) => todo.id === id);
    if (task) task.title = response.data.title;
    editingTaskId.value = null;
    editingTaskTitle.value = "";
  } catch (error) {
    console.error("Error editing task:", error);
  }
};

const deleteTask = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    items.value = items.value.filter((todo) => todo.id !== id);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div>
    <h1>ToDo List</h1>
    <div>
      <input v-model="newTaskTitle" placeholder="Enter a new task" />
      <button @click="addTask">Add Task</button>
    </div>

    <ul>
      <li v-for="task in items" :key="task.id">
        <ul>
          <li>Title:{{ task.title }}</li>
          <li>CreatedDate:{{ task.createdDatePersian }}</li>
        </ul>

        <div>
          <button @click="startEditing(task.id, task.title)">Edit</button>
          <button @click="deleteTask(task.id)">Delete</button>
        </div>

        <div v-if="editingTaskId === task.id">
          <input v-model="editingTaskTitle" placeholder="Edit task title" />
          <button @click="editTask(task.id)">Save</button>
        </div>
      </li>
    </ul>
  </div>
</template>
