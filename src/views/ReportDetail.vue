<template>
  <div class="bg-background-light text-slate-900 min-h-screen flex flex-col pb-24 relative">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3">
        <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
            <span class="material-symbols-outlined text-slate-600">arrow_back</span>
        </button>
        <h1 class="text-sm font-bold tracking-tight text-slate-900 leading-none">Report Details</h1>
    </header>

    <main class="flex-1 overflow-y-auto p-4 space-y-4" v-if="report">
        <!-- Meta Info -->
        <div class="flex items-center justify-between">
             <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded uppercase">{{ report.dept_short_name || 'DEPT' }}</span>
             <span class="text-xs font-bold text-slate-400">{{ formatDate(report.report_date) }}</span>
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-slate-900 leading-tight">{{ report.title }}</h2>

        <!-- Image -->
        <div v-if="report.image_url" class="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <img :src="report.image_url" alt="Report Image" class="w-full h-auto object-cover max-h-64" @error="handleImageError">
        </div>

        <!-- YouTube -->
            <iframe 
                v-if="getYouTubeEmbed(report.youtube_url)"
                :src="getYouTubeEmbed(report.youtube_url) || ''" 
                title="Report Video"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="w-full h-full"
            ></iframe>
        </div>

        <!-- Body -->
        <div class="prose prose-sm prose-slate max-w-none">
            <p class="whitespace-pre-wrap text-slate-700 leading-relaxed">{{ report.description }}</p>
        </div>

        <!-- Admin Controls (Only visible if navigated from admin, for now purely visual until auth is global) -->
        <div class="border-t border-slate-200 pt-4 mt-8 flex gap-3">
             <button @click="deleteReport" class="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">delete</span>
                Delete
             </button>
             <button @click="editReport" class="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">edit</span>
                Edit
             </button>
        </div>
    </main>

    <div v-else-if="loading" class="flex-1 flex items-center justify-center">
        <span class="animate-pulse text-primary font-bold">Loading Report...</span>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <span class="material-symbols-outlined text-4xl mb-2">sentiment_dissatisfied</span>
        <p>Report not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const reportId = route.params.id;
const report = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const res = await fetch(`/api/reports/${reportId}`);
        if(res.ok) {
            report.value = await res.json();
        }
    } catch(e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getYouTubeEmbed = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const handleImageError = (e: Event) => {
    (e.target as HTMLImageElement).style.display = 'none';
};

const deleteReport = async () => {
    if(!confirm('Are you sure you want to delete this report?')) return;
    try {
        const res = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
        if(res.ok) {
            alert('Report deleted');
            router.back();
        } else {
            alert('Failed to delete');
        }
    } catch(e) {
        alert('Error deleting report');
    }
};

const editReport = () => {
    // Navigate to admin with edit mode (future implementation)
    // For now simple alert
    alert('Edit feature coming in next patch - please use Delete and Repost for now.');
};
</script>
