import { supabase } from './supabase'

export async function uploadImage(
  file: File,
  folder: 'logos' | 'reviews'
): Promise<string | null> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('ai-tools-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ai-tools-images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/ai-tools-images/')
    if (urlParts.length < 2) return false

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('ai-tools-images')
      .remove([filePath])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Max dimensions
        let width = img.width
        let height = img.height
        const maxSize = 1200

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Compression failed'))
            }
          },
          'image/jpeg',
          0.85
        )
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}
