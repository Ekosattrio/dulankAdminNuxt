<script setup lang="ts">
interface TopPage {
  path: string
  views: number
  avgTime: string
  exitRate: string
  badgeColor: string
}

const topPages: TopPage[] = [
  { path: 'rasket/dashboard.html', views: 4265, avgTime: '09m:45s', exitRate: '20.4%', badgeColor: 'bg-[#EA5455]' },
  { path: 'rasket/chat.html', views: 2584, avgTime: '05m:02s', exitRate: '12.25%', badgeColor: 'bg-[#FF9F43]' },
  { path: 'rasket/auth-login.html', views: 3369, avgTime: '04m:25s', exitRate: '5.2%', badgeColor: 'bg-[#28C76F]' },
  { path: 'rasket/email.html', views: 985, avgTime: '02m:03s', exitRate: '64.2%', badgeColor: 'bg-[#EA5455]' },
  { path: 'rasket/social.html', views: 653, avgTime: '15m:56s', exitRate: '2.4%', badgeColor: 'bg-[#28C76F]' },
  { path: '/dashboard', views: 4265, avgTime: '09m:45s', exitRate: '20.4%', badgeColor: 'bg-[#EA5455]' },
  { path: '/chat', views: 2584, avgTime: '05m:02s', exitRate: '12.25%', badgeColor: 'bg-[#FF9F43]' },
  { path: '/auth-login', views: 3369, avgTime: '04m:25s', exitRate: '5.2%', badgeColor: 'bg-[#28C76F]' },
  { path: '/email', views: 985, avgTime: '02m:03s', exitRate: '64.2%', badgeColor: 'bg-[#EA5455]' },
  { path: '/social', views: 653, avgTime: '15m:56s', exitRate: '2.4%', badgeColor: 'bg-[#28C76F]' }
]

const emit = defineEmits<{
  (e: 'viewDetail', title: string, desc: string): void
}>()
</script>

<template>
  <div class="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-5">
    <div>
      <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h6 class="text-sm font-bold text-gray-900 dark:text-white">Top Pages</h6>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('viewDetail', 'Top Pages Analysis', 'Audit of most visited landing pages with average user engagement duration and exit bounce percentage.')"
        >
          View All
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/60 text-xs font-bold uppercase text-gray-400 dark:border-gray-800 dark:bg-gray-800/40">
              <th class="py-2.5 pe-2 ps-3">Page Path</th>
              <th class="px-2 py-2.5 text-center">Page Views</th>
              <th class="px-2 py-2.5 text-center">Avg Time</th>
              <th class="pe-3 ps-2 py-2.5 text-end">Exit Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800/60">
            <tr
              v-for="(page, idx) in topPages"
              :key="idx"
              class="cursor-pointer transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
              @click="emit('viewDetail', page.path, `Page: ${page.path}\nViews: ${page.views}\nAvg Time on Page: ${page.avgTime}\nExit Rate: ${page.exitRate}`)"
            >
              <td class="font-mono text-xs text-primary-600 hover:underline py-2.5 pe-2 ps-3">
                {{ page.path }}
              </td>
              <td class="px-2 py-2.5 text-center font-bold text-gray-900 dark:text-white">
                {{ page.views.toLocaleString() }}
              </td>
              <td class="px-2 py-2.5 text-center text-gray-500 dark:text-gray-400">
                {{ page.avgTime }}
              </td>
              <td class="pe-3 ps-2 py-2.5 text-end">
                <span class="inline-block rounded px-2 py-0.5 text-xs font-semibold text-white" :class="page.badgeColor">
                  {{ page.exitRate }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

