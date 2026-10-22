export interface HealthStatus {
  success: boolean;
  message: string;
}

export const healthService = {
  async checkHealth(): Promise<HealthStatus> {
    const res = await fetch('/health');
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return res.json();
  },
};
