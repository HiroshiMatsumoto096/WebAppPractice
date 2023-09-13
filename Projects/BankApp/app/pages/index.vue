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

const user_select = [
        {        
            key: 'a',
            title: 'japan'
        }, {
            key: 'b',
            title: 'us',
        }, {
            key: 'c',
            title: 'uk'
        }
    ]
onMounted(() => {
console.log(user_list.value)
})
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
        <v-select :items="user_select">
        </v-select> 
        <v-text-field v-model=input_email></v-text-field>
        <v-btn @click.stop.prevent="addUser" type="submit">submit</v-btn>
    </v-card-text>
</v-card>
</template>
