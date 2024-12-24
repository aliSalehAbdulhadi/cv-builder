<script setup>
import { useField } from 'vee-validate'
import { Input } from 'ant-design-vue'

const props = defineProps(['name', 'title', 'type'])

const { value: field, errorMessage: fieldError, handleBlur, handleChange } = useField(props.name)
</script>

<template>
  <div class="w-full space-y-2">
    <span class="text-sm">{{ props.title }}</span>
    <Input
      class="rounded-none"
      v-model:value="field"
      @blur="handleBlur"
      @input="handleChange"
      :type="type"
      :placeholder="`Enter ${props.title} here`"
      :status="fieldError ? 'error' : ''"
    />
    <span v-if="fieldError" class="text-sm text-red-500">{{ fieldError }}</span>
  </div>
</template>
