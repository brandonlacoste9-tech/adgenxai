export interface SoraGenerationRequest {
  prompt: string;
  duration?: number;
  resolution?: string;
}

export const soraClient = {
  generate: async (request: SoraGenerationRequest) => {
    return { jobId: `sora_${Date.now()}`, status: "queued" };
  },
  status: async (jobId: string) => {
    return { jobId, status: "completed", url: "" };
  },
};
