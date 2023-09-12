# ポスティングサイト

ポスティングサイトの構築

サイト構築とともに`Nuxt.Js` + `Prisma`の使い方を学ぶことを目的とする

## ユーザー管理
流れとしてユーザー管理（登録、読込、更新、削除）を構築する


登録 (`Create`)、読込 (`Read`)、更新 (`Update`)、削除 (`Delete`)のことを総じて`CRUD`という

## CRUD⇔リクエスト

`REST API`形式で構築していく。

`REST API`ではCRUD操作とリクエストメソッドは以下のような対応関係にある.

間違えやすいので注意

|  CRUD  | リクエスト・メソッド |
| :----- | :------------------: |
| create |         POST         |
| read   |         GET          |
| update |         PUT          |
| delete |        DELETE        |

次項で説明するが`user.update.ts`のように
`CRUD`名とリクエストメソッド名とごっちゃになりやすいので注意

## Nuxt.js Server (API)

`Nuxt`初期設定で`server`フォルダが作成され、その`server`フォルダに`api`フォルダに`api`スクリプトを設置することで`api`として動作する。

```
server/api/user.post.ts
```

ファイル名にAPIリクエストのメソッド名を追加することでリクエストに対応する.

リクエスト・メソッドは
登録は`POST`,
読込は`GET`,
更新は`PUT`,
削除は`DELETE`となる。

注意として`GET`メソッドにはリクエストメソッド名は不要.
```
server/api/user.get.ts
```
ではなく

```
server/api/user.ts
```
で、`GET`メソッドが動作する。


`POST`リクエストを受けるスクリプト設置例
```
server/api/user.post.ts
```

上記の設置されたスクリプトに対してのエンドポイントURLは以下となる.

```
localhost:3000/api/user
```

このエンドポイントに対して`POST`リクエストを送信することで`user.post.ts`がリクエストを受ける.

詳しくは
- https://nuxt.com/docs/guide/directory-structure/server#matching-http-method
- https://nuxt.com/docs/guide/directory-structure/server#handling-requests-with-body

## 登録: Create

`<script setup lang="ts"></script>`内に以下を追加  
```typescript
const name = ref("Hiroshi Matsumoto") // テスト用デフォ値設定
const email = ref("matsumoto@michiru.co.jp") // テスト用デフォ値設定

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

`<template></template>`内に以下を追加  
```typescript
<v-card-text align="center">
   <v-form @submit="addNewUser">
     <v-text-field v-model=name label="name"></v-text-field> 
     <v-text-field v-model=email label="email"></v-text-field> 
     <v-btn type="submit">submit</v-btn>
   </v-form> 
</v-card-text>
```

`server/api/user.ts`内に以下を追加  
```typescript
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email
        },
    })
})
```

### 確認

ブラウザを開き、`submit`ボタンを押下することで、登録される動きとなる。
実際に、ボタン押下後、DB確認を行いたい。

`MariaDB`に接続

```
docker-compose exec mariadb mariadb -user user -ppass -Ddatabase
```

`MariaDB`で確認

```bash
MariaDB [database]> select * from User;
+----+-------------------------+-------------------------+-------------------+
| id | createdAt               | email                   | name              |
+----+-------------------------+-------------------------+-------------------+
|  1 | 2023-08-29 00:23:10.207 | matsumoto@michiru.co.jp | Hiroshi Matsumoto |
+----+-------------------------+-------------------------+-------------------+
1 row in set (0.000 sec)
```

[リアルタイム確認]()も確認しておくと追々便利である。

## 読込: Read

### バックエンド側作成
以下のファイルを作成  
`server/api/user.ts`
```typescript
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    console.log('user.get.ts')
    const users = await prisma.user.findMany()
    return users
})
```

APIの通信確認

```bash
curl localhost:3000/api/user
```

```json
[
  {
    "id": 1,
    "createdAt": "2023-08-29T00:23:10.207Z",
    "email": "matsumoto@michiru.co.jp",
    "name": "Hiroshi Matsumoto"
  }
]%
```

### フロントエンド側作成

`<script>`の中に以下を追加
```typescript
// v-data-tableはまだ正式リリースされてなく
// 開発段階のものを使用
// そのため、import文が必要
import { VDataTable } from 'vuetify/labs/VDataTable'

....
....
....

const user_list_header = [
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
        width: 90,
    },
]
```

`<template>`の中に以下を追加

```html
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

```typescript
// useFetchを使ったやり方
const {data:user_list, error:user_list_error, refresh:refreshUserList} = await useFetch('/api/user')
/*
// 関数化
const user_list = reft([])
// const userlist= await useFetch('/api/hello')
const getUser = async () => {
    const response = await useFetch('/api/user')
    if(response.error.value){
       console.log(response.error) 
    }
    return response.data 
}
*/
```

新しいユーザを追加して動作確認

## 更新: Update

`pages/index.vue`の`<script setup lang="ts"></script>`内に

``` typescript
// upsert -> PUT
const upsertUser = () => {
    const response = useFetch('/api/user', {
       method: 'PUT',
       body: { 
            user_id: user_id,
            name: name,
            email: email,
        } 
    })
    // ユーザ情報更新後、フロント側のユーザリスト更新(これで表示の自動更新がかかる)
    refreshUserList()
}
```

`server/api/user.put.ts`  
``` typescript
import { PrismaClient } from `@prisma/client` 
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // 
    const body = await readBody(event)
    // update
    const user = await prisma.user.upsert({
        where: {
            id: body.user_id,
            email: body.email
        },
        update: {
            name: body.name,
            email: body.email            
        },
        create: {
            name: body.name,
            email: body.email            
        }
    })
})
```

## 削除: Delete


削除API`user.delete.ts`を作成
```typescript
import { PrismaClient } from `@prisma/client` 

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const user = await prisma.user.delete({
        where: {
            id: body.user_id
        },
    })
})
```

削除API呼び出しを作成

```typescript
const delUser = async (user_id) => {
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

データテーブルに削除列を追加

```typescript
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
削除列に削除ボタンを配置

```html
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

