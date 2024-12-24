<script setup>
import { useField } from 'vee-validate'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
import '@cyhnkckali/vue3-color-picker/dist/style.css'

const props = defineProps(['name', 'title'])

const { value: field, errorMessage: fieldError } = useField(props.name)
</script>

<template>
  <div class="self-center">
    <span>{{ props.title }}</span>
    <Vue3ColorPicker
      class="rounded-none"
      v-model="field"
      mode="solid"
      :showAlpha="false"
      :showPickerMode="false"
      :showInputMenu="false"
    />
    <span v-if="fieldError" class="text-sm text-red-500">{{ fieldError }}</span>
  </div>
</template>
