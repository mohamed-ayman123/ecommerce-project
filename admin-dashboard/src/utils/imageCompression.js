/**
 * Client-side image compression to prevent Vercel 4.5MB payload edge rejections.
 *
 * @param {File} file - Original image file
 * @param {number} [maxSizeKB=500] - Threshold above which compression is triggered
 * @returns {Promise<File>} Compressed File or original if small / not compressible
 */
export async function compressImageFile(file, maxSizeKB = 500) {
  if (!file || !file.type.startsWith('image/')) return file
  if (file.size <= maxSizeKB * 1024) return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = 1600
        const maxHeight = 1600
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file)
            } else {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '.jpg'),
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              )
              resolve(compressedFile)
            }
          },
          'image/jpeg',
          0.85
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}
