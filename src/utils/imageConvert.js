import { readdir, unlink, lstat } from 'fs/promises'
import { join, parse, extname } from 'path'
import webp from 'webp-converter'

const inputFolder = join('public', 'img')

const convertToWebP = async () => {
  try {
    const files = await readdir(inputFolder)

    for (const file of files) {
      const inputFilePath = join(inputFolder, file)
      const outputFilePath = join(inputFolder, `${parse(file).name}.webp`)

      // Check if the current path is a file
      const stats = await lstat(inputFilePath)
      if (stats.isFile()) {
        const fileExtension = extname(file).toLowerCase()
        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(fileExtension)) {
          try {
            await webp.cwebp(inputFilePath, outputFilePath, '-q 50')
            console.log(`${file} webp로 변환 완료`)

            // Delete the original file
            await unlink(inputFilePath)
            console.log(`${file} 삭제 성공`)
          } catch (error) {
            console.error(`변환 실패 ${file}:`, error)
          }
        }
      }
    }
    console.log('변환 작업 완료')
  } catch (err) {
    console.error('경로가 잘못됨', err)
    process.exit(1)
  }
}

convertToWebP()
