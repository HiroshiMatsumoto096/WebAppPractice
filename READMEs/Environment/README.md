# 環境構築

- プロジェクト構築
- vuetify@nuxtのインストール
- MariDB準備 ( docker )

## プロジェクト構築

`app`という名の`nuxt`プロジェクトを作成

``` bash
npx nuxi init app
```

## vuetify@nuxt

``` bash
yarn add vuetify@latest
```
``` bash
yarn add scss@latest
```
``` bash
yarn add sass@latest
```

`assets/main.scss`
``` scss
@use "vuetify/styles";
```

`plugins/vuetify.ts`

``` typescript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
```

`nuxt.config.ts`
``` typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  css: ['@/assets/main.scss'],
})
```

## MariaDB

`prisma` で使えるRDB`MySQL`と互換性があるので`MariaDB`を採用

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql

`docker`上に構築する。

### MariaDB@docker-compose

`docker-compose.yml`を以下の内容で作成

``` yaml
version: '3'
services:
  mariadb:
    image: mariadb
    restart: always
    ports:
      - ${MARIADB_PORT}:3306
    environment:
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}
      MARIADB_DATABASE: ${MARIADB_DATABASE}
      MARIADB_USER: ${MARIADB_USER}
      MARIADB_PASSWORD: ${MARIADB_PASSWORD}
      TZ: 'Asia/Tokyo'
    volumes:
      - ./MariaDB/data:/var/lib/mysql
```

`MariaDB/data`のディレクトリ作成を作成する

初回セットアップ時は

``` bash
docker-compose up --build
```

オプション説明 
`--build`: dockerのイメージのbuild: 初回のみでよい

以後は

```
docker-compose up
```

### DB動作確認

```
docker-compose exec mariadb bash
```

コマンド説明  
- `exec`: `docker-compose`のサブコマンド
  - `up` : 起動: 「docker-compose.yml 内に書かれているサービス群を起動して！」
  - `down` : シャットダウン: 「docker-compose.yml 内に書かれているサービス群をシャットダウンして！」
  - サブコマンドによって以降に続く引数が変わる
- `mariadb`: `docker-compose.yml`内に記述されているサービス名 
- `bash`: `mariadb`コンテナ上で動かすコマンド
- docker-composeはファイル指定しないと、デフォルトで`docker-compose.yml`を読み込む 

`docker-compose exec mariadb bash`は意訳すると、  
`docker-compose.yml`の`mariadb`サービス上で、`bash`を実行(`exec`)して！

実行すると、以下のようなプロンプトが表示される.  
(Linuxの世界に突入)

``` bash
root@11512asdf:/#
```

mariadbの`REPL`に入る  
(REPL: read evaluate print loop)

``` bash
root@11512asdf:/# mariadb -u user -D database -ppass
```

コマンドオプション説明  
- `-u`: ユーザ@`mariadb`の指定
- `-D`: データベースの指定
- `-ppass`: ユーザ@`mariadb`のパスワード; `-p`に空白なしで続けて入力することでパスワード入力を回避
  - `-p`だけにしたら、別途パスワード入力が求められる
  - 本番環境などではこのパスワードを続けて記述する方法はお勧めできない

(MariaDBの世界に突入)
``` bash
Server version: 11.0.3-MariaDB-1:11.0.3+maria~ubu2204 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [database]>
```

## DBに権限付与  

`root`ユーザで`mariadb`にログインする。

``` bash
docker-compose exec mariadb bash
mariadb -u root -D database -prootpass
```

`-u`の値を`user`にし、パスワードは`pass`と異なっていることに注意！

以下のコマンドでユーザ`user`に対して、データベース`database`の`CREATE, ALTER, DROP, REFERENCES`の権限を付与する。  

``` sql
grant SELECT, CREATE, ALTER, DROP, UPDATE, REFERENCES ON *.* to user;
```

この`MariaDB`の`REPL`で直接、新しいDBの作成、ユーザ作成、テーブル作成、テーブルのデータ操作などが可能。
https://shelokuma.com/2023/02/17/command-list-for-mariadb/

## Nuxt Server

https://nuxt.com/docs/guide/directory-structure/server

以下のディレクトリを作成

- server/api

## API動作確認

`server/api/hello.ts` に以下を記述

``` Typescript
export default defineEventHandler((event) => {
  return {
    hello: 'world'
  }
})
```

`curl`で動作確認
``` bash
curl localhost:3000/api/hello
```

以下の出力が得られれば成功

``` bash
{
  "hello": "world"
}
```

余談:  
`curl`コマンドはこのようにAPI確認に使えるコマンドです。  
実装中、問題解決の際にフロントとバックエンドのどっちの問題かの切り分けに使えます！

(HTTPリクエスト・メソッド(GET,POST, DELETE, PUT)によってオプションが変わります。)  
メソッドについては後程説明します。

GUIで確認したい方は`Postman`というツールがあります。  
https://www.postman.com/  
https://www.postman.com/downloads/  

## Prisma
`prisma` のインストール

https://www.prisma.io/docs/getting-started/quickstart  
```
yarn add prisma typescript ts-node @types/node
yarn add @prisma/client
```

MariaDBとの連携設定

`prisma`は`MariaDB`対応していない。  
ただ、`MariaDB`は`MySQL`はほぼほぼ同じDBであり互換が効くので`MySQL`を`DataSource-Provider`として利用する.

`MySQL`として初期化

```
yarn prisma init --datasource-provider mysql
```

https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datasource

インストール後のメッセージ

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the `DATABASE_URL` in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run `prisma db pull` to turn your database schema into a Prisma schema.
3. Run `prisma generate` to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```
 
要約
1. `.env`に使用するDBを指す`DATABASE_URL`変数の設定を設けよ.  

`.env`ファイル

```
```

```bash
MYSQL_ROOT_PASSWORD="rootpass"
MYSQL_DATABASE="database"
MYSQL_USER="user"
MYSQL_PASSWORD="pass"
MYSQL_HOST="localhost"
MYSQL_PORT="3308" # mysqlのデフォルトPortは3306だが、ホスト側に別のMySQLがインストールされている場合、競合するため3308
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}"
```

2. `prisma db pull` をつかって使用中の`DB`設定(`schema`)を`prisma`に取り込む.

使用中のDBはないためスキップ

3. `prisma generate`で`prisma client`を生成する

``` bash
npx prisma generate
```

`app`フォルダ内で`npx`を動作させる際、npxにプロジェクトフォルダ内の`.env`を読み込ませる

``` bash
npx nuxi dev --dotenv ../.env
```

## migration

`prisma`を使ってデータベースのテーブル構築

## マイグレーションファイル作成

`prisma/schema.prisma`

```typescript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    email       String      @unique
    name        String?
}
```

## マイグレーション事前準備
マイグレーション時に`.env`ファイルより`DB`パラメータを読み込ませる必要がある。

`dotenv-cli`パッケージを利用することで解決できる。

```
npm install dotenv-cli
```

## マイグレーション処理実行

マイグレーション：定義ファイルを用いてDBテーブル構築を行う

```bash
dotenv -e /home/h-matsumoto/Desktop/MICHIRU/BankApp/.env -- yarn prisma migrate dev
```

以下の箇所が指定`.env`ファイルを読み込ませるコマンドになる。
```bash
dotenv -e /home/h-matsumoto/Desktop/MICHIRU/BankApp/.env -- 
```
`.env`までのフルパスで入力してください。
