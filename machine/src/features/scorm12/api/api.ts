export interface iAPI {
  LMSInitialize: (s: string) => boolean
  LMSFinish: (s: string) => boolean
  LMSSetValue: (cmi: string, s: string) => string// возвращ "true" or "false" статус
  LMSGetValue: (cmi: string) => string
  // Подтверждаем сохранение, чтобы гарантировать, что изменения, сделанные в данных, действительно сохраняются в LMS (а не в памяти)
  LMSCommit: (s: string) => boolean
  LMSGetLastError: () => any
  LMSGetErrorString: (errorCode: any) => string
  LMSGetDiagnostic: (errorCode: any) => string
}

declare global {
  export interface Window {
    API: iAPI
  }
}
