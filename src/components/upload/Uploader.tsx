'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '@/actions/Cloudniary'
import { UploadCloud, X, CheckCircle } from 'lucide-react'
import type { FileRejection, DropEvent } from 'react-dropzone'

type FileStatus = 'idle' | 'uploading' | 'success' | 'error'

type UploadedFile = {
  id: string
  name: string
  size: number
  url: string
  type: string
}

type FileWithProgress = {
  file: File
  id: string
  progress: number
  status: FileStatus
  url?: string
  error?: string
}

type CloudinaryUploaderProps = {
  maxFiles?: number
  maxSize?: number
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  className?: string
  buttonText?: string
  multiple?: boolean
  autoUpload?: boolean
}

export function CloudinaryUploader({
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  onUploadComplete,
  onUploadError,
  className = '',
  multiple = true,
  autoUpload = true,
}: CloudinaryUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
      const newAcceptedFiles = acceptedFiles.map((file) => ({
        file,
        id: crypto.randomUUID(),
        progress: 0,
        status: 'idle' as FileStatus,
      }))

      const newRejectedFiles = fileRejections.map((fr) => ({
        file: fr.file,
        id: crypto.randomUUID(),
        progress: 0,
        status: 'error' as FileStatus,
        error: fr.errors.map((e) => e.message).join(', '),
      }))

      setFiles((prev) => {
        const updated = [...prev, ...newAcceptedFiles, ...newRejectedFiles]
        return updated.slice(0, maxFiles)
      })

      if (autoUpload && newAcceptedFiles.length) {
        handleUpload(newAcceptedFiles)
      }
    },
    [autoUpload, maxFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize,
    multiple,
  })

  const handleUpload = async (
    filesToUpload = files.filter((f) => f.status === 'idle')
  ) => {
    for (const fileData of filesToUpload) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id ? { ...f, status: 'uploading' } : f
        )
      )
      try {
        const form = new FormData()
        form.append('file', fileData.file)

        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (
                f.id === fileData.id &&
                f.status === 'uploading' &&
                f.progress < 90
              ) {
                return { ...f, progress: f.progress + 10 }
              }
              return f
            })
          )
        }, 500)

        const result = await uploadFile(form)
        clearInterval(interval)

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id
              ? { ...f, status: 'success', progress: 100, url: result.url }
              : f
          )
        )

        setUploadedFiles((prev) => [
          ...prev,
          {
            id: fileData.id,
            name: fileData.file.name,
            size: fileData.file.size,
            url: result.url,
            type: fileData.file.type,
          },
        ])
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        )
        onUploadError?.(`Failed to upload ${fileData.file.name}`)
      }
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearFiles = () => {
    setFiles([])
    setUploadedFiles([])
  }

  useEffect(() => {
    if (uploadedFiles.length && onUploadComplete) {
      onUploadComplete(uploadedFiles)
    }
  }, [uploadedFiles, onUploadComplete])

  return (
    <div className={`space-y-3 py-0 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-dashed border-gray-300'
          } rounded-lg p-4 text-center cursor-pointer relative`}
      >
        <input {...getInputProps()} />

        {/* Render previews inside drop area */}
        {files.length > 0 ? (
          <div className=" flex flex-wrap gap-2 p-0 overflow-auto">
            {files.map((f) => (
              <div key={f.id} className="h-20 w-full rounded-md overflow-hidden bg-gray-100 relative">
                <img
                  src={f.url || URL.createObjectURL(f.file)}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id) }}
                  className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <UploadCloud className="h-6 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive ? 'Drop files here...' : 'Drag & drop or click to select'}
            </p>
          </>
        )}
      </div>


    </div>
  )
}
