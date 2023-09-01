# Q n A


## `await prisma.$disconnect()`の`$`ってなに？

https://qumeru.com/magazine/364

https://stackoverflow.com/questions/205853/why-would-a-javascript-variable-start-with-a-dollar-sign

慣例的に頭に


## useFetch と useAsyncData の違い

https://blog.cloud-acct.com/posts/nuxt3-usefetch-cashe/


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

pages/asdf.vue
pages/qwer.vue

