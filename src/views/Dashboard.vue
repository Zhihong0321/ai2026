<template>
  <div class="bg-background-light text-slate-900 min-h-screen flex flex-col pb-24 relative">
    <div v-if="error" class="bg-red-500 text-white p-4 text-center sticky top-0 z-50 font-bold">
        ❌ Error: {{ error }}
    </div>
    <!-- Top Navigation / Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined">analytics</span>
        </div>
        <div class="flex flex-col">
          <h1 class="text-sm font-bold tracking-tight text-slate-900 leading-none">2026 AI & DIGITALISATION PLAN</h1>
          <p class="text-[10px] font-medium text-primary mt-0.5">AI 上身 马上行动</p>
        </div>
      </div>
      <button class="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-colors">
        <span class="material-symbols-outlined text-slate-600">account_circle</span>
      </button>
    </header>

    <main class="flex-1 overflow-y-auto">
      <!-- Quick Access Section -->
      <section class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Quick Access</h2>
          <span v-if="loading" class="text-xs font-medium text-primary animate-pulse">Loading...</span>
          <span v-else class="text-xs font-medium text-primary">{{ departments.length }} Departments</span>
        </div>
        <div v-if="loading" class="text-center py-10 text-slate-400 text-sm">Loading data...</div>
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <button 
            v-for="dept in departments" 
            :key="dept.id"
            @click="goToDepartment(dept.id)"
            class="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/50 transition-all group"
          >
            <span class="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">{{ dept.icon }}</span>
            <span class="text-[10px] font-bold text-slate-700 truncate w-full text-center">{{ dept.short_name || dept.shortName }}</span>
          </button>
        </div>
      </section>

      <!-- Recent Work Reports Section -->
      <section class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Work Reports</h2>
          <button class="text-xs font-semibold text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="report in reports" :key="report.id" @click="goToReport(report.id)" class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex gap-4 cursor-pointer hover:border-primary/50 transition-all">
            <div class="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 min-w-[70px] h-fit">
              <span class="text-[10px] font-bold text-slate-400 uppercase">{{ report.dateMonth }}</span>
              <span class="text-sm font-black text-slate-800">{{ report.dateYear }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{{ report.deptName }}</span>
                <span class="material-symbols-outlined text-slate-300 text-lg">more_horiz</span>
              </div>
              <!-- Tags -->
              <div v-if="report.tags" class="flex flex-wrap gap-1 mb-2">
                 <span v-for="tag in report.tags.split(',')" :key="tag" 
                    :class="{
                        'bg-emerald-100 text-emerald-700': tag === 'NEW FUNCTION',
                        'bg-purple-100 text-purple-700': tag === 'AI',
                        'bg-amber-100 text-amber-700': tag === 'FIX',
                        'bg-blue-100 text-blue-700': tag === 'MEETING & TUTORIAL'
                    }"
                    class="px-1.5 py-0.5 text-[9px] font-bold rounded border border-transparent uppercase"
                 >
                    {{ tag }}
                 </span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 mb-1">{{ report.title }}</h3>
              <p class="text-xs text-slate-600 leading-relaxed">{{ report.description }}</p>
            </div>
          </div>
          
          <!-- Load More Button -->
          <button class="w-full py-3 bg-white border border-slate-200 rounded-xl text-slate-500 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
            Load Archive Reports
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 pb-6 flex items-center justify-around z-20">
      <router-link to="/" class="flex flex-col items-center gap-1 text-primary">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter">Dashboard</span>
      </router-link>
      <router-link to="/admin" class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
        <span class="material-symbols-outlined">shield_with_heart</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter">Admin</span>
      </router-link>
      <!-- Floating Action Button -->
      <button @click="$router.push('/admin')" class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center border-4 border-background-light">
        <span class="material-symbols-outlined text-2xl">add</span>
      </button>
      <a class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
        <span class="material-symbols-outlined">analytics</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter">Stats</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors" href="#">
        <span class="material-symbols-outlined">settings</span>
        <span class="text-[10px] font-bold uppercase tracking-tighter">Config</span>
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock data deleted - relying on API

const departments = ref<any[]>([]);
const reports = ref<any[]>([]);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const deptResponse = await fetch('/api/departments');
    if (deptResponse.ok) {
      departments.value = await deptResponse.json();
    } else {
      console.warn('Failed to fetch departments');
    }

    const reportResponse = await fetch('/api/reports');
    if (reportResponse.ok) {
      const data = await reportResponse.json();
      reports.value = data.map((r: any) => ({
        ...r,
        deptName: r.dept_short_name || 'DEPT',
        dateMonth: new Date(r.report_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        dateYear: new Date(r.report_date).getFullYear(),
      }));
    } else {
      console.log('Failed to fetch reports');
    }
  } catch (e: any) {
    console.warn('API error', e);
    error.value = e.message || 'Unknown API Error';
  } finally {
    loading.value = false;
  }
});

const goToDepartment = (id: number) => {
  router.push(`/department/${id}`);
};

const goToReport = (id: number) => {
    router.push(`/report/${id}`);
};
</script>
