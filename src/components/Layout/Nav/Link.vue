<template>
  <RouterLink :to="to" class="nav-link">
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

defineProps<{
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric
}>()
</script>

<style scoped>
.nav-link {
  text-decoration: none;
  color: var(--p-primary-color);
  padding: 0.5rem;
  border-radius: var(--p-border-radius);
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: color-mix(in srgb, var(--p-primary-color) 10%, transparent);
}

.router-link-exact-active {
  font-weight: bold;
  background-color: color-mix(in srgb, var(--p-primary-color) 20%, transparent);
}
</style>
