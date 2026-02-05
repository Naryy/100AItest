# 画像の差し替え手順（AI実行用）

このドキュメントは、ギャラリーページの画像を差し替える完全自動化手順を説明します。

## 前提条件

- Node.jsとnpmがインストールされていること
- プロジェクトの依存関係がインストール済みであること（`npm install`実行済み）
- `images/` ディレクトリに新しい画像が配置されていること

## 自動実行手順（AI用）

以下の手順を順番に実行してください：

### 1. 画像をpublicディレクトリにコピー

```bash
cp -r images/ public/
```

### 2. 画像の寸法を取得してgallery.astroを生成

以下のコマンドで画像の寸法を取得：

```bash
node -e "
import('sharp').then(sharp => {
  const fs = require('fs');
  const path = require('path');
  const imagesDir = './public/images';
  const files = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|JPG)$/i.test(f)).sort();
  
  Promise.all(files.map(file => 
    sharp.default(path.join(imagesDir, file)).metadata().then(meta => ({
      file, 
      width: meta.width, 
      height: meta.height
    }))
  )).then(results => {
    results.forEach(r => console.log(\`\${r.file} \${r.width} \${r.height}\`));
  });
});
"
```

### 3. gallery.astroを更新

上記の出力を使用して、`src/pages/gallery.astro` の `photos` 配列部分を以下の形式で置き換えます：

**置き換え対象：**
- ファイル: `src/pages/gallery.astro`
- 開始: `// 実際の画像データ` または `// サンプル画像データ` で始まる行
- 終了: `];` で終わる const photos の定義

**置き換え内容の形式：**
```javascript
// 実際の画像データ
const photos = [
  { src: '/images/ファイル名', width: 幅, height: 高さ, alt: 'ファイル名（拡張子なし）' },
  // ... 各画像ごとに1行
];
```

**重要：** 各画像の width と height は手順2で取得した実際の値を使用すること。これにより縦横比が正確に保持されます。

### 4. 動作確認（オプション）

```bash
npm run dev
```

ブラウザで `http://localhost:4321/gallery` にアクセスして確認。

## AI実行の具体例

AIエージェントが実行する場合の手順：

1. **画像コピー**
   ```bash
   cp -r images/ public/
   ```

2. **寸法取得**
   ```bash
   node -e "..." # 上記のコマンド実行
   ```
   出力例：
   ```
   DSC_0012.jpg 2048 1365
   DSC_0356.jpg 1365 2048
   ...
   ```

3. **gallery.astro更新**
   
   `edit` ツールを使用して `src/pages/gallery.astro` を更新：
   
   - **old_str**: 既存の `// 実際の画像データ` または `// サンプル画像データ` から始まり `];` で終わるphotos配列全体
   - **new_str**: 手順2の出力をもとに生成した新しいphotos配列
   
   例：
   ```javascript
   // 実際の画像データ
   const photos = [
     { src: '/images/DSC_0012.jpg', width: 2048, height: 1365, alt: 'DSC_0012' },
     { src: '/images/DSC_0356.jpg', width: 1365, height: 2048, alt: 'DSC_0356' },
   ];
   ```

## 手動実行手順（人間用）

手動で実行する場合：

1. 画像を `images/` ディレクトリに配置
2. `cp -r images/ public/` を実行
3. 寸法取得コマンドを実行し、出力をコピー
4. `src/pages/gallery.astro` を開き、photos配列を手動で更新
5. `npm run dev` で動作確認

## 注意事項

- 各画像の実際の寸法（width/height）を正確に設定することで、PhotoSwipeが正しい縦横比で画像を表示します
- 縦向き・横向きの画像が混在していても、正しく表示されます
- サムネイル表示では `object-fit: cover` により、グリッド内で適切にトリミングされます
- 拡大表示では元の縦横比が維持されます
- サポートされる画像形式: .jpg, .jpeg, .JPG

## トラブルシューティング

### 画像が表示されない
- `public/images/` に画像がコピーされているか確認
- ブラウザの開発者ツールでネットワークエラーを確認

### 拡大時に画像が引き延ばされる
- `src/pages/gallery.astro` の各画像の width/height が実際の寸法と一致しているか確認
- 寸法取得コマンドを再実行して正確な値を取得

### 画像の向きが間違っている
- 元の画像ファイル自体の向きを確認
- 必要に応じて画像編集ツールで回転してから配置
