<template>
  <div class="max-w-md mx-auto bg-white min-h-screen shadow-sm flex flex-col relative pb-20">
    <!-- Header -->
    <header class="sticky top-0 z-10 flex items-center bg-white border-b border-gray-100 p-4 justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/')" class="text-primary flex items-center justify-center hover:bg-primary/10 rounded-full p-1 transition-colors">
          <span class="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
        <h1 class="text-[#111418] text-xl font-bold leading-tight tracking-tight">{{ department?.name || 'Department' }}</h1>
      </div>
      <button class="text-[#637588]">
        <span class="material-symbols-outlined">more_vert</span>
      </button>
    </header>

    <main class="flex-1 overflow-y-auto">


      <!-- Work Reports Section -->
      <section class="p-4 bg-gray-50/50">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[#111418] text-lg font-bold leading-tight">IT Work Reports</h2>
          <span class="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">Recent Activity</span>
        </div>
        
        <div class="space-y-3">
          <div v-for="report in reports" :key="report.id" @click="$router.push(`/report/${report.id}`)" class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative cursor-pointer hover:border-primary/50 transition-all">
             <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded">{{ report.date }}</span>
              <span class="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
            </div>
            <p class="text-sm font-semibold text-[#111418] mb-1">{{ report.title }}</p>
            <p class="text-sm text-[#637588] leading-normal">{{ report.description }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button class="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            View All Reports
            <span class="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Nav -->
    <nav class="sticky bottom-0 bg-white border-t border-gray-100 px-4 pb-6 pt-2">
      <div class="flex justify-around items-center max-w-sm mx-auto">
        <router-link to="/" class="flex flex-col items-center gap-1 text-[#637588]">
          <span class="material-symbols-outlined">dashboard</span>
          <p class="text-[10px] font-medium uppercase tracking-tighter">Dashboard</p>
        </router-link>
        <a class="flex flex-col items-center gap-1 text-primary" href="#">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">table_chart</span>
          <p class="text-[10px] font-bold uppercase tracking-tighter">Departments</p>
        </a>
        <a class="flex flex-col items-center gap-1 text-[#637588]" href="#">
          <span class="material-symbols-outlined">description</span>
          <p class="text-[10px] font-medium uppercase tracking-tighter">Reports</p>
        </a>
        <a class="flex flex-col items-center gap-1 text-[#637588]" href="#">
          <span class="material-symbols-outlined">settings</span>
          <p class="text-[10px] font-medium uppercase tracking-tighter">Settings</p>
        </a>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const deptId = route.params.id;

const deptId = route.params.id;
const router = useRouter();

const department = ref<any>(null);
const reports = ref<any[]>([]);
const error = ref('');

onMounted(async () => {
  try {
    const response = await fetch(`/api/departments/${deptId}`);
    if (response.ok) {
      const data = await response.json();
      department.value = data.department;
      reports.value = data.reports.map((r: any) => ({
        ...r,
        date: new Date(r.report_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    } else {
       throw new Error('Failed to fetch');
    }
  } catch (e: any) {
    console.warn('API error', e);
    error.value = e.message;
  }
});
</script>
