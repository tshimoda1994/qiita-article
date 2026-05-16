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

`npm run` はリポジトリのルートを `--root` に固定するラッパー経由です。**いま開いているターミナルのカレントが `public/` でも**、記事は常に `（リポジトリ直下）/public/` に置かれます。

```bash
npm run preview
npm run pull
npm run push
```

手元で `npx qiita` / `qiita` を直接使う場合は、リポジトリ直下で実行するか、次のようにルートを明示してください。

```bash
npx qiita publish --root /path/to/このリポジトリ
```

`public/` の中だけをカレントにして CLI を実行すると（`--root` なし）、CLI はその場所を「記事ルート」とみなし `public/public/` ができます。
