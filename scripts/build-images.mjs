import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const ORIGINAL_DIR = path.join(ROOT_DIR, 'assets', 'original');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'generated');

const SIZES = [480, 960, 1600, 2400];
const FORMATS = ['avif', 'webp', 'jpg'];

// ログカウンター
let processedCount = 0;
let skippedCount = 0;
let errorCount = 0;

/**
 * ディレクトリが存在するか確認し、なければ作成
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * ファイルが存在するか確認
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 画像を最適化して複数サイズ・フォーマットで出力
 */
async function processImage(inputPath, outputDir, filename) {
  try {
    // EXIF向き補正を適用
    let image = sharp(inputPath).rotate();
    const metadata = await image.metadata();

    console.log(`  Processing: ${filename}`);

    // サムネイル生成 (長辺600px)
    const thumbPath = path.join(outputDir, 'thumb.jpg');
    if (!(await fileExists(thumbPath))) {
      await image
        .clone()
        .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(thumbPath);
      console.log(`    ✓ thumb.jpg`);
      processedCount++;
    } else {
      skippedCount++;
    }

    // 各サイズ・フォーマットで生成
    for (const size of SIZES) {
      const sizeDir = path.join(outputDir, `w${size}`);
      await ensureDir(sizeDir);

      for (const format of FORMATS) {
        const ext = format === 'jpg' ? 'jpg' : format;
        const outputPath = path.join(sizeDir, `${path.parse(filename).name}.${ext}`);

        if (await fileExists(outputPath)) {
          skippedCount++;
          continue;
        }

        const resized = image
          .clone()
          .resize(size, null, { fit: 'inside', withoutEnlargement: true });

        if (format === 'avif') {
          await resized.avif({ quality: 75 }).toFile(outputPath);
        } else if (format === 'webp') {
          await resized.webp({ quality: 85 }).toFile(outputPath);
        } else {
          await resized.jpeg({ quality: 85, progressive: true }).toFile(outputPath);
        }

        console.log(`    ✓ w${size}/${path.basename(outputPath)}`);
        processedCount++;
      }
    }

    return true;
  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
    errorCount++;
    return false;
  }
}

/**
 * 作品フォルダ内の全画像を処理
 */
async function processWorkFolder(slug) {
  const inputDir = path.join(ORIGINAL_DIR, slug);
  const outputDir = path.join(OUTPUT_DIR, slug);

  console.log(`\n📂 Processing: ${slug}`);

  try {
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpe?g|png)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log(`  ⚠ No images found in ${slug}`);
      return;
    }

    await ensureDir(outputDir);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      await processImage(inputPath, outputDir, file);
    }

  } catch (error) {
    console.error(`  ✗ Error processing folder ${slug}:`, error.message);
    errorCount++;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🖼️  Image Optimization Pipeline\n');
  console.log(`Input:  ${ORIGINAL_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  try {
    // original ディレクトリの存在確認
    await fs.access(ORIGINAL_DIR);
  } catch {
    console.error(`❌ Error: ${ORIGINAL_DIR} does not exist`);
    process.exit(1);
  }

  // 出力ディレクトリを作成
  await ensureDir(OUTPUT_DIR);

  // 作品フォルダを取得
  const entries = await fs.readdir(ORIGINAL_DIR, { withFileTypes: true });
  const workFolders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (workFolders.length === 0) {
    console.log('⚠️  No work folders found in assets/original/');
    console.log('   Please create folders for each work and add images.');
    process.exit(0);
  }

  console.log(`Found ${workFolders.length} work folder(s): ${workFolders.join(', ')}\n`);

  // 各作品フォルダを処理
  for (const slug of workFolders) {
    await processWorkFolder(slug);
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`  ✓ Processed: ${processedCount} files`);
  console.log(`  ⊘ Skipped:   ${skippedCount} files (already exists)`);
  console.log(`  ✗ Errors:    ${errorCount} files`);
  console.log('='.repeat(50));

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
