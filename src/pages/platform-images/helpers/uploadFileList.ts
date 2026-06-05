import type { RcFile, UploadFile } from 'antd/es/upload'

export function mapFilesToUploadFileList(files: File[]): UploadFile[] {
  return files.map((file, index) => ({
    uid: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    name: file.name,
    status: 'done' as const,
    originFileObj: file as RcFile,
  }))
}

export function filesFromUploadFileList(fileList: UploadFile[]): File[] {
  return fileList
    .map(item => item.originFileObj)
    .filter((file): file is RcFile => file instanceof File)
}
