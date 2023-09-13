<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

const input_name = ref("hiroshi")
const input_email = ref("matsumoto@michiru.co.jp")


const addUser = async () => {
    const {data:user_data} = await useFetch('/api/user', {
        method: 'POST',
        body: {
            name: input_name.value,
            email: input_email.value
        }
    })
    refreshUserList()
}

const {data:user_list, refresh:refreshUserList} = await useFetch('/api/user')

const user_list_headers = [
    {
        key: 'email',
        title: 'email',
        align: 'center'
    },
    {
        align: 'center',
        key: 'name',
        title: 'name'
    }
]

const selected_user = ref()
if(user_list.value.length){
    selected_user.value = user_list.value[0] 
}

watchEffect(() => {
    console.log(selected_user.value)
/*
    user_select.value = user_list.value.map((user) => {
        return {
            'key': user.id,
            'title': user.name
        }
    })
*/
})

onMounted(() => {
})

const input_amount = ref(0)


const addAccount = async () => {
    console.log('addAccount')
    console.log(selected_user.value)
    console.log(input_amount.value)
    const body = {
        user_id: selected_user.value.id,
        amount: parseInt(input_amount.value)
    }
    console.log(body)
    const {data:user_data} = await useFetch('/api/account', {
        method: 'POST',
        body: body
    })
}


</script>


<template>
<!-- user input -->
<v-card>
    <v-card-title>
        add user 
    </v-card-title>
    <v-card-text>
        <v-text-field v-model=input_name></v-text-field>
        <v-text-field v-model=input_email></v-text-field>
        <v-btn @click.stop.prevent="addUser" type="submit">submit</v-btn>
    </v-card-text>
</v-card>
<!-- user list -->
<v-card>
    <v-card-title>
        user list
    </v-card-title>
    <v-card-text>
        <v-data-table :items="user_list" :headers="user_list_headers"> 
            <template v-slot:item.email={item}>
               {{ item.raw.email }}
            </template>
            <template v-slot:item.name={item}>
               {{ item.raw.name }}
            </template>
        </v-data-table>
    </v-card-text>
</v-card>
<!-- user list -->
<v-card>
    <v-card-title>
        create accout  
    </v-card-title>
    <v-card-text>
        <v-select v-model=selected_user :items="user_list" item-title='name' item-value='id'></v-select>
        <v-text-field v-model=input_amount></v-text-field>
        <v-btn @click.stop.prevent="addAccount" type="submit">create</v-btn>
    </v-card-text>
</v-card>
</template>
