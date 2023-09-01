<script setup lang="ts">
// index.vue
console.log('index.vue')
import { VDataTable } from 'vuetify/labs/VDataTable'

// const { data:hello_data } = await useFetch('/api/hello')
// console.log(hello_data.value)
// const { data:user_data } = await useFetch('/api/user')

// 
const user_id = ref()
const name = ref("Piro")
const email = ref("piro@michiru.co.jp")
const loaded_info = ref(false)

// POST
const addUser = () => {
    const response = useFetch('/api/user', {
       method: 'POST',
       body: { 
            user_id: user_id.value,
            name: name.value,
            email: email.value,
        } 
    })

    refreshUserList()
}
// GET
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
// UPSERT -> PUT
const upsertUser = () => {
    const response = useFetch('/api/user', {
       method: 'PUT',
       body: { 
            user_id: user_id,
            name: name,
            email: email,
        } 
    })
    refreshUserList()
}
// DELETE
const delUser = async (user_id:Number) => {
    console.log('delUser')
    const {data, refresh, status} = await useFetch('/api/user', {
        body: {user_id: user_id}, 
        method: 'DELETE',
    })

    if(response.error.value){
       console.log(response.error) 
    }
    await refreshUserList()
}

//
const loadUser = async (target_user_id: Number) => {
    console.log('loadUser')
    const match_user = user_list.value.find((user:any) => user.id === target_user_id)
    user_id.value = match_user.id 
    name.value = match_user.name
    email.value = match_user.email
    loaded_info.value = true
}


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
           <v-form @submit.prevent="addUser">
             <v-text-field v-model=name label="name"></v-text-field> 
             <v-text-field v-if="loaded_info" disabled v-model=email label="email"></v-text-field> 
             <v-text-field v-else v-model=email label="email"></v-text-field> 
             <v-btn type="submit">submit</v-btn>
           </v-form> 
        </v-card-text>
    </v-card>
</template>


