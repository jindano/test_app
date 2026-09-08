const MAX_IMAGE_EDGE = 1600

export async function compressImage(file: File): Promise<Blob> {
  const objectUrl = URL.createObjectURL(file)
  const image = new Image()

  try {
    image.src = objectUrl
    await image.decode()
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.naturalWidth * scale)
    canvas.height = Math.round(image.naturalHeight * scale)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('사진을 처리할 수 없습니다.')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob) throw new Error('사진을 압축할 수 없습니다.')
    return blob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}