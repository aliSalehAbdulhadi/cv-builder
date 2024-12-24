<script setup>
import { useField } from 'vee-validate'
import { RangePicker } from 'ant-design-vue'

const props = defineProps(['name', 'title'])

const { value: field, errorMessage: fieldError, handleBlur, handleChange } = useField(props.name)
</script>

<template>
  <div class="flex flex-col w-full space-y-2">
    <span class="text-sm">{{ props.title }}</span>

    <RangePicker
      class="rounded-none"
      v-model:value="field"
      @blur="handleBlur"
      @input="handleChange"
      :placeholder="[`Enter ${props.title} here`, `Enter ${props.title} here`]"
      :status="fieldError ? 'error' : ''"
      picker="month"
    />
    <span v-if="fieldError" class="text-sm text-red-500">{{ fieldError }}</span>
  </div>
</template>
