<template>
  <div class="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-xl flex flex-col relative text-[#111418] dark:text-white font-display">
    
    <!-- Login Overlay -->
    <div v-if="!isAuthenticated" class="absolute inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
      <div class="bg-primary/10 p-4 rounded-full mb-4">
        <span class="material-symbols-outlined text-primary text-4xl">lock</span>
      </div>
      <h2 class="text-xl font-bold">Admin Access Required</h2>
      <input 
        v-model="password" 
        type="password" 
        placeholder="Enter Admin Password" 
        class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 h-12 px-4 focus:border-primary focus:ring-primary"
        @keyup.enter="login"
      />
      <button @click="login" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        Unlock Dashboard
      </button>
      <p v-if="error" class="text-red-500 text-sm font-bold">{{ error }}</p>
    </div>

    <!-- Header -->
    <header class="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
      <div class="text-primary flex size-10 shrink-0 items-center justify-center">
        <span class="material-symbols-outlined text-2xl">terminal</span>
      </div>
      <h1 class="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">IT Work Report</h1>
    </header>

    <main class="flex-1 overflow-y-auto p-6 space-y-6">
       <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Daily Progress Log</h3>
        <span class="bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">Draft</span>
      </div>

      <!-- Department Selector -->
      <div class="space-y-1.5">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Department</label>
        <div class="relative">
          <select v-model="selectedDepartment" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 pl-4 pr-10 focus:border-primary focus:ring-primary appearance-none">
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">expand_more</span>
        </div>
      </div>

      <!-- Date Picker -->
      <div class="space-y-1.5">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Report Date</label>
        <input v-model="reportDate" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary" type="date"/>
      </div>

      <!-- Report Title -->
      <div class="space-y-1.5">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Report Title</label>
        <input v-model="reportTitle" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary" type="text" placeholder="e.g., Weekly Server Maintenance"/>
      </div>

      <!-- Detailed Progress -->
      <div class="space-y-1.5">
         <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Detailed Progress</label>
         <textarea v-model="reportDescription" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white p-4 focus:border-primary focus:ring-primary resize-none" rows="6" placeholder="Describe tasks..."></textarea>
      </div>

      <!-- Optional Media -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Image URL (Optional)</label>
          <input v-model="imageUrl" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary" type="text" placeholder="https://..."/>
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Video URL (YouTube / Google Drive)</label>
          <input v-model="youtubeUrl" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary" type="text" placeholder="https://youtube.com/... or Google Drive link"/>
        </div>
      </div>

      <!-- Tags Selection -->
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</label>
        <div class="flex flex-wrap gap-2">
            <button 
                v-for="tag in availableTags" 
                :key="tag"
                @click="toggleTag(tag)"
                :class="selectedTags.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200'"
                class="px-3 py-1.5 text-xs font-bold rounded-full border transition-colors uppercase"
            >
                {{ tag }}
            </button>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4">
        <button @click="submitReport" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <span class="material-symbols-outlined">send</span>
          Submit Report
        </button>
        <p v-if="submitMessage" :class="{'text-green-500': submitSuccess, 'text-red-500': !submitSuccess}" class="text-center mt-2">{{ submitMessage }}</p>
      </div>

    </main>

    <!-- Bottom Nav -->
    <nav class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 px-6 py-3 flex justify-between items-center sticky bottom-0">
      <router-link to="/" class="flex flex-col items-center gap-1 text-gray-400">
        <span class="material-symbols-outlined">home</span>
      </router-link>
      <a class="flex flex-col items-center gap-1 text-primary" href="#">
        <span class="material-symbols-outlined">edit_document</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-gray-400" href="#">
        <span class="material-symbols-outlined">history</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-gray-400" href="#">
        <span class="material-symbols-outlined">settings</span>
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isAuthenticated = ref(false);
const password = ref('');
const error = ref('');

// Form data
const departments = ref<any[]>([]);
const selectedDepartment = ref<number | null>(null);
const reportDate = ref(new Date().toISOString().split('T')[0]);
const reportTitle = ref('');
const reportDescription = ref('');
const imageUrl = ref('');
const youtubeUrl = ref('');
const submitMessage = ref('');
const submitSuccess = ref(false);

const login = () => {
  if (password.value === '01121000099') {
    isAuthenticated.value = true;
    error.value = '';
    fetchDepartments();
  } else {
    error.value = 'Invalid password';
  }
};

const fetchDepartments = async () => {
    try {
        const res = await fetch('/api/departments');
        if(res.ok) {
            departments.value = await res.json();
            
            // If API returns empty array (db exists but empty), use fallback
            if (departments.value.length === 0) {
                 throw new Error('Empty departments');
            }

            // Default select IT if exists
            const itDept = departments.value.find((d: any) => d.short_name === 'IT');
            if(itDept) selectedDepartment.value = Number(itDept.id);
        } else {
             throw new Error('API Error');
        }
    } catch(e) {
        console.warn('API error');
    }
}

const availableTags = ['NEW FUNCTION', 'AI', 'FIX', 'MEETING & TUTORIAL'];
const selectedTags = ref<string[]>([]);
const toggleTag = (tag: string) => {
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter(t => t !== tag);
    } else {
        selectedTags.value.push(tag);
    }
};

const submitReport = async () => {
    if (!selectedDepartment.value || !reportTitle.value || !reportDescription.value) {
        submitMessage.value = 'Please fill all required fields';
        submitSuccess.value = false;
        return;
    }

    try {
        const res = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                department_id: selectedDepartment.value,
                title: reportTitle.value,
                description: reportDescription.value,
                report_date: reportDate.value,
                image_url: imageUrl.value,
                youtube_url: youtubeUrl.value,
                tags: selectedTags.value.join(',') // Store as check strings
            })
        });
        
        if (res.ok) {
            submitMessage.value = 'Report submitted successfully!';
            submitSuccess.value = true;
            // Reset form
            reportTitle.value = '';
            reportDescription.value = '';
        } else {
            throw new Error('Failed to submit');
        }
    } catch (e) {
        console.error(e);
        submitMessage.value = 'Error submitting report (Check console/server)';
        submitSuccess.value = false;
    }
};
</script>
