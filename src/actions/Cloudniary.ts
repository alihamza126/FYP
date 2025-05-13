"use server"

import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Instead of accepting a callback, we'll just upload the file
export async function uploadFile(formData: FormData): Promise<{ url: string }> {
  try {
    const file = formData.get("file") as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a promise that will resolve with the upload result
    return new Promise((resolve, reject) => {
      // Create a Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "next-uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Upload error:", error)
            reject(new Error("Upload failed"))
            return
          }

          if (result) {
            resolve({ url: result.secure_url })
          }
        },
      )

      // Upload the file
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Upload failed")
  }
}
