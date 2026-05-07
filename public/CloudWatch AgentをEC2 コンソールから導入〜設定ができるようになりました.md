---
title: CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました
tags:
  - AWS
  - CloudWatch
private: false
updated_at: '2026-05-07T15:55:16+09:00'
id: a758aa3737c9fcddb8c2
organization_url_name: null
slide: false
ignorePublish: false
---

## はじめに

この記事はEC2 コンソールから CloudWatch Agent の導入〜設定が可能となりましたのでその方法について試してみた結果を共有します。

## 読んで得られること

EC2 コンソールからの CloudWatch Agent 設定手順

## 試したいと思った理由

従来はOSへのセットアップやAWS Systems Managerを使った設定が中心でしたが、今回の更新で
EC2 コンソールからでも CloudWatch Agent の導入・設定まで進められるようになりました。
利用機会が多いだけに、画面操作で完結できる手順は運用の負荷を下げられるのではないかと考え、
その検証内容を記事にまとめました。

## 機能・アップデートの概要

| 項目 | 内容 |
|------|------|
| サービス | CloudWatch |
| 機能名 | CloudWatch Agent |
| リリース・アップデート時期 | 2026年4月29日 のアップデート |
| 公式ソース | [Amazon CloudWatch が EC2 コンソールにビジュアルエージェント設定を追加](https://aws.amazon.com/jp/about-aws/whats-new/2026/04/amazon-cloudwatch-agent-ec2/) |

## 試した環境

| 項目 | 値 |
|------|-----|
| リージョン | ap-northeast-1 |
| アカウント種別 | 個人検証アカウント |
| IAM 権限 | AdministratorAccessポリシーの付与されたIAMユーザー |
| 利用した UI・ツール | Management Console |

## 前提条件

- SSM フリートマネージャーに作業対象 EC2 が登録済みでステータスがオンラインであること
- EC2のインスタンスプロファイルに以下ポリシーが付与されていること
  - AmazonSSMManagedInstanceCore
  - CloudWatchAgentServerPolicy

## 手順（試したこと）

### 1. CloudWatch エージェント設定画面を開く

EC2 インスタンスの詳細画面で、`モニタリング` タブから `CloudWatch エージェントの設定` を押下します。

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/775c2754-18bd-45f2-b6b4-2d2e5c630a9f.png)

### 2. エージェントをインストールする

Amazon Linux 2023 では SSM エージェントはプリインストールされていますが、CloudWatch エージェントは未インストールです。そのため `Install agent` を押下してインストールします。

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/a71f2fb7-1be9-4380-b107-fc9632730351.png)

↓

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/37513011-0b27-410a-9dbf-af8b439947dc.png)

> 補足: 画面上部の `Enable workload detection` は有効化済みです。

設定に必要なポリシーをアタッチするか聞かれますが既にアタッチ済みのためチェックを外して先に進みます。
![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました4.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/669a06a7-6da9-4fe9-ae8d-703b09ed90d6.png)

完了すると以下のようにAgentのステータスが `Installed` となります。
![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました5.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/15bc4714-b797-4d3c-b067-a7f8c1288b79.png)

### 3. エージェントの監視設定を行う

エージェント自体の設定と監視内容に関する設定に分かれており従来の設定ファイルが読めない方でも
設定ができるようになっています。

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました6.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/68388ea6-1dc2-4f4e-bca6-a50791605975.png)

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました7.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/876906f1-4716-4f59-b184-15f2ea7f9d17.png)

JSONでの設定も可能で、デフォルトでは以下の設定になっていました。

```json
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "cwagent",
    "region": "ap-northeast-1",
    "usage_metadata": [
      {
        "ObservabilitySolution": "ec2_health"
      }
    ]
  },
  "metrics": {
    "namespace": "CWAgent",
    "append_dimensions": {
      "InstanceId": "${aws:InstanceId}",
      "InstanceType": "${aws:InstanceType}",
      "ImageId": "${aws:ImageId}",
      "AutoScalingGroupName": "${aws:AutoScalingGroupName}"
    },
    "aggregation_dimensions": [
      [
        "InstanceId"
      ]
    ],
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ]
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ]
      },
      "disk": {
        "measurement": [
          "disk_inodes_free",
          "disk_used_percent"
        ],
        "drop_device": true
      },
      "net": {
        "measurement": [
          "net_bytes_recv",
          "net_bytes_sent"
        ]
      },
      "diskio": {
        "measurement": [
          "diskio_io_time"
        ]
      },
      "swap": {
        "measurement": [
          "swap_used_percent"
        ]
      },
      "netstat": {
        "measurement": [
          "netstat_tcp_established",
          "netstat_tcp_time_wait"
        ]
      },
      "processes": {
        "measurement": [
          "processes_running",
          "processes_total"
        ]
      },
      "ethtool": {
        "metrics_include": [
          "bw_in_allowance_exceeded",
          "bw_out_allowance_exceeded",
          "conntrack_allowance_exceeded",
          "linklocal_allowance_exceeded",
          "pps_allowance_exceeded"
        ]
      },
      "ebs": {
        "measurement": [
          "ebs_read_ops",
          "ebs_write_ops",
          "volume_queue_length"
        ]
      }
    }
  }
}
```

設定ができたら `Next` を押下するとプレビュー画面になりますので、問題なければ `Finish` を押下すると設定が始まります。

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました8.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/b0f232e7-136f-4e28-94c7-02c44c53e0ce.png)

↓

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました9.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/20d90d8a-e4e1-47fb-9e16-75b6e6fc3383.png)


### 4. CloudWatch メトリクスから設定ができているか確認する

![CloudWatch AgentをEC2 コンソールから導入〜設定ができるようになりました10.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/4427051/7404fca5-7997-42a1-a643-bc8437815572.png)

## 結果・確認したこと

上記手順で設定後に再度`モニタリング` タブから `CloudWatch エージェントの設定` を押下すると設定ファイルの修正ができることを確認しました。

## 考察・ユースケース

単体のインスタンスに対する設定であれば本手順をおすすめしますが大量のインスタンスに対して設定するのであれば従来からある Systems Manager での設定が効率が良いかと思います。

## まとめ

単体のEC2に対する監視設定の変更はEC2 コンソールから実施することを推奨します。

## 参考文献

- [Amazon CloudWatch が EC2 コンソールにビジュアルエージェント設定を追加](https://aws.amazon.com/jp/about-aws/whats-new/2026/04/amazon-cloudwatch-agent-ec2/)
