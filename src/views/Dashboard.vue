<template>
  <div class="bg-background-light text-slate-900 min-h-screen flex flex-col pb-24 relative">
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
          <span class="text-xs font-medium text-primary">{{ departments.length }} Departments</span>
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <button 
            v-for="dept in departments" 
            :key="dept.id"
            @click="goToDepartment(dept.id)"
            class="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/50 transition-all group"
          >
            <span class="material-symbols-outlined text-primary mb-2 group-hover:scale-110 transition-transform">{{ dept.icon }}</span>
            <span class="text-[10px] font-bold text-slate-700 truncate w-full text-center">{{ dept.shortName }}</span>
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
          <div v-for="report in reports" :key="report.id" class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex gap-4">
            <div class="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 min-w-[70px] h-fit">
              <span class="text-[10px] font-bold text-slate-400 uppercase">{{ report.dateMonth }}</span>
              <span class="text-sm font-black text-slate-800">{{ report.dateYear }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{{ report.deptName }}</span>
                <span class="material-symbols-outlined text-slate-300 text-lg">more_horiz</span>
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

// Mock data fallback
const mockDepartments = [
  { id: 1, name: 'Operations & Maintenance', shortName: 'O&M', icon: 'settings' },
  { id: 2, name: 'Sales', shortName: 'SALES', icon: 'handshake' },
  { id: 3, name: 'Finance', shortName: 'FINANCE', icon: 'payments' },
  { id: 4, name: 'Administration', shortName: 'ADMIN', icon: 'business_center' },
  { id: 5, name: 'SEDA', shortName: 'SEDA', icon: 'eco' },
  { id: 6, name: 'Customer Service', shortName: 'CS', icon: 'support_agent' },
  { id: 7, name: 'Human Resources', shortName: 'HR', icon: 'groups' },
  { id: 8, name: 'Engineering', shortName: 'ENG', icon: 'precision_manufacturing' },
  { id: 9, name: 'Control & Instrumentation', shortName: 'C&I', icon: 'memory' },
  { id: 10, name: 'Information Technology', shortName: 'IT', icon: 'terminal' },
  { id: 11, name: 'Project Management', shortName: 'PROJECT', icon: 'assignment' },
  { id: 12, name: 'Procurement', shortName: 'PROC', icon: 'shopping_cart' },
  { id: 13, name: 'Efficiency', shortName: 'EFF', icon: 'speed' },
  { id: 14, name: 'Culture', shortName: 'CULTURE', icon: 'favorite' },
];

const mockReports = [
  { id: 1, dateMonth: '11-FEB', dateYear: '2026', deptName: 'IT Department', title: 'Network Infrastructure Expansion', description: 'Completed phase 2 of core router upgrades across regional hubs.' },
  { id: 2, dateMonth: '10-FEB', dateYear: '2026', deptName: 'FINANCE', title: 'ERP Cloud Migration', description: 'Data cleansing phase for payroll modules finalized.' },
  { id: 3, dateMonth: '08-FEB', dateYear: '2026', deptName: 'O&M', title: 'Smart Grid Sensors', description: 'Integrated 500+ IoT sensors into the centralized monitoring dashboard.' },
];

const departments = ref<any[]>([]);
const reports = ref<any[]>([]);

onMounted(async () => {
  try {
    const deptResponse = await fetch('/api/departments');
    if (deptResponse.ok) {
      departments.value = await deptResponse.json();
    } else {
      departments.value = mockDepartments;
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
      reports.value = mockReports;
    }
  } catch (e) {
    console.warn('API not available, using mock data');
    departments.value = mockDepartments;
    reports.value = mockReports;
  }
});

const goToDepartment = (id: number) => {
  router.push(`/department/${id}`);
};
</script>
