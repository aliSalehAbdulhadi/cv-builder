<script setup>
import * as Yup from 'yup'
import { CheckCircleFilled } from '@ant-design/icons-vue'

import InputImage from './components/form/InputImage.vue'
import InputTags from './components/form/InputTags.vue'
import InputDate from './components/form/InputDate.vue'
import FormBlock from './components/form/FormBlock.vue'
import InputColor from './components/form/InputColor.vue'
import WizardForm from './components/form/WizardForm.vue'
import InputField from './components/form/InputField.vue'

const validationSchemas = [
  // Step 1: Personal Info
  Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format'),
    mobile: Yup.string(),
    street: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
    linkedin: Yup.string().url('Invalid URL format').optional(),
    github: Yup.string().url('Invalid URL format').optional(),
    position: Yup.string(),
    skills: Yup.mixed().optional(),
    personalImage: Yup.mixed().optional(),
  }),
  // Step 2: Experience Info
  Yup.object({
    'organization-0': Yup.string(),
    'position-0': Yup.string(),
    'duration-0': Yup.array()
      .of(Yup.date().required('Date is required'))
      .length(2, 'Please select a start and end date')
      .typeError('Invalid date range format'),

    'description-0': Yup.string().optional(),
  }),
  // Step 3: Project Info
  Yup.object({
    'title-0': Yup.string(),
    'link-0': Yup.string().url('Invalid URL format').optional(),
    'project-description-0': Yup.string().optional(),
  }),
  // Step 4: Education Info
  Yup.object({
    'college-0': Yup.string(),
    'year-0': Yup.array()
      .of(Yup.date().required('Date is required'))
      .length(2, 'Please select a start and end date')
      .typeError('Invalid date range format'),
    'qualification-0': Yup.string(),
    'education-description-0': Yup.string().optional(),
  }),
  // Step 5: Miscellaneous
  Yup.object({
    languages: Yup.mixed().optional(),
    achievements: Yup.mixed().optional(),
    certificates: Yup.mixed().optional(),
  }),
  // Step 6: Color
  Yup.object({
    color: Yup.mixed(),
  }),
]

const initialValues = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  mobile: '+1234567890',
  street: '123 Main Street',
  city: 'New York',
  country: 'USA',
  linkedin: 'https://www.linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  position: 'Software Engineer',
  skills: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'],
  personalImage: {},
}

const steps = [
  { title: 'Personal Info' },
  { title: 'Experience Info' },
  { title: 'Project Info' },
  { title: 'Education Info' },
  { title: 'Miscellaneous' },
  { title: 'Color' },
  { title: 'Finish' },
]
</script>

<template>
  <div class="flex items-center justify-center w-full min-h-screen bg-gray-50">
    <WizardForm
      :validationSchemas="validationSchemas"
      :initialValues="initialValues"
      title="Enter Your Info"
      :steps="steps"
    >
      <template #step-1>
        <div class="flex flex-col gap-y-3">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InputField name="name" title="Name" />
            <InputField name="email" title="Email" type="email" />
            <InputField name="mobile" title="Mobile" />
            <InputField name="street" title="Street" />
            <InputField name="city" title="City" />
            <InputField name="country" title="Country" />
          </div>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <InputField name="linkedin" title="Linkedin" />
            <InputField name="github" title="Github" />
          </div>
          <div>
            <InputField name="position" title="Position" />
          </div>
          <div>
            <InputTags name="skills" title="Skills" />
          </div>
          <div>
            <InputImage name="personalImage" title="Personal Image" />
          </div>
        </div>
      </template>

      <template #step-2>
        <FormBlock>
          <template #default="{ index }">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <InputField :name="`organization-${index}`" title="Organization" />
              <InputField :name="`position-${index}`" title="Position" />
              <InputDate :name="`duration-${index}`" title="Duration" />
            </div>
            <div>
              <InputField :name="`description-${index}`" title="Description" />
            </div>
          </template>
        </FormBlock>
      </template>

      <template #step-3>
        <FormBlock>
          <template #default="{ index }">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField :name="`title-${index}`" title="Title" />
              <InputField :name="`link-${index}`" title="Link" />
            </div>
            <div>
              <InputField :name="`step-3-description-${index}`" title="Description" />
            </div>
          </template>
        </FormBlock>
      </template>

      <template #step-4>
        <FormBlock>
          <template #default="{ index }">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <InputField :name="`college-${index}`" title="College" />
              <InputDate :name="`year-${index}`" title="Year" />
              <InputField :name="`qualification-${index}`" title="Qualification" />
            </div>
            <div>
              <InputField :name="`step-4-description-${index}`" title="Description" />
            </div>
          </template>
        </FormBlock>
      </template>

      <template #step-5>
        <div>
          <InputTags name="languages" title="Languages" />
          <InputTags name="achievements" title="Achievements" />
          <InputTags name="certificates" title="Certificates" />
        </div>
      </template>

      <template #step-6>
        <div class="flex items-center justify-center">
          <InputColor name="color" />
        </div>
      </template>

      <template #step-7>
        <div class="flex flex-col items-center justify-center gap-y-3">
          <span class="text-xl">Congrats your CV is ready!</span>
          <CheckCircleFilled class="text-[100px] text-green-700" />
        </div>
      </template>
    </WizardForm>
  </div>
</template>
