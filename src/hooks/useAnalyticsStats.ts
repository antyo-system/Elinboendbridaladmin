import { useQuery } from '@tanstack/react-query'

export interface AnalyticsStats {
  uniqueVisitors: number
  totalPageViews: number
  uniqueWALeads: number
  totalWAClicks: number
  conversionRate: string
  topProducts: Array<{ name: string; clicks: number }>
}

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['bridal-analytics-stats'],
    queryFn: async (): Promise<AnalyticsStats> => {
      return {
        uniqueVisitors: 184,
        totalPageViews: 612,
        uniqueWALeads: 27,
        totalWAClicks: 39,
        conversionRate: '14.7',
        topProducts: [
          { name: 'The Aurelia French Lace Ballgown', clicks: 12 },
          { name: 'Celeste Starlight A-Line Gown', clicks: 9 },
          { name: 'Adelaide Modern Heritage Kebaya Pengantin', clicks: 8 },
          { name: 'Seraphina Crystalline Mermaid Gown', clicks: 6 },
        ],
      }
    },
  })
}

