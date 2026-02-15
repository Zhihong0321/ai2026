<template>
  <div class="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen shadow-xl flex flex-col relative text-[#111418] dark:text-white font-display">
    
    <!-- Login Overlay -->
    <div v-if="!isAuthenticated" class="absolute inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
      <div class="bg-primary/10 p-4 rounded-full mb-4">
        <span class="material-symbols-outlined text-primary text-4xl">lock</span>
      </div>
      <h2 class="text-xl font-bold">Admin Edit Access Required</h2>
      <input 
        v-model="password" 
        type="password" 
        placeholder="Enter Admin Password" 
        class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 h-12 px-4 focus:border-primary focus:ring-primary"
        @keyup.enter="login"
      />
      <button @click="login" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        Unlock Edit Mode
      </button>
      <p v-if="error" class="text-red-500 text-sm font-bold">{{ error }}</p>
    </div>

    <!-- Header -->
    <header class="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
        <span class="material-symbols-outlined text-slate-600">arrow_back</span>
      </button>
      <h1 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">Edit Report</h1>
    </header>

    <main class="flex-1 overflow-y-auto p-6 space-y-6" v-if="departments.length > 0 || loading">
      
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
          <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Youtube Embed URL (Optional)</label>
          <input v-model="youtubeUrl" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary" type="text" placeholder="https://youtube.com/..."/>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-4">
        <button @click="updateReport" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <span class="material-symbols-outlined">save</span>
          Save Changes
        </button>
        <p v-if="submitMessage" :class="{'text-green-500': submitSuccess, 'text-red-500': !submitSuccess}" class="text-center mt-2">{{ submitMessage }}</p>
      </div>

    </main>
    <div v-else class="p-10 text-center text-gray-500">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const reportId = route.params.id;

const isAuthenticated = ref(false);
const password = ref('');
const error = ref('');

// Form data
const departments = ref<any[]>([]); // Just for check
const reportTitle = ref('');
const reportDescription = ref('');
const imageUrl = ref('');
const youtubeUrl = ref('');
const submitMessage = ref('');
const submitSuccess = ref(false);
const loading = ref(true);

const login = () => {
  if (password.value === '01121000099') {
    isAuthenticated.value = true;
    error.value = '';
    fetchReport();
  } else {
    error.value = 'Invalid password';
  }
};

const fetchReport = async () => {
    try {
        const res = await fetch(`/api/reports/${reportId}`);
        if(res.ok) {
            const data = await res.json();
            reportTitle.value = data.title;
            reportDescription.value = data.description;
            imageUrl.value = data.image_url || '';
            youtubeUrl.value = data.youtube_url || '';
            departments.value = [true]; // Hack to show form
        } else {
             throw new Error('API Error');
        }
    } catch(e) {
        console.warn('API error');
        error.value = 'Failed to load report';
    } finally {
        loading.value = false;
    }
}

const updateReport = async () => {
    if (!reportTitle.value || !reportDescription.value) {
        submitMessage.value = 'Please fill all required fields';
        submitSuccess.value = false;
        return;
    }

    try {
        const res = await fetch(`/api/reports/${reportId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: reportTitle.value,
                description: reportDescription.value,
                image_url: imageUrl.value,
                youtube_url: youtubeUrl.value
            })
        });
        
        if (res.ok) {
            submitMessage.value = 'Report updated successfully!';
            submitSuccess.value = true;
            setTimeout(() => {
                router.back();
            }, 1000);
        } else {
            throw new Error('Failed to update');
        }
    } catch (e) {
        console.error(e);
        submitMessage.value = 'Error updating report';
        submitSuccess.value = false;
    }
};
</script>
