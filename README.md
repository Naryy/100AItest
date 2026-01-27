# 100AItest

短い説明:
このリポジトリは Astro (npm create astro@latest) を使って作成する静的サイト / ハイブリッドサイトのテンプレートです。AI実験やプロトタイプ用に軽量で素早く立ち上げられる構成を想定しています。

[バッジ例 — 必要に応じて差し替えてください]
- Node: <img src="https://img.shields.io/badge/node-18%2B-brightgreen">
- Build: <img src="https://img.shields.io/badge/build-pending-lightgrey">
- License: <img src="https://img.shields.io/badge/license-MIT-blue">

目次
- 概要
- 前提条件
- 初期セットアップ（新規プロジェクト作成）
- 既存リポジトリでのセットアップ
- 開発
- ビルド / プレビュー
- デプロイ
- 推奨統合（Tailwind / React / TypeScript 等）
- プロジェクト構成（例）
- よく使うコマンド
- トラブルシューティング
- 貢献
- ライセンス

概要
このテンプレートは astro@latest を用いた開発を容易にするための README です。用途に応じて React/Vue/Svelte コンポーネント、Tailwind CSS、MDX 等を追加してください。

前提条件
- Node.js 18 以上を推奨（プロジェクトに合わせて調整）
- npm / pnpm / yarn のいずれか
- 推奨エディタ: VSCode

初期セットアップ（新規プロジェクト作成）
1. テンプレートを作る（インタラクティブ）
   - npm:
     npm create astro@latest
   - pnpm:
     pnpm create astro@latest
   - yarn:
     yarn create astro@latest

2. 質問に沿ってテンプレートや統合を選択します（TypeScript, Framework 統合, CSS フレームワークなど）。

既存リポジトリでのセットアップ
1. リポジトリをクローン
   git clone https://github.com/Naryy/100AItest.git
2. 依存をインストール
   npm install
   # または
   pnpm install
   # または
   yarn

開発
- 開発サーバー起動:
  npm run dev
  # または
  pnpm dev
  # または
  yarn dev

- デフォルト: http://localhost:3000（ポートは設定に依存）

ビルド / プレビュー
- ビルド:
  npm run build
- ローカルプレビュー:
  npm run preview

ビルド成果物は通常 dist/ フォルダに出力されます（astro.config で変更可能）。

デプロイ
一般的なホスティング例：

- Vercel
  - リポジトリを Vercel に接続すれば自動で検出されます。
  - Build command: npm run build
  - Output directory: dist（通常は自動）

- Netlify
  - Build command: npm run build
  - Publish directory: dist

- Cloudflare Pages
  - Build command: npm run build
  - Build output directory: dist

- GitHub Pages（静的出力）
  - dist の内容を gh-pages ブランチにデプロイするアクションを使う例を下に示します。

GitHub Actions（GitHub Pages へデプロイ）例
.github/workflows/deploy.yml の例:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

推奨統合（導入例）
- Tailwind CSS
  1. npm install -D tailwindcss postcss autoprefixer
  2. npx tailwindcss init -p
  3. main CSS に @tailwind base; @tailwind components; @tailwind utilities;
  4. 必要に応じて astro.config で設定

- React（コンポーネントを使う場合）
  npm install react react-dom
  npm install @astrojs/react

- TypeScript
  - テンプレート作成時に TypeScript を選ぶか、手動で tsconfig.json と型定義を追加

- MDX
  npm install @astrojs/mdx

プロジェクト構成（例）
- src/
  - pages/       — ルーティング用ページ (.astro, .mdx, .tsx など)
  - components/  — 再利用コンポーネント
  - layouts/     — レイアウト
  - styles/      — グローバルスタイル
- public/        — 静的アセット
- astro.config.* — Astro 設定
- package.json
- tsconfig.json（TypeScript 使用時）

環境変数
- .env をプロジェクトルートに作成して管理
- .gitignore に .env を追加してコミットしないようにする

よく使うコマンド（package.json に記載）
- dev: 開発サーバー起動
- build: 本番ビルド
- preview: ビルド成果物をローカルプレビュー
- format: コード整形（Prettier）
- lint: ESLint 実行

トラブルシューティング（よくある例）
- 依存の問題:
  rm -rf node_modules package-lock.json
  npm install
- ポートが既に使われている:
  dev コマンドに --port オプションを指定するかポートを変更

貢献
- Issue / PR を歓迎します。小さな変更でも PR を作成してください。
- PR の説明に何を変えたかと、再現手順（必要なら）があると助かります。

ライセンス
- 適切なライセンスを選んで LICENSE ファイルを追加してください（例: MIT）。

カスタマイズの提案
- Tailwind を入れるか
- TypeScript を使うか
- React/Svelte 等の UI フレームワークを使うか
- デプロイ先（Vercel / Netlify / Cloudflare / GitHub Pages）
