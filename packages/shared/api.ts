/**
 * Reusable axios client - interceptors, error handling, request helpers
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

export type ApiResponse<T = unknown> = AxiosResponse<T>

export interface ApiClientOptions extends AxiosRequestConfig {
  getAuthToken?: () => string | null
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  onResponse?: (response: AxiosResponse) => AxiosResponse
  onError?: (error: unknown) => unknown
}

/**
 * Create reusable axios instance with interceptors
 */
export function createApiClient(
  baseURL: string,
  options: ApiClientOptions = {}
): AxiosInstance {
  const {
    getAuthToken,
    onRequest,
    onResponse,
    onError,
    ...axiosConfig
  } = options

  const client = axios.create({
    baseURL: baseURL.replace(/\/$/, ''),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...axiosConfig.headers,
    },
    ...axiosConfig,
  })

  // Request interceptor (auth token injection)
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken?.()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return onRequest ? onRequest(config) : config
    },
    (err) => Promise.reject(err)
  )

  // Response interceptor (error handling)
  client.interceptors.response.use(
    (response) => (onResponse ? onResponse(response) : response),
    (error) => (onError ? Promise.reject(onError(error)) : Promise.reject(error))
  )

  return client
}

/**
 * Request helpers for common HTTP methods
 */
export function createApiRequests(client: AxiosInstance) {
  return {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
      client.get<T>(url, config).then((r) => r.data),
    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      client.post<T>(url, data, config).then((r) => r.data),
    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      client.put<T>(url, data, config).then((r) => r.data),
    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      client.patch<T>(url, data, config).then((r) => r.data),
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
      client.delete<T>(url, config).then((r) => r.data),
  }
}

export type { AxiosInstance, AxiosRequestConfig, AxiosResponse }
