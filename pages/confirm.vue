<template>
  <UCard>
    <template #header>
      Signing in...
    </template>

    Wait a moment while we sign you in...
  </UCard>
</template>

<script setup>
useRedirectIfAuthenticated()

useHead({
  title: 'Confirmation',
  meta: [
    { name: 'Confirmation Page', content: 'Here the user waits till checking if authenticated or not.' }
  ],})
</script>