<script setup>
import { useField } from 'vee-validate'
import { Upload } from 'ant-design-vue'
import { ref } from 'vue'

const props = defineProps({
  name: String,
  title: String,
})

const { errorMessage: fieldError, handleChange } = useField(props.name)

const imageList = ref([])

// Prevent auto-uploading the image
const beforeUpload = () => {
  return false
}
</script>

<template>
  <div class="w-full space-y-2">
    <span class="text-sm">{{ props.title }}</span>

    <Upload
      v-model:fileList="imageList"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      accept="image/*"
      list-type="picture-card"
      :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }"
      class="w-full h-full"
    >
      <button v-if="imageList.length === 0" type="button">Upload Image</button>
    </Upload>

    <span v-if="fieldError" class="mt-2 text-sm text-red-500">{{ fieldError }}</span>
  </div>
</template>
