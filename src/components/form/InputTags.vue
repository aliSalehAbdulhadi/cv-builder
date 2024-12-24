<script setup>
import { ref, watch, defineProps } from 'vue'
import { useField, useForm } from 'vee-validate'
import { Input, Tag, Button } from 'ant-design-vue'

const props = defineProps({
  name: String,
  title: String,
})

const tagInput = ref('') // Current value of the input field
const tags = ref([]) // List of tags

const { errorMessage: fieldError, handleBlur, handleChange } = useField(props.name)
const { isSubmitting } = useForm()

// Function to add a tag to the list
const addTag = (e) => {
  e.preventDefault()
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    tagInput.value = ''
    handleChange(tags.value) // Trigger validation to update the form state
  }
}

// Function to remove a tag from the list
const removeTag = (tag) => {
  const index = tags.value.indexOf(tag)
  if (index !== -1) {
    tags.value.splice(index, 1)
    handleChange(tags.value) // Update the form state
  }
}

const handleInputBlur = () => {
  handleBlur() // Trigger validation on blur
}

watch(tags, () => {
  handleChange(tags.value) // Re-run validation when tags change
})

watch(isSubmitting, () => {
  tags.value = [] // Clear tags on form submission
})
</script>

<template>
  <div class="w-full space-y-2">
    <label class="text-sm" :for="props.name">{{ props.title }}</label>
    <div class="flex items-center gap-4">
      <Input
        class="rounded-none"
        :placeholder="`Enter ${props.title} here`"
        :status="fieldError ? 'error' : ''"
        :id="props.name"
        @blur="handleInputBlur"
        @input="handleChange"
        v-model:value="tagInput"
      />
      <Button :disabled="!tagInput" class="rounded-none" @click="addTag"> + </Button>
    </div>

    <div class="flex">
      <div v-for="(tag, index) in tags" :key="index">
        <Tag
          class="flex items-center justify-center w-fit"
          color="cyan"
          closable
          @close="() => removeTag(tag)"
        >
          <span class="mb-1">
            {{ tag }}
          </span>
        </Tag>
      </div>
    </div>

    <span v-if="fieldError" class="text-sm text-red-500">{{ fieldError }}</span>
  </div>
</template>

<style scoped></style>
