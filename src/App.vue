<script setup>
import { ref, onMounted } from 'vue'

const name = ref('Ali Saleh')
const status = ref('Active')
const newTask = ref('')
const tasks = ref(['Task 1', 'Task 2', 'Task 3'])

const toggleStatus = () => {
  if (status.value === 'Active') {
    status.value = 'Pending'
  } else if (status.value === 'Pending') {
    status.value = 'Inactive'
  } else {
    status.value = 'Active'
  }
}
const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push(newTask.value)
    newTask.value = ''
  }
}

const deleteTask = (index) => {
  tasks.value.splice(index, 1)
}

onMounted(async () => {
  try {
    const req = await fetch('https://jsonplaceholder.typicode.com/todos')
    const res = await req.json()
    tasks.value = res.map((todo) => todo.title)
  } catch (error) {
    return error
  }
})
</script>

<template>
  <h1 class="text-red-500">{{ name }}</h1>
  <br />
  <h1>{{ status }}</h1>
  <br />
  <div v-if="status === 'Active'">User is Active</div>
  <div v-else-if="status === 'Pending'">User is Pending</div>
  <div v-else>User is Inactive</div>
  <br />
  <form @submit.prevent="addTask">
    <label for="newTask">New Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit</button>
  </form>
  <br />
  <ul>
    <li v-for="(task, index) in tasks" :key="index">
      <span>
        {{ task }}
      </span>

      <button @click="deleteTask(index)">X</button>
    </li>
  </ul>
  <br />
  <button @click="toggleStatus">Click</button>
</template>
