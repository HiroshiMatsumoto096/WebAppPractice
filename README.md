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
```

### Prisma

`prisma` のインストール

https://www.prisma.io/docs/getting-started/quickstart

`yarn add prisma typescript ts-node @types/node`

`yarn prisma init --datasource-provider mysql`  

mysql for mariadb

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

app/.env

```
DATABASE_URL="mysql://root:piroro@localhost:3308/piro"
```

希望としては以下の様な記述で動くとよい

```
MYSQL_ROOT_PASSWORD="piroro"
MYSQL_DATABASE="piro"
MYSQL_USER="piro"
MYSQL_PASSWORD="piro"
MYSQL_HOST="localhost"
MYSQL_PORT="3308"

DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}"
```

さらに、
`docker-compose.yml`
が以下の様に記述できると嬉しい

docker-compose.ymlと同じフォルダの.envのシンボリックリンクを作成し、prismaでも.envとして読ませる

## migration

`prisma/schema.prisma`

```
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


```
yarn prisma migrate dev --name init
```

### API Access確認
`index.vue`

`<script>`内に  

```
const addNewUser = () => {
    const response = useFetch('/api/user', {
       method: 'POST',
       body: { 
            name: 'Hiroshi Matsumoto',
        } 
    })
}
```

`<template>`内に  

```
<v-form @submit="addNewUser">
 <v-text-field label="name"></v-text-field> 
 <v-text-field label="email"></v-text-field> 
 <v-btn type="submit">submit</v-btn>
</v-form> 
```


`server/api/user.posts.ts`に  

```
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
})
```

ボタン動作確認

ターミナルに以下が表示されればOK
```
user.post.ts
{ name: 'Hiroshi Matsumoto' }
```
[x] フロントとバックエンドの通信確認 
[x] バックエンドの動作確認
[x] バックエンドのconsole.log (プリント)確認


## CRUD

### C: create

```
const name = ref("Hiroshi Matsumoto")
const email = ref("matsumoto@michiru.co.jp")

const addNewUser = () => {
    const response = useFetch('/api/user', {
       method: 'POST',
       body: { 
            name: name.value,
            email: email.value
        } 
    })
}
```


```
<v-card-text align="center">
   <v-form @submit="addNewUser">
     <v-text-field v-model=name label="name"></v-text-field> 
     <v-text-field v-model=email label="email"></v-text-field> 
     <v-btn type="submit">submit</v-btn>
   </v-form> 
</v-card-text>
```

```
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('user.post.ts')
    const body = await readBody(event)
    console.log(body)
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        },
    })
    const response = await prisma.$disconnect()
    console.log(response)
})
```

@unique削除: unique constrainエラー???
```
model User {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    email       String 
    name        String?
}
```


ボタン押下後、DB確認

```
MariaDB [piro]> select * from User;
+----+-------------------------+-------------------------+-------------------+
| id | createdAt               | email                   | name              |
+----+-------------------------+-------------------------+-------------------+
|  1 | 2023-08-29 00:23:10.207 | matsumoto@michiru.co.jp | Hiroshi Matsumoto |
+----+-------------------------+-------------------------+-------------------+
1 row in set (0.000 sec)
```


### R: read

`server/api/user.get.ts`

```
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('user.get.ts')
    const users = await prisma.user.findMany()
    return users
})
```


`curl localhost:3000/api/user`
```
[
  {
    "id": 1,
    "createdAt": "2023-08-29T00:23:10.207Z",
    "email": "matsumoto@michiru.co.jp",
    "name": "Hiroshi Matsumoto"
  }
]%
```

[x] バックエンド通信確認


```
<v-card variant="flat" class="ma-6">
    <v-card-title align="center">
      ユーザ
    </v-card-title>
    <v-card-text align="center">
        <v-card>
            <v-card-title align="center">
              リスト
            </v-card-title>
            <v-card-text align="center">
                <v-data-table :items="user_list" :headers="user_list_header">
                    <template v-slot:item.name="{item}">
                        {{ item.raw.name }}
                    </template>
                    <template v-slot:item.email="{item}">
                        {{ item.raw.email }}
                    </template>
                    <template #bottom></template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-card-text>
</v-card>
```

フェッチ呼び出し追加

```
const {data:user_list, error:user_list_error, refresh:refreshUserList} = await useFetch('/api/user')
/*
const user_list = reft([])
// const userlist= await useFetch('/api/hello')
const getUser = async () => {
    console.log('getUser')
    const response = await useFetch('/api/user')
    if(response.error.value){
       console.log(response.error) 
    }
    return response.data 
}
*/

新しいユーザを追加して動作確認

```
