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
      <!-- HOD Section -->
      <section class="p-4">
        <h2 class="text-[#111418] text-lg font-bold leading-tight mb-4">HOD Remarks & Planning</h2>
        <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div class="flex items-center gap-4">
            <div class="size-16 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
              <img v-if="department?.hod_image" :src="department.hod_image" alt="HOD" class="w-full h-full object-cover"/>
              <div v-else class="w-full h-full flex items-center justify-center text-primary font-bold text-xl">{{ department?.hod_initials }}</div>
            </div>
            <div>
              <p class="text-[#111418] text-lg font-bold">{{ department?.hod_name }}</p>
              <p class="text-[#637588] text-sm font-medium">{{ department?.hod_title }}</p>
            </div>
          </div>
          
          <div class="space-y-3 pt-2">
            <div v-for="plan in plans" :key="plan.id" class="flex gap-3 items-start">
              <span class="material-symbols-outlined text-primary mt-0.5 text-[20px]">{{ plan.icon }}</span>
              <div>
                <p class="text-sm font-semibold text-[#111418]">{{ plan.title }}</p>
                <p class="text-sm text-[#637588] leading-relaxed">{{ plan.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Work Reports Section -->
      <section class="p-4 bg-gray-50/50">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[#111418] text-lg font-bold leading-tight">IT Work Reports</h2>
          <span class="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">Recent Activity</span>
        </div>
        
        <div class="space-y-3">
          <div v-for="report in reports" :key="report.id" class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative">
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
import { useRoute } from 'vue-router';

const route = useRoute();
const deptId = route.params.id;

// Mock data
const mockDepartmentsList: Record<string, any> = {
  '1': { name: 'Operations & Maintenance', hod_name: 'John Doe', hod_title: 'Head of O&M', hod_initials: 'JD' },
  '2': { name: 'Sales Department', hod_name: 'Mark Henderson', hod_title: 'Head of Sales', hod_initials: 'MH', hod_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjxrEAkiSphIdkS7fcw-EwwT8Q0g0IfE-ui-6mABAqCGrR37rQRzLwrgpsRhIR1I9Ujc0AO-J6hkkXCrSExZxVQYBaGQQ-3Zz2emxeTB7paSizaRHF0x4JMBQaBK6gVBkLhEsZLPxpUXbqpPX1NtIewDhCGoBKewnkaiyaqlTlEKiBV0ALyP2LClPYmMNWZ0buLBUlNlY2rTMXwgDdglSLQw6y287HL316kq18z0K6PfNSWh1vaBukGSR4dqg_KAXbZ6D2Vwn50_lC' },
  '3': { name: 'Finance Department', hod_name: 'Jane Smith', hod_title: 'CFO', hod_initials: 'JS' },
  '4': { name: 'Administration', hod_name: 'Admin User', hod_title: 'Head of Admin', hod_initials: 'AD' },
  '5': { name: 'SEDA', hod_name: 'Green Keeper', hod_title: 'Head of SEDA', hod_initials: 'GK' },
  '6': { name: 'Customer Service', hod_name: 'Sarah Connor', hod_title: 'Head of CS', hod_initials: 'SC' },
  '7': { name: 'Human Resources', hod_name: 'Mike Ross', hod_title: 'CHRO', hod_initials: 'MR' },
  '8': { name: 'Engineering', hod_name: 'Tony Stark', hod_title: 'Chief Engineer', hod_initials: 'TS' },
  '9': { name: 'Control & Instrumentation', hod_name: 'Steve Jobs', hod_title: 'Head of C&I', hod_initials: 'SJ' },
  '10': { name: 'Information Technology', hod_name: 'Bill Gates', hod_title: 'CTO', hod_initials: 'BG' },
  '11': { name: 'Project Management', hod_name: 'Peter Parker', hod_title: 'Project Lead', hod_initials: 'PP' },
  '12': { name: 'Procurement', hod_name: 'Bruce Wayne', hod_title: 'Head of Procurement', hod_initials: 'BW' },
  '13': { name: 'Efficiency', hod_name: 'Barry Allen', hod_title: 'Efficiency Expert', hod_initials: 'BA' },
  '14': { name: 'Culture', hod_name: 'Diana Prince', hod_title: 'Culture Lead', hod_initials: 'DP' },
};

const mockDepartment = {
  id: deptId,
  ...(mockDepartmentsList[deptId as string] || { name: 'Unknown Department', hod_name: 'N/A', hod_title: 'N/A', hod_initials: 'NA' })
};

const mockPlans = [
  { id: 1, title: 'Request of Features', description: 'System function upgrade for real-time tracking.', icon: 'assignment' },
  { id: 2, title: 'Q4 Strategic Planning', description: 'Integration of external market data into dashboard.', icon: 'trending_up' },
  { id: 3, title: 'Review Status', description: 'Weekly automated reporting efficiency has improved by 40%.', icon: 'verified' },
];

const mockReports = [
  { id: 1, title: 'CRM Integration Upgrade', description: 'Successfully deployed the enhanced lead tracking module.', date: 'Oct 24, 2023' },
  { id: 2, title: 'Dashboard Performance Tuning', description: 'Optimized SQL queries. Reduced load time from 4.2s to 0.8s.', date: 'Oct 20, 2023' },
];

const department = ref<any>(null);
const plans = ref<any[]>([]);
const reports = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await fetch(`/api/departments/${deptId}`);
    if (response.ok) {
      const data = await response.json();
      department.value = data.department;
      plans.value = data.plans;
      reports.value = data.reports.map((r: any) => ({
        ...r,
        date: new Date(r.report_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      }));
    } else {
       throw new Error('Failed to fetch');
    }
  } catch (e) {
    console.warn('API not available, using mock data');
    department.value = mockDepartment;
    plans.value = mockPlans;
    reports.value = mockReports;
  }
});
</script>
