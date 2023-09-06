# Prisma


## Server-Side Directory Structure

以下のようにフォルダ構造を変更すると

```
api
├── hello.ts
└── user
    ├── [id].ts
    ├── delete.ts
    ├── index.ts
    ├── post.ts
    ├── put.ts
    └── update.ts
```

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

## Select

https://www.prisma.io/docs/reference/api-reference/prisma-client-reference

### limit 1

以下のSQL文に相当するPrismaの使い方は

```
select * from User limit 1  
```

```
await prisma.user.findUnique({
    where: {
        id: id
    }
})
```

もしくは

```
await prisma.user.findFist({
    where: {
        id: id
    }
})
```

どちらも同じ仕事をしてくれる.

`findFirst`は複数マッチのなかでも1件目のみを取得.


### createMany

`user`の`POST`に1件の入力か, 複数を受けたか、判断し
1件の場合は`create`,1+件の場合は`createMany`でDBに`insert`する動きに変更


複数件の入力例

```
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
```
		
Postmanを使ってテストしよう


### TableJoin

https://www.prisma.io/docs/concepts/components/prisma-schema/relations

https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries

前準備

`schema.prisma`ファイルの修正

```
model Post {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    message     String?
    // relation attribute is required for one-to-one or one-to-many 
    author      User        @relation(fields: [authorId], references:[id])
    authorId    Int
}
```

`author      User        @relation(fields: [authorId], refercens:[id])`

リレーションフィールドとなり,直下のauthorIdフィールドとUserモデルのidカラムの関係性を構築している

`User`モデルの修正

`posts Post[]`の追加

```
model User {
    id          Int         @id @default(autoincrement())
    createdAt   DateTime    @default(now())
    email       String      @unique
    name        String?
    posts       Post[]
}

```

User, Postの記述が終わったら、以下のコマンドでマイグレーションを行う

```
npx prisma migrate dev
```

マイグレーション名を聞かれるので適当名前を書く




### createMany

Table Join
		
Transaction
		

			
ロック ( 別日に詳細なお話をしようと思います。 )
		
		
		
上全てをハンズオンで確認
		
Manyの有無の差を確認
	
	
	
Prisma Clientインスタンスのsingleton化
	

		
デザインパターンsingletonの説明
	
	
	
nuxt server側のフォルダ分け
	
APIでのquery parameterの受け取り方
	

		
localhost:3000/api/user?id=1など
		
const query = getQuery(event)
	
	
	
useNuxtData
	

		
キャッシュされたデータ再取得
		
useNuxtData('キー値')
	
	
	
ファイル操作@サーバー
	

		
サーバー上にファイルを設置/削除
		
サーバー上のファイルをダウンロード
	
	
	
状態管理
	

		
useState
	
	
	
backendのmiddleware
	
node バージョン管理
	

		
nvm-windows
	
	
	
yup
	

		
ハンズオン
	
	
	
認証
	

		
nuxt-auth
		
多分、別日
	
	
	
同期/非同期のお話(async/await)
	

		
多分、別日
