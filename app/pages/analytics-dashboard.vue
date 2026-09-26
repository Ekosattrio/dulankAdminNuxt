<script setup lang="ts">
import FeatherIcon from "~/components/common/FeatherIcon.vue";
import BaseModal from "~/components/modal/BaseModal.vue";

definePageMeta({
  layout: "default",
});

useLegacyPage({
  title: 'Analytics Dashboard',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});

// --- State: Controls & Feedback ---
const isRefreshing = ref(false);
const toastMessage = ref<string | null>(null);

function showToast(msg: string) {
  toastMessage.value = msg;
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = null;
    }
  }, 3000);
}

function refreshAllData() {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    showToast("Analytics metrics refreshed successfully.");
  }, 500);
}

// --- Top 4 KPI Cards ---
const topStats = [
  {
    title: "Page View",
    value: "13,647",
    change: "+2.3%",
    changeType: "up",
    period: "Last Month",
    icon: "feather",
    iconColor: "text-[#28C76F]",
    bgColor: "bg-[#28C76F]/10",
  },
  {
    title: "Clicks",
    value: "9,526",
    change: "+8.1%",
    changeType: "up",
    period: "Last Month",
    icon: "mouse-pointer",
    iconColor: "text-[#00CFDD]",
    bgColor: "bg-[#00CFDD]/10",
  },
  {
    title: "Conversions",
    value: "976",
    change: "-0.3%",
    changeType: "down",
    period: "Last Month",
    icon: "layers",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "New Users",
    value: "$123.6k",
    change: "-10.6%",
    changeType: "down",
    period: "Last Month",
    icon: "user-plus",
    iconColor: "text-[#00CFDD]",
    bgColor: "bg-[#00CFDD]/10",
  },
];

// --- Performance Dual Chart (Page Views Bar + Clicks Line) ---
const selectedTimeframe = ref("ALL");
const timeframes = ["ALL", "1M", "6M", "1Y"];

const performanceData: Record<string, { pageViews: number[]; clicks: number[] }> = {
  ALL: {
    pageViews: [30, 60, 70, 55, 70, 60, 40, 75, 50, 65, 45, 60],
    clicks: [10, 20, 15, 25, 30, 20, 10, 35, 20, 30, 25, 40],
  },
  "1M": {
    pageViews: [45, 50, 60, 55, 65, 70, 55, 80, 65, 70, 60, 75],
    clicks: [15, 20, 25, 22, 30, 35, 25, 40, 30, 35, 28, 45],
  },
  "6M": {
    pageViews: [25, 45, 55, 40, 60, 50, 35, 65, 45, 55, 40, 50],
    clicks: [8, 15, 12, 18, 22, 16, 8, 28, 18, 25, 20, 32],
  },
  "1Y": {
    pageViews: [30, 60, 70, 55, 70, 60, 40, 75, 50, 65, 45, 60],
    clicks: [10, 20, 15, 25, 30, 20, 10, 35, 20, 30, 25, 40],
  },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const hoveredPerfIndex = ref<number | null>(null);

const activePerformance = computed(() => {
  return performanceData[selectedTimeframe.value] || performanceData.ALL;
});

// Calculate SVG coordinates for 720 x 200 viewbox
const svgPerfMetrics = computed(() => {
  const width = 720;
  const height = 190;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const maxVal = 90;

  const points = months.map((m, i) => {
    const x = padLeft + (i + 0.5) * (innerW / months.length);
    const pv = activePerformance.value.pageViews[i];
    const clk = activePerformance.value.clicks[i];

    const barH = (pv / maxVal) * innerH;
    const barY = padTop + innerH - barH;

    const lineY = padTop + innerH - (clk / maxVal) * innerH;

    return { x, barY, barH, lineY, pv, clk, month: m };
  });

  // Line path D
  let lineD = `M ${points[0].x} ${points[0].lineY}`;
  for (let i = 1; i < points.length; i++) {
    lineD += ` L ${points[i].x} ${points[i].lineY}`;
  }

  return { points, lineD, width, height, padLeft, padTop, innerW, innerH };
});

// --- Session by Browser ---
interface BrowserStat {
  name: string;
  percent: number;
  count: string;
  color: string;
}

const browserStats: BrowserStat[] = [
  { name: "Chrome", percent: 62.5, count: "5.06k", color: "bg-[#28C76F]" },
  { name: "Firefox", percent: 12.3, count: "1.5k", color: "bg-[#FF9F43]" },
  { name: "Safari", percent: 9.86, count: "1.03k", color: "bg-[#00CFDD]" },
  { name: "Brave", percent: 3.15, count: "0.3k", color: "bg-[#7367F0]" },
  { name: "Opera", percent: 3.01, count: "1.58k", color: "bg-[#EA5455]" },
  { name: "Falkon", percent: 2.8, count: "0.01k", color: "bg-[#82868B]" },
  { name: "Web", percent: 1.05, count: "2.51k", color: "bg-[#1E293B]" },
  { name: "Other", percent: 3.36, count: "3.6k", color: "bg-[#CBD5E1]" },
];

// --- Sessions by Country (Provinces in Indonesia) ---
const sessionsByCountry = [
  { name: "Jawa Barat", count: "659k", percent: 45 },
  { name: "Jakarta", count: "485k", percent: 33 },
  { name: "Banten", count: "355k", percent: 24 },
  { name: "Jawa Tengah", count: "204k", percent: 14 },
];

// --- Top Pages Table ---
interface TopPage {
  path: string;
  views: number;
  avgTime: string;
  exitRate: string;
  badgeColor: string;
}

const topPages: TopPage[] = [
  { path: "rasket/dashboard.html", views: 4265, avgTime: "09m:45s", exitRate: "20.4%", badgeColor: "bg-[#EA5455]" },
  { path: "rasket/chat.html", views: 2584, avgTime: "05m:02s", exitRate: "12.25%", badgeColor: "bg-[#FF9F43]" },
  { path: "rasket/auth-login.html", views: 3369, avgTime: "04m:25s", exitRate: "5.2%", badgeColor: "bg-[#28C76F]" },
  { path: "rasket/email.html", views: 985, avgTime: "02m:03s", exitRate: "64.2%", badgeColor: "bg-[#EA5455]" },
  { path: "rasket/social.html", views: 653, avgTime: "15m:56s", exitRate: "2.4%", badgeColor: "bg-[#28C76F]" },
  { path: "/dashboard", views: 4265, avgTime: "09m:45s", exitRate: "20.4%", badgeColor: "bg-[#EA5455]" },
  { path: "/chat", views: 2584, avgTime: "05m:02s", exitRate: "12.25%", badgeColor: "bg-[#FF9F43]" },
  { path: "/auth-login", views: 3369, avgTime: "04m:25s", exitRate: "5.2%", badgeColor: "bg-[#28C76F]" },
  { path: "/email", views: 985, avgTime: "02m:03s", exitRate: "64.2%", badgeColor: "bg-[#EA5455]" },
  { path: "/social", views: 653, avgTime: "15m:56s", exitRate: "2.4%", badgeColor: "bg-[#28C76F]" },
];

// --- Modals State ---
const isDetailModalOpen = ref(false);
const modalTitle = ref("");
const modalContent = ref("");

function openModal(title: string, desc: string) {
  modalTitle.value = title;
  modalContent.value = desc;
  isDetailModalOpen.value = true;
}
</script>

<template>
  <div class="page-wrapper min-h-screen pb-10">
    <div class="content mx-auto max-w-[1600px] px-4 pt-4 sm:px-6">
      <!-- Floating Toast Notification -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="toastMessage"
          class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-[#092C4C] px-4 py-3 text-xs font-semibold text-white shadow-lg"
        >
          <FeatherIcon name="check-circle" size="16" class="text-[#28C76F]" />
          <span>{{ toastMessage }}</span>
        </div>
      </Transition>

      <!-- Top Stats (4 Cards) in row mt-5 -->
      <div class="mb-5 mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="(card, idx) in topStats"
          :key="idx"
          class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <!-- Icon Square -->
          <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl" :class="card.bgColor">
            <FeatherIcon :name="card.icon" size="26" :class="card.iconColor" />
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <h5 class="text-2xl font-bold text-secondary dark:text-white leading-none mb-1">
              {{ card.value }}
            </h5>
            <h6 class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
              {{ card.title }}
            </h6>
            <div class="flex items-center gap-1 text-[11px] font-semibold">
              <span :class="['inline-flex items-center', card.changeType === 'up' ? 'text-success' : 'text-danger']">
                <FeatherIcon :name="card.changeType === 'up' ? 'arrow-up' : 'arrow-down'" size="12" class="me-0.5" />
                {{ card.change }}
              </span>
              <span class="text-gray-400 font-normal">{{ card.period }}</span>
            </div>
            <a
              href="javascript:void(0);"
              class="mt-1 block text-[11px] font-semibold text-primary hover:underline"
              @click="
                openModal(
                  card.title,
                  `Displaying comprehensive log and trajectory for ${card.title}. Current total stands at ${card.value}.`,
                )
              "
            >
              View More
            </a>
          </div>
        </div>
      </div>

      <!-- Middle Row: Conversions & Performance -->
      <div class="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <!-- Conversions Card (3 Cols) -->
        <div
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-3"
        >
          <div>
            <h6 class="mb-4 text-sm font-bold text-secondary dark:text-white">Conversions</h6>

            <!-- Donut Chart -->
            <div class="relative my-4 flex items-center justify-center">
              <svg width="130" height="130" viewBox="0 0 120 120">
                <!-- Background track circle -->
                <circle cx="60" cy="60" r="48" fill="none" stroke="#E5E7EB" stroke-width="12" class="dark:stroke-gray-800" />
                <!-- Foreground green arc (65.2% of 301.59 circumference = 196.6) -->
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#22C55E"
                  stroke-width="12"
                  stroke-dasharray="196.6 301.6"
                  stroke-dashoffset="75.4"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <!-- Center Percentage Value -->
              <div class="pointer-events-none absolute text-center">
                <span class="text-xl font-bold text-secondary dark:text-white">65.2%</span>
                <div class="text-[10px] text-gray-400 font-medium leading-tight">Returning Customer</div>
              </div>
            </div>

            <!-- This Week vs Last Week -->
            <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
              <div>
                <div class="font-bold text-secondary dark:text-gray-200">This Week</div>
                <div class="font-semibold text-success">23.5k</div>
              </div>
              <div class="text-end">
                <div class="font-bold text-secondary dark:text-gray-200">Last Week</div>
                <div class="font-semibold text-gray-500 dark:text-gray-400">41.05k</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="mt-4 w-full rounded-lg border border-primary bg-white py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:bg-gray-800"
            @click="
              openModal(
                'Conversions Breakdown',
                'Customer retention rate is currently 65.2% with 23,500 returning conversions this week versus 41,050 last week.',
              )
            "
          >
            View Details
          </button>
        </div>

        <!-- Performance Card (9 Cols) -->
        <div
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-9"
        >
          <div>
            <!-- Performance Header -->
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h6 class="text-sm font-bold text-secondary dark:text-white">Performance</h6>
              <div
                class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/80 p-1 dark:border-gray-800 dark:bg-gray-800"
              >
                <button
                  v-for="tf in timeframes"
                  :key="tf"
                  type="button"
                  :class="[
                    'rounded px-2.5 py-1 text-xs font-semibold transition',
                    selectedTimeframe === tf
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300',
                  ]"
                  @click="selectedTimeframe = tf"
                >
                  {{ tf }}
                </button>
              </div>
            </div>

            <!-- Technical Issue Alert Notice -->
            <div
              class="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <FeatherIcon name="alert-triangle" size="14" class="text-amber-600 flex-shrink-0" />
              <span>We regret to inform you that our server is currently experiencing technical issues.</span>
            </div>

            <!-- Performance Dual Chart (Bar & Line) -->
            <div class="relative w-full overflow-hidden" style="min-height: 200px">
              <svg
                viewBox="0 0 720 190"
                class="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                @mouseleave="hoveredPerfIndex = null"
              >
                <!-- Horizontal Grid Lines -->
                <g class="text-gray-200 dark:text-gray-800">
                  <line
                    v-for="i in 4"
                    :key="i"
                    :x1="svgPerfMetrics.padLeft"
                    :y1="svgPerfMetrics.padTop + ((i - 1) * svgPerfMetrics.innerH) / 3"
                    :x2="svgPerfMetrics.width - 20"
                    :y2="svgPerfMetrics.padTop + ((i - 1) * svgPerfMetrics.innerH) / 3"
                    stroke="currentColor"
                    stroke-width="1"
                    stroke-dasharray="3 3"
                  />
                </g>

                <!-- Page Views Bars (Teal #14B8A6) -->
                <g>
                  <rect
                    v-for="(p, i) in svgPerfMetrics.points"
                    :key="'bar-' + i"
                    :x="p.x - 12"
                    :y="p.barY"
                    width="24"
                    :height="p.barH"
                    rx="3"
                    fill="#14B8A6"
                    class="transition-all duration-200 hover:opacity-85 cursor-pointer"
                    @mouseenter="hoveredPerfIndex = i"
                  />
                </g>

                <!-- Clicks Line (Indigo #6366F1) -->
                <path
                  :d="svgPerfMetrics.lineD"
                  fill="none"
                  stroke="#6366F1"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- Line Dots & Hover Trigger -->
                <g v-for="(p, i) in svgPerfMetrics.points" :key="'dot-' + i">
                  <circle
                    :cx="p.x"
                    :cy="p.lineY"
                    :r="hoveredPerfIndex === i ? 5 : 3.5"
                    fill="#ffffff"
                    stroke="#6366F1"
                    stroke-width="2"
                    class="cursor-pointer transition-all duration-150"
                    @mouseenter="hoveredPerfIndex = i"
                  />
                </g>

                <!-- X-Axis Labels -->
                <g class="text-[11px] fill-gray-400 select-none">
                  <text
                    v-for="(p, i) in svgPerfMetrics.points"
                    :key="'txt-' + i"
                    :x="p.x"
                    :y="svgPerfMetrics.padTop + svgPerfMetrics.innerH + 16"
                    text-anchor="middle"
                    :class="{ 'font-bold fill-primary': hoveredPerfIndex === i }"
                  >
                    {{ p.month }}
                  </text>
                </g>
              </svg>

              <!-- Floating Tooltip -->
              <div
                v-if="hoveredPerfIndex !== null"
                class="pointer-events-none absolute -top-1 z-30 transform -translate-x-1/2 rounded-md bg-[#092C4C] px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg transition-all"
                :style="{
                  left: `${(svgPerfMetrics.points[hoveredPerfIndex].x / svgPerfMetrics.width) * 100}%`,
                }"
              >
                <div>{{ svgPerfMetrics.points[hoveredPerfIndex].month }}</div>
                <div class="text-[#14B8A6]">Page Views: {{ svgPerfMetrics.points[hoveredPerfIndex].pv }}k</div>
                <div class="text-[#818CF8]">Clicks: {{ svgPerfMetrics.points[hoveredPerfIndex].clk }}k</div>
              </div>
            </div>
          </div>

          <!-- Chart Legend -->
          <div class="mt-3 flex items-center justify-center gap-5 text-xs text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1.5">
              <span class="h-3 w-3 rounded bg-[#14B8A6]"></span>
              Page Views
            </span>
            <span class="flex items-center gap-1.5">
              <span class="h-1 w-4 rounded bg-[#6366F1]"></span>
              Clicks
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Session By Browser, Sessions by Country, Top Pages -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <!-- Session By Browser (3 Cols) -->
        <div
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3"
        >
          <div>
            <h6 class="mb-4 text-sm font-bold text-secondary dark:text-white">Session By Browser</h6>
            <div class="space-y-2.5 text-xs">
              <div v-for="b in browserStats" :key="b.name" class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-700 dark:text-gray-200">{{ b.name }}</span>
                  <span class="font-bold text-secondary dark:text-white">
                    {{ b.percent }}%
                    <span class="text-gray-400 font-normal ms-1">{{ b.count }}</span>
                  </span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div class="h-full rounded-full" :class="b.color" :style="{ width: `${b.percent}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="mt-4 w-full rounded-lg border border-primary bg-white py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:bg-gray-800"
            @click="
              openModal(
                'Browser Traffic Breakdown',
                'Chrome continues to lead traffic with 62.5% (5,060 sessions), followed by Firefox at 12.3% and Safari at 9.86%.',
              )
            "
          >
            View All
          </button>
        </div>

        <!-- Sessions by Country / Regions (4 Cols) -->
        <div
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-4"
        >
          <div>
            <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h6 class="text-sm font-bold text-secondary dark:text-white">Sessions by Country</h6>
              <button
                type="button"
                class="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                @click="
                  openModal(
                    'Sessions by Region Data',
                    'Top visitor concentration across regional provinces: Jawa Barat (659k), Jakarta (485k), Banten (355k), and Jawa Tengah (204k).',
                  )
                "
              >
                View Data
              </button>
            </div>

            <div class="space-y-3.5 text-xs">
              <div
                v-for="c in sessionsByCountry"
                :key="c.name"
                class="flex flex-col gap-1 border-b border-gray-50 pb-2 dark:border-gray-800/60"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-secondary dark:text-gray-100">{{ c.name }}</span>
                  <span class="font-bold text-primary">{{ c.count }}</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div class="h-full rounded-full bg-primary" :style="{ width: `${c.percent}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Regional summary -->
          <div class="mt-4 rounded-lg bg-gray-50 p-3 text-[11px] text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">
            Top regional server distribution covering major metropolitan customer centers.
          </div>
        </div>

        <!-- Top Pages (5 Cols) -->
        <div
          class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-5 overflow-hidden"
        >
          <div>
            <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h6 class="text-sm font-bold text-secondary dark:text-white">Top Pages</h6>
              <button
                type="button"
                class="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                @click="
                  openModal(
                    'Top Pages Analysis',
                    'Audit of most visited landing pages with average user engagement duration and exit bounce percentage.',
                  )
                "
              >
                View All
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    class="border-b border-gray-100 bg-gray-50/60 text-[11px] font-bold uppercase text-gray-400 dark:border-gray-800 dark:bg-gray-800/40"
                  >
                    <th class="py-2.5 ps-3 pe-2">Page Path</th>
                    <th class="py-2.5 px-2 text-center">Page Views</th>
                    <th class="py-2.5 px-2 text-center">Avg Time</th>
                    <th class="py-2.5 pe-3 ps-2 text-end">Exit Rate</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 dark:divide-gray-800/60">
                  <tr
                    v-for="(page, idx) in topPages"
                    :key="idx"
                    class="cursor-pointer transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                    @click="
                      openModal(
                        page.path,
                        `Page: ${page.path}\nViews: ${page.views}\nAvg Time on Page: ${page.avgTime}\nExit Rate: ${page.exitRate}`,
                      )
                    "
                  >
                    <td class="py-2.5 ps-3 pe-2 font-mono text-[11px] text-blue-600 hover:underline">
                      {{ page.path }}
                    </td>
                    <td class="py-2.5 px-2 text-center font-bold text-secondary dark:text-white">
                      {{ page.views.toLocaleString() }}
                    </td>
                    <td class="py-2.5 px-2 text-center text-gray-500 dark:text-gray-400">
                      {{ page.avgTime }}
                    </td>
                    <td class="py-2.5 pe-3 ps-2 text-end">
                      <span
                        class="inline-block rounded px-2 py-0.5 text-[10px] font-semibold text-white"
                        :class="page.badgeColor"
                      >
                        {{ page.exitRate }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reusable BaseModal for Details -->
    <BaseModal v-model="isDetailModalOpen" :title="modalTitle" max-width="md">
      <div class="space-y-3 text-xs sm:text-sm whitespace-pre-line text-gray-600 dark:text-gray-300">
        {{ modalContent }}
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="isDetailModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>
