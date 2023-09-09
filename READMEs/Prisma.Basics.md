# 目次

1. `prisma`の設定
    - [インストール](###-インストール)
    - [設定](###-設定)
2. [`SQL`の`select`に相当する動き](##-select)
3. [`SQL`の`insert`に相当する動き](##-insert)
4. [`SQL`の`update`に相当する動き]()
5. [`SQL`の`delete`に相当する動き]()
6. [table join](##-tablejoin)
6. [`transaction`について]()
7. [`row-level lock`について]()

# Prisma
## セットアップ
### インストール

`prisma` のインストールは以下のコマンドで行う

https://www.prisma.io/docs/getting-started/quickstart  

``` bash
yarn add prisma typescript ts-node @types/node
yarn add @prisma/client
```
### 設定

`MariaDB`との連携設定

`prisma`は`MariaDB`対応していない。  
ただ、`MariaDB`は`MySQL`はほぼほぼ同じDBであり互換が効くので`MySQL`を`DataSource-Provider`として利用する.

`MySQL`として初期化

``` bash
yarn prisma init --datasource-provider mysql
```

データソース
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

1. `.env`に使用するDBを指す`DATABASE_URL`変数の設定を設けよ.  
    - `.env`ファイル

        ```bash
        MYSQL_ROOT_PASSWORD="rootpass"
        MYSQL_DATABASE="database"
        MYSQL_USER="user"
        MYSQL_PASSWORD="pass"
        MYSQL_HOST="localhost"
        MYSQL_PORT="3308" # 競合解消
        DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}"
        ```
        - `MySQL`のデフォルトPortは`3306`だが、ホスト側に別のMySQLがインストールされている場合、競合するため`3308`
2. `prisma db pull` をつかって使用中の`DB`設定(`schema`)を`prisma`に取り込む.
    - 使用中のDBはないためスキップ
3. `prisma generate`で`prisma client`を生成する.
    ``` bash
    npx prisma generate
    ```
## 基本
### モデルファイル

`prisma/schema.prisma`がモデルファイルになる

中は以下の３種類から成る
- `datasource`
    - 
- `generator`
- `model`

```prisma
フィールド名、フィールドタイプ、タイプ修飾、アトリビュート
```

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

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
    posts       Post[]
}
```
### 呼び出し

`Prisma`で基本的な記述は以下のような記述となる

``` typescript
await prisma.モデル.メソッド({
    オプション1: パラメータ1,
    オプション2: パラメータ2,
    オプション3: パラメータ3
})
```

`メソッド`とそれに対応する`オプション`、`パラメータ`のリストは以下のページに詳細に書かれている.

https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries


オプション・テーブルの`Required`は必須項目なため、入力し忘れなどに注意.

例
``` typescript
await prisma.user.findUnique({
    // findUnique必須項目: where
    where: {
        id: user_id
    }
})
```
## Select

### select * 

``` typescript
await prisma.user.findMany()
```
### limit 1

1つレコードを取得するにはいくつか方法がある。

``` typescript
await prisma.user.findMany({
    take: 1
})
```

``` typescript
await prisma.user.findFist()
```

``` typescript
await prisma.user.findUnique({
    where: {
        id: id
    }
})
```
どれも１つのレコードを取り出すという意味では同じ仕事をしてくれる.

`findFirst`は複数マッチのなかでも1件目のみを取得.

### find***OrThrow

- `findFirstOrThrow`
    - なにも見つからなかったら, `NotFoundError: No User found error`としてエラーを発生
    - `findFirst`は見つからなかったら, `null`が戻り値となる
    - `findFirstOrThrow`を使うことによって, 戻り値に`null`が来ることはない
        - 受け手側での処理が楽
    - 注意: 
        - `$transaction`の`sequential operation`では`NotFoundError`が発生するとロールバックしない
        - `sequential operation`ではなく`interactive transaction`に変更する
        - `$transaction`の`sequential operation`と`interactive transaction`の違いについては後述
- `findUniqueOrThrow`
    - 上記同様
## Insert系

以下のような`INSERT`系について

``` sql
INSERT INTO User(email, name) VALUES('test@email.com', 'test name')
```
### create

１件のレコード登録の場合

``` typescript
const user = await prisma.user.create({
    data: {
        name: body.name,
        email: body.email
    },
})
```

### createMany

一度に複数(2つ以上)のレコード生成する場合、`create`をループで回すより、`createMany`を使うのが速度差が大きく異なる.

2+での登録は`createMany`を使いましょう。


```typescript
const user = await prisma.user.createMany({
    data: body,
})
```


### `POST`リクエスト

上の二つをまとめて`POST`リクエストで対応するとすると(`user.post.ts`)、以下のようになる

``` typescript
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if(body instanceof(Array)){ // 配列入力の場合
        const user = await prisma.user.createMany({
            data: body,
        })
    } else { // オブジェクト入力の場合
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email
            },
        })
    }
})
```

`Postman`を使って`createMany`テストしよう

```json
[
    {
        'name': 'a',
        'email': 'a@email.com'
    }, {
        'name': 'b',
        'email': 'b@email.com'
    }, {
        'name': 'c',
        'email': 'c@email.com'
    }, {
        'name': 'd',
        'email': 'd@email.com'
    }, {
        'name': 'e',
        'email': 'e@email.com'
    }, {
        'name': 'f',
        'email': 'f@email.com'
    }, {
        'name': 'g',
        'email': 'g@email.com'
    }
]
```
## Update
## Delete
## TableJoin

SQLでは以下のような記述でテーブル結合を行うが、

```
SELECT * FROM User JOIN Post ON User.id = Post.authorId
```

`prisma` では外部キーを設定したテーブル同士の結合がサポートされている.

https://www.prisma.io/docs/concepts/components/prisma-schema/relations

https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries

### 外部キー作成

ユーザ`User`と投稿`Post`を保持するDBテーブルは以下のような`schema.prisma`となる

``` prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

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
    posts       Post[]
}

model Post {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    // relation attribute is required for one-to-one or one-to-many 
    author      User        @relation(fields: [authorId], references:[id])
    authorId    Int
}
```

以下が外部キーフィールドに該当する.  
実DBには作成されず関係性は`prsima`で管理される.

https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#relation

`@relation`アトリビュートをフィールドのアトリビュートに

``` typescript
author      User        @relation(fields: [authorId], refercens:[id])
```
``` typescript
posts       Post[]
```

```
npx prisma migrate dev
```

マイグレーション名を聞かれるので適当名前を書く

# Prisma with Nuxt.js(ver.3)
## Server-Side Directory Structure

`pages`同様, `localhost:3000/api/user`で
`api/user/index.ts`にアクセスできる
さらに、`api/user/123`で`[id].ts`で`id: 123`を受け取ってアクセスすることができる。

`[id].ts`の中身

```typescript
import { PrismaClient } from `@prisma/client`
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const users = await prisma.user.findMany()
    return users
})
```

