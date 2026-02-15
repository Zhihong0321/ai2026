<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router'

const dbStatus = ref<'checking' | 'connected' | 'disconnected'>('checking');

const checkHealth = async () => {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      dbStatus.value = 'connected';
    } else {
      dbStatus.value = 'disconnected';
    }
  } catch (e) {
    dbStatus.value = 'disconnected';
  }
};

onMounted(() => {
  checkHealth();
  // Poll every 10 seconds
  setInterval(checkHealth, 10000);
});
</script>

<template>
  <div class="relative">
    <div v-if="dbStatus !== 'connected'" class="fixed bottom-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-bold text-white shadow-lg flex items-center gap-2" :class="dbStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'">
      <span class="material-symbols-outlined text-[16px] animate-pulse" v-if="dbStatus === 'checking'">sync</span>
      <span class="material-symbols-outlined text-[16px]" v-else>cloud_off</span>
      {{ dbStatus === 'checking' ? 'Connecting to DB...' : 'Database Disconnected' }}
    </div>
    <RouterView />
  </div>
</template>

<style>
/* Global styles */
/* Can also be in src/style.css */
</style>
