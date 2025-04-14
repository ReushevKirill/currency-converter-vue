<template>
  <div class="error-message">
    <slot />
  </div>
</template>

<style>
.error-message {
  padding: 1rem;
  text-align: center;
  border-radius: var(--p-border-radius);
  margin-bottom: 1rem;
}

.error-message {
  background-color: var(--p-red-100);
  color: var(--p-red-700);
  border: 1px solid var(--p-red-300);
}
</style>
