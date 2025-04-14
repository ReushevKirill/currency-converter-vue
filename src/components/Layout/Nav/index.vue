<template>
  <nav class="nav">
    <NavLink :to="link.to" :key="link.to" v-for="link in links">
      {{ link.content }}
    </NavLink>
  </nav>
</template>

<script lang="ts" setup>
import NavLink from '@/components/Layout/Nav/Link.vue'

const links = [
  {
    to: '/',
    content: 'Главная',
  },
  {
    to: '/convert',
    content: 'Конвертация',
  },
]
</script>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
}
</style>
