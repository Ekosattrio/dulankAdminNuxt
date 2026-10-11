export interface AnalyticsKpi { title: string; value: string; change: string; direction: 'up' | 'down'; icon: string }
export interface AnalyticsSeries { pageViews: number[]; clicks: number[] }
export interface AnalyticsBrowser { name: string; percent: number; count: string }
export interface AnalyticsRegion { name: string; count: string; percent: number }
export interface AnalyticsTopPage { path: string; views: number; avgTime: string; exitRate: string }
export interface AnalyticsDashboard {
  kpis: AnalyticsKpi[]
  conversion: { rate: number; thisWeek: string; lastWeek: string }
  performance: Record<string, AnalyticsSeries>
  browsers: AnalyticsBrowser[]
  regions: AnalyticsRegion[]
  topPages: AnalyticsTopPage[]
}
