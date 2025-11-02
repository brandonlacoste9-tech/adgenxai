export interface SoraGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  model?: string;
  quality?: string;
}

export interface SoraGenerationResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
  createdAt?: string;
}

export class SoraClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || process.env.SORA_API_URL || "https://api.openai.com/v1/sora";
  }

  async generateVideo(request: SoraGenerationRequest): Promise<SoraGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Sora API error: ${response.status}`);
    }

    return response.json();
  }

  async getStatus(id: string): Promise<SoraGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/status/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Sora API error: ${response.status}`);
    }

    return response.json();
  }
}

export const soraClient = new SoraClient(
  process.env.SORA_API_KEY || ""
);
