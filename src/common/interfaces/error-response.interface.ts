export interface ErrorResponse {
  success: boolean;
  message: string;
  timestamp: string;
  errors?: any[];
  stack?: string;
}
