# WebApp

ユーザ管理ツール

1画面完結型


## 準備
- DB構築
- Nuxt Server (API)
- Prisma

### MariaDB

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql

`MSQL/data`のディレクトリ作成を作成する

```
docker-compose up --build -d
```

オプション説明  
`-d` : 裏で動作させる: 実行結果などを非表示

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

```
root@11512asdf:/#
```

mariadbの`REPL`に入る  
(REPL: read evaluate print loop)

```
root@11512asdf:/# mariadb -u piro -D piro -ppiro
```

コマンドオプション説明  
- `-u`: ユーザ@`mariadb`の指定
- `-D`: データベースの指定
- `-ppiro`: ユーザ@`mariadb`のパスワード; `-p`に空白なしで続けて入力することでパスワード入力を回避
  - `-p`だけにしたら、別途パスワード入力が求められる
  - 本番環境などではこのやり方はお勧めできない

(MariaDBの世界に突入)
```
Server version: 11.0.3-MariaDB-1:11.0.3+maria~ubu2204 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [piro]>
```

この画面で新しいDBの作成、ユーザ作成、テーブル作成、テーブルのデータ操作が可能

https://shelokuma.com/2023/02/17/command-list-for-mariadb/

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
}
```

[x] API動作確認

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
2. `prisma db pull` をつかって使用中の`DB`設定(`schema`)を`prisma`に取り込む.
3. `prisma generate`で`prisma client`を生成する

課題:

現在`.env`が二つある状態になっている
- .env
- app/.env

さらに、`docker-compose.yml`で`.env`の内容を読み込む設定をしていないです。
- docker-compose.yml


付け焼刃状態です。

`app/.env`
```
DATABASE_URL="mysql://piro:piro@localhost:3308/piro"
```

希望としては以下の様な記述で動くとよい

`.env`
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

`prisma`を使ってデータベースのテーブル構築

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

マイグレーション処理実行

```
yarn prisma migrate dev --name init
```

### API Access確認

`index.vue`の`<script>`内に  
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

```
model User {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    email       String      @unique
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

### D: Delete
```
const delUser = async (user_id) => {
    console.log('delUser')
    const response = await useFetch('/api/user', {
        body: {user_id: user_id}, 
        method: 'DELETE',
    })
    if(response.error.value){
       console.log(response.error) 
    }
    // リスト更新
    await refreshUserList()
}
```

```
const user_list_header = ref([])
user_list_header.value = [
    {
        key: 'name',
        title: '名前',
        align: 'start', 
        width: 70,
    },
    {
        key: 'email',
        title: 'email', 
        align: 'center',
        width: 100,
    },
    {
        key: 'delete',
        title: '削除', 
        align: 'center',
        width: 100,
    },
]
```

```
<v-card-text align="center">
    <v-data-table :items="user_list" :headers="user_list_header">
        <template v-slot:item.name="{item}">
            {{ item.raw.name }}
        </template>
        <template v-slot:item.email="{item}">
            {{ item.raw.email }}
        </template>
        <template v-slot:item.delete="{item}">
            <v-btn @click="delUser(item.raw.id)">削除</v-btn>
        </template>
        <template #bottom></template>
    </v-data-table>
</v-card-text>
```

`user.delete.ts`
```
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('user.delete.ts')
    const body = await readBody(event)
    console.log('body: ', body)
    const user = await prisma.user.delete({
        where: {
            id: body.user_id
        },
    })
    const response = await prisma.$disconnect()
})
```

