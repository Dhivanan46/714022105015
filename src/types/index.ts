export interface Click {
  timestamp: number;
  source: string;
  geo: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface Link {
  code: string;
  longUrl: string;
  createdAt: number;
  expiresAt: number;
  clicks: Click[];
}

export interface URLFormData {
  longUrl: string;
  validity: string;
  customCode: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateLinkResult {
  success: boolean;
  link?: Link;
  error?: string;
}
