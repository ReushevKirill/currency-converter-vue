<template>
  <div class="loading-indicator">
    <p>
      <slot />
    </p>
    <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="8" />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.loading-indicator {
  padding: 1rem;
  text-align: center;
  border-radius: var(--p-border-radius);
  margin-bottom: 1rem;
}

.loading-indicator {
  background-color: var(--p-highlight-bg);
  color: var(--p-highlight-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>
