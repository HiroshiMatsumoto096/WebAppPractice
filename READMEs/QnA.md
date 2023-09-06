# Q n A


## `await prisma.$disconnect()`の`$`ってなに？

https://qumeru.com/magazine/364

https://stackoverflow.com/questions/205853/why-would-a-javascript-variable-start-with-a-dollar-sign

調査した結果、`$`に特に意味はなく、メソッド名の一部。
`jQuery`とか`php`の慣習を受けて？

## useFetch と useAsyncData の違い

### useFetch

useFetchはuseAsyncDataをラップしたもの

```
useFetch(URL) = useAsyncData('Fetch', () => $fetch(URL))

useAsyncData('Fetch', () => $fetch(URL), {server:false})
```
``` typescript
const { data:user_list, refresh:refreshUserList } = useAsyncData('getUserList', () => $fetch('/api/user'), {server:false})
```

const target_user = ref()

target_user.value = OBJECT

const {data:fetch_url, refresh: refreshURL} = useAsyncData('Fetch', () => $fetch(URL), {
    transform: r = r.value,
    watch: target_user
})

const {data:fetch_url3, refresh:refreshURL3} = useAsyncData('Fetch', () => $fetch(URL3), {
    transform: r = r.value,
    watch: target_user
})

refresh()
console.log(data)

# useFetchの使い方

通常使用だと以下の使い方でよい.

`const {data, refresh, error, pending} = useFetch(URL)`



https://nuxt.com/docs/api/composables/use-fetch

https://nuxt.com/docs/api/composables/use-async-data

https://blog.cloud-acct.com/posts/nuxt3-usefetch-cashe/

https://nuxt.com/docs/api/composables/use-nuxt-data

a key that is unique to the file name and line number of the instance of useAsyncData will be generated for you.

## nuxtのpagesルーティング

- 自動版
    ``` typescript
    // 何か処理
    // 処理後、自動的にページ遷移したい
    await navigateTo('hello')
    // middleware では awaitの代わりにreturn
    ```

- ボタン版
    ``` html   
    <v-btn nuxt :to="{path: '/events/'}"
    ```

- リンク版
    ``` typescript
    <a nuxt :to={path: 'hello'}> hello </a>
    ```

## nuxt/pagesについて


