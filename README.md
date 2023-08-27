# WebApp

## 準備

### MariaDB

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql

`MSQL/data`のディレクトリ作成を作成する

`.env.mysql`を`.env`としてコピー

`docker-compose up --file docker-compose.mysql.yml --build -d` 



### PostgreSQL

`Postgresql/data`のディレクトリ作成を作成する

PostgreSQL環境構築は以下のリンクを完コピ

https://qiita.com/takumiw/items/281c86d74b7049dcf846

`docker-compose up --build -d` 後、 ユーザ、DBの作成を行う

ユーザ作成

`createuser -U postgres piro`

createuser のオプション  
- h: サーバーのホスト名やIPを指定
- p: ポート番号を指定
- U: createuserを実行するユーザー
- d: データベースの作成権限、D:データベースの作成できない権限
- l: ログイン権限、L:ログイン不可権限
- r: ユーザー作成の権限、R:ユーザー作成ができない権限
- s: スーパーユーザー権限の付与、S:スーパーユーザーでない権限の付与
- P: パスワード設定する（厳密には実行時に、パスワード設定メッセージが表示される）

DB作成

`createdb -U postgres -O piro -E UTF8 --locale=ja_JP.UTF-8 -T template0 piro_db`

https://www.postgresql.jp/document/9.1/html/app-createdb.html

createdbオプション
- -U 接続に使用するユーザ名を指定します。
- -O 所有者
- -E エンコーディング: ユニコードがいいかと(utf8)
- -locale
  - https://www.postgresql.jp/document/13/html/multibyte.html
  - 選択肢、`locale -a`@ターミナル閲覧可能
  - まぁ、`ja_JP.UTF-8`がよろしいかと
- -T 使用するテンプレート
  - 使えるテンプレートは`\l`@REPLで確認可能
	- REPL起動 `psql -U piro piro_db`
  - https://www.postgresql.jp/document/9.4/html/manage-ag-templatedbs.html
  - template0 と template1 の大差はない


## Nuxt Server

https://nuxt.com/docs/guide/directory-structure/server

以下のディレクトリを作成

- server/api
- server/routes
- server/middleware

### API動作確認

`server/api/hello.ts` に、以下を記述

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
}                                                                                                                                                           ```

### Prisma

`prisma` のインストール

https://www.prisma.io/docs/getting-started/quickstart

`npm install prisma --save-dev`  
`npx prisma init --datasource-provider postgresql`  
https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datasource

インストール後のメッセージ

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

## CRUD
