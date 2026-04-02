/**
 * Agregados diarios escritos por la API `/api/analytics/session` (Admin SDK).
 */
export interface AnalyticsDailyDoc {
  /** yyyy-mm-dd */
  date: string;
  sessionCount: number;
  totalDurationMs: number;
  totalScrollPct: number;
  /** Conteo por clave de data-analytics-section */
  sectionCounts: Record<string, number>;
  /** Conteo por pathname (ej. /, /project/foo) */
  pathCounts: Record<string, number>;
  /** Vistas por slug de proyecto (solo páginas /project/[slug]) */
  projectSlugCounts: Record<string, number>;
  updatedAt?: string;
}
