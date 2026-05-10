# Qiita Articles

Qiita CLI で記事を管理するリポジトリです。

## ディレクトリ構成

```text
.
├── public/      # 公開対象の記事 Markdown
├── template/    # 記事テンプレート
├── package.json
└── qiita.config.json
```

`public/.remote/` は Qiita CLI が使う同期用キャッシュです。Git 管理対象外です。

## コマンド

コマンドは必ずこのリポジトリ直下で実行します。

```bash
npm run preview
npm run pull
npm run push
```

`public/` ディレクトリ内で `qiita pull` などを直接実行すると、`public/public/` が作成されることがあります。
