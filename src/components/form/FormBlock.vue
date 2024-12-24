<script setup>
import { onMounted, ref } from 'vue'
import { Button } from 'ant-design-vue'

const sections = ref([])

const addSection = () => {
  sections.value.push({ id: crypto.randomUUID() })
}

const removeSection = (index) => {
  sections.value.splice(index, 1)
  // After removing the section, re-index the remaining sections
  sections.value = [...sections.value]
}

onMounted(() => {
  addSection()
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <!-- Loop through each section and render the slot content dynamically -->
    <div
      v-for="(section, index) in sections"
      :key="section.id"
      class="flex flex-col gap-3 p-4 mb-4"
    >
      <Button
        :class="['self-end rounded-none', 'w-fit', { hidden: sections.length === 1 }]"
        @click="removeSection(index)"
      >
        X
      </Button>

      <!-- Render passed form fields as a scoped slot, passing section index -->
      <slot :index="index"></slot>
    </div>
    <Button class="self-end rounded-none" @click="addSection">Add Section</Button>
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
}

.hidden {
  visibility: hidden;
}
</style>
