type ErrorType = 'api' | 'network' | 'validation' | 'auth' | 'unknown'
interface AppError {
  timestamp: string
  source: string
  type: ErrorType
  message: string
  code?: string
  details?: any
}
export const useErrorHandler = () => {
  const getErrorType = (error: any): ErrorType => {
    if (error?.status === 'FETCH_ERROR') return 'network'
    if (error?.status && typeof error.status === 'number') return 'api'
    return 'unknown'
  }

  const getErrorCode = (error: any): string | undefined => {
    if (error?.status) return String(error.status)
    if (error?.code) return String(error.code)
    return undefined
  }

  const logError = (error: any, where: string): AppError => {
    const appError: AppError = {
      timestamp: new Date().toISOString(),
      source: where,
      type: getErrorType(error),
      message: error?.message || String(error),
      code: getErrorCode(error),
      details: error,
    }
    console.error('=== ОШИБКА ===', appError)
    console.error('Время:', appError.timestamp)
    console.error('Источник:', appError.source)
    console.log('Тип:', appError.type)
    console.error('Сообщение:', appError.message)
    if (appError.code) console.log('Код ошибки:', appError.code)
    console.error('Детали:', appError.details)
    return appError
  }

  const catchErrors = async <T>(fn: () => Promise<T>, where: string): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      logError(error, where)
      throw error
    }
  }
  return {
    logError,
    catchErrors,
  }
}
