<script setup>
import { ref, defineProps, watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import { Button, Steps, Step } from 'ant-design-vue'

import { exportToPDF } from '../../utilities/exportToPDF'

const props = defineProps({
  validationSchemas: Array,
  initialValues: Object,
  title: String,
  steps: Array,
})

const currentStep = ref(0)
const stepData = ref({})

// Dynamically update validation schema based on the current step
const currentValidationSchema = computed(() => {
  return props.validationSchemas[currentStep.value] || {}
})

// Initialize form with dynamic schema for each step
const {
  handleSubmit,
  resetForm,
  values,
  validate: formValidate,
} = useForm({
  validationSchema: currentValidationSchema,
  initialValues: props.initialValues,
})

// Watch for step changes to update the form validation schema dynamically
watch(currentStep, () => {
  resetForm({ values: stepData.value, errors: {} })
})

// Handle navigation to the next step (with validation)
const nextStep = handleSubmit(async () => {
  // Validate the current step form
  const isValid = await formValidate()
  if (isValid) {
    stepData.value = { ...stepData.value, ...values } // Merge current step data into main data
    if (currentStep.value < props.steps.length - 1) {
      currentStep.value++ // Go to the next step
    }
  } else {
    console.log('Validation failed for step:', currentStep.value)
  }
})

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value-- // Go to the previous step
  }
}

const onSubmit = handleSubmit((finalValues) => {
  exportToPDF({ ...stepData.value, ...finalValues })
  resetForm()
  location.reload()
})
</script>

<template>
  <div class="flex flex-col items-center w-full p-10 gap-y-20">
    <h1 class="text-3xl opacity-70">Enter Your Information</h1>
    <div class="min-h-[700px] w-[80%] xl:w-[1100px] bg-white">
      <div class="py-5 border-b">
        <h1 class="px-5">{{ steps[currentStep].title }}</h1>
      </div>

      <div class="hidden py-5 mx-5 border-b xl:block">
        <Steps size="small" :current="currentStep">
          <Step v-for="(step, index) in props.steps" :key="index" :title="step.title" />
        </Steps>
      </div>

      <form @submit="onSubmit" class="py-5 mx-5">
        <div class="flex flex-col gap-3">
          <div v-for="(step, index) in props.steps" :key="index" v-show="currentStep === index">
            <slot :name="'step-' + (index + 1)" />
          </div>

          <div class="flex justify-end mt-6 gap-x-3">
            <Button
              class="rounded-none"
              type="default"
              @click="prevStep"
              :disabled="currentStep === 0"
            >
              Previous
            </Button>
            <Button
              v-if="currentStep !== props.steps.length - 1"
              class="rounded-none"
              type="primary"
              @click="nextStep"
            >
              Next
            </Button>
            <Button
              v-if="currentStep === props.steps.length - 1"
              class="rounded-none w-fit"
              type="primary"
              html-type="submit"
            >
              Download
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
