---
title: AWS最新情報取得APIを作ってみた
tags:
  - Python
  - AWS
  - FastAPI
private: false
updated_at: "2026-05-10T15:18:38+09:00"
id: a663799966c91f2e619b
organization_url_name: null
slide: false
ignorePublish: false
---

> **注意**
>
> 2026/5/20
> 現在はAPIを廃止してPthonからGoに書き換えを行っております。
> もし本記事の内容をお試しになりたい方は、EC2 上に`fork`した上で`docker compose` で起動してください。

## はじめに

この記事はAWSのDocker on EC2上でWhats newsから最新情報を取得できるAPIを作成してみました。

## 読んで得られること

コンテナ上でAPIを実装してみたい方の参考になればと思います。

## 試したいと思った理由

普段の業務ではコンテナに触れる機会が少ないのでコンテナで何か作ってみたかったのと
フリーAPIを公開することによって不特定多数のユーザーに利用していただければ運用についても
学べるのではないかと思い今回作成に至りました。

## プロダクト概要

| 項目   | 内容                                                            |
| ------ | --------------------------------------------------------------- |
| 名前   | aws-whats-new-api                                               |
| 一言で | AWS最新情報をAPIで取得できる                                    |
| リンク | [リポジトリ](https://github.com/tshimoda1994/aws-whats-new-api) |

## できること

- AWS What's Newの最新記事一覧を取得できます。
- `limit` パラメータで取得件数を指定できます。
- RSSから取得した記事をPostgreSQLへ同期できます。
- Swagger UIからAPI仕様を確認し、その場でリクエストを試せます。

APIドキュメントはこちらです。

https://api.tshimoda.app/docs#/

## ダメなこと・非目標

- 商用でのご利用はお控えください。

## 試し方

```bash
curl https://api.tshimoda.app/healthz
curl "https://api.tshimoda.app/aws/whats-new/articles?limit=10"
```

API仕様はSwagger UIから確認できます。

https://api.tshimoda.app/docs#/

## モチベーション（なぜ作ったか）

AWSのアップデート情報は日々確認していますが、ブラウザで見るだけではなくAPIとして取得できるようにしておくと、後から別のアプリや通知処理にもつなげやすいと考えました。

また、FastAPIでAPIを作り、Docker ComposeでEC2上にデプロイし、HTTPS化やログ出力まで含めて一通り運用してみることも目的でした。

## 技術スタック

- Python
- FastAPI
- Uvicorn
- PostgreSQL
- SQLAlchemy
- Docker / Docker Compose
- Caddy
- AWS EC2
- CloudWatch Logs

## まとめ

- AWS What's NewのRSSを取得し、APIとして返す仕組みを作成しました。
- FastAPI、PostgreSQL、Caddy、Docker Composeを組み合わせることで、API実装からHTTPS公開までを一通り試すことができました。
- 今後は検索やフィルタリングなど、APIとして使いやすくする機能を追加していきたいです。
- 有識者の方おりましたらぜひアドバイスやフィードバック頂けると励みになります。

## 参考文献

- [AWS What's New](https://aws.amazon.com/jp/about-aws/whats-new/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Caddy Documentation](https://caddyserver.com/docs/)
