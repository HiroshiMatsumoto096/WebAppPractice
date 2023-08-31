<script setup lang="ts">
// index.vue
console.log('index.vue')
import { VDataTable } from 'vuetify/labs/VDataTable'

// const { data:hello_data } = await useFetch('/api/hello')
// console.log(hello_data.value)
// const { data:user_data } = await useFetch('/api/user')

// 
/*
const user_id = ref(11)
const name = ref("Hiroshi Matsumoto")
const email = ref("matsumoto@michiru.co.jp")
*/
const user_id = ref()
const name = ref()
const email = ref()

const upsertUser = () => {
    console.log(user_id.value)
    console.log(name.value)
    console.log(email.value)
    const response = useFetch('/api/user', {
       method: 'UPDATE',
       body: { 
            user_id: user_id.value,
            name: name.value,
            email: email.value,
        } 
    })
    console.log(response.error)
}

const {data:user_list, error:user_list_error, refresh:refreshUserList} = await useFetch('/api/user')
// const user_list = await useFetch('/api/user', transform: result => result.data)
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

const delUser = async (user_id) => {
    console.log('delUser')
    const response = await useFetch('/api/user', {
        body: {user_id: user_id}, 
        method: 'DELETE',
    })
    if(response.error.value){
       console.log(response.error) 
    }
    await refreshUserList()
}


const loadUser = async (target_user_id) => {
    console.log('loadUser')
    const match_user = user_list.value.find((user) => user.id === target_user_id)
    user_id.value = match_user.id 
    name.value = match_user.name
    email.value = match_user.email
}


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
        width: 90,
    },
    {
        key: 'options',
        title: 'オプション', 
        align: 'center',
        width: 200,
    },
]

onMounted(() => {
})

</script>

<template>
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
                        <template v-slot:item.options="{item}">
                            <v-btn compact @click="loadUser(item.raw.id)">更新</v-btn>
                            <v-btn compact @click="delUser(item.raw.id)">削除</v-btn>
                        </template>
                        <template #bottom></template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-card-text>
    </v-card>
    <v-card class="ma-6">
        <v-card-title align="center">
           入力 
        </v-card-title>
        <v-card-text align="center">
           <v-form @submit="upsertUser">
             <v-text-field v-model=name label="name"></v-text-field> 
             <v-text-field v-model=email label="email"></v-text-field> 
             <v-btn type="submit">submit</v-btn>
           </v-form> 
        </v-card-text>
    </v-card>
</template>


