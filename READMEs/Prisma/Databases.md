# Databases


## ロック(Lock)

データの読み書きを制限すること。

ロックの種類
- 共有ロック
    - READはOK
    - UPDATEはNG
- 排他ロック
    - READ, UPDATEともにNG

共有ロック、排他ロックはRDBMS上でロックされる。

上とは別に、RDBMS上には実装されていないロック  
(アプリ側で制御しないといけない)

楽観的ロック
- データ読み出し時にキャッシュ
- 更新時、キャッシュとの差分を確認：他ユーザによる更新の有無確認
- 更新ありの場合は、己の更新はキャンセル

悲観的ロック
- データ読み出し時から既にロックをかける

ロックはトランザクションを担保するための技術

# Prisma

```typescript
const [posts, totalPosts] = await prisma.$transaction([
  prisma.post.findMany({ where: { title: { contains: 'prisma' } } }),
  prisma.post.count(),
])
```

```typescript
const [userList, updateUser] = await prisma.$transaction([
  prisma.$queryRaw`SELECT 'title' FROM User`,
  prisma.$executeRaw`UPDATE User SET name = 'Hello' WHERE id = 2;`,
])
```

## Optimistic concurrency control
(楽観的並行性制御)

https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide

https://github.com/prisma/prisma/issues/4988


