<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";
import "@/styles/todolist.css";

const store = useStore();
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
    const formattedTasks = response.data.map((todo) => ({
      ...todo,
      createdDatePersian: formatToPersianDate(todo.createdDate),
    }));
    store.commit("setTasks", formattedTasks);
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
    const newTask = {
      ...response.data,
      createdDatePersian: formatToPersianDate(response.data.createdDate),
    };
    store.commit("addTask", newTask);
    newTaskTitle.value = "";
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

const toggleTaskStatus = async (id, completed) => {
  try {
    await axios.put(`${BASE_URL}/${id}`, { completed });
    store.commit("updateTaskStatus", { id, completed });
  } catch (error) {
    console.error("Error updating task status:", error);
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
    store.commit("updateTaskTitle", { id, title: response.data.title });
    editingTaskId.value = null;
    editingTaskTitle.value = "";
  } catch (error) {
    console.error("Error editing task:", error);
  }
};

const deleteTask = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    store.commit("deleteTask", id);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const filteredTasks = computed(() => store.getters.filteredTasks);

const setFilter = (filter) => {
  store.commit("setFilter", filter);
};

onMounted(() => {
  fetchTodos();
});
</script>


<template>
  <v-container class="pa-4">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h1 class="filter-buttons my-4 d-flex justify-center ">ToDo List</h1>

        <div class="add-task">
          <input
            v-model="newTaskTitle"
            placeholder="Enter a new task"
            class="add-task-input"
          />

          <v-btn @click="addTask" class="add-task-btn">Add Task</v-btn>
        </div>

        <div class="filter-buttons my-4 d-flex justify-center">
          <v-btn-toggle
            v-model="store.state.filter"
            class="d-flex justify-center"
          >
            <v-btn @click="setFilter('All')" class="filter-btn">All</v-btn>
            <v-btn @click="setFilter('Active')" class="filter-btn"
              >Active</v-btn
            >
            <v-btn @click="setFilter('Completed')" class="filter-btn"
              >Completed</v-btn
            >
          </v-btn-toggle>
        </div>

        <ul class="task-list">
          <li v-for="task in filteredTasks" :key="task.id" class="task-item">
            <div class="task-details">
              <ul>
                <li>Title: {{ task.title }}</li>
                <li>CreatedDate: {{ task.createdDatePersian }}</li>
              </ul>
            </div>

            <div class="task-actions">
              <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTaskStatus(task.id, $event.target.checked)"
                class="status-checkbox"
              />
              <button @click="startEditing(task.id, task.title)" class="btn-group">Edit</button>
              <button @click="deleteTask(task.id)" class="btn-group">Delete</button>
            </div>

            <div v-if="editingTaskId === task.id" class="edit-task">
              <input v-model="editingTaskTitle" placeholder="Edit task title" />
              <button @click="editTask(task.id)" class="btn-group">Save</button>
            </div>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>


