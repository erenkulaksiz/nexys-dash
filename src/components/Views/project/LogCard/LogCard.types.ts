export interface LogCardProps {
  log: any;
  viewingBatch?: boolean;
  logSelected?: boolean;
  onAIInsightClick?: ({ logId }: { logId: string }) => void;
}
