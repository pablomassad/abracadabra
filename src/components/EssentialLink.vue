<template>
    <q-item clickable @click="goto()">
        <q-icon :name="icon" class="linkIcon"/>
        <q-item-section>
            <q-item-label style="font-weight: bold;">{{ title }}</q-item-label>
            <q-item-label caption>{{ caption }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: '#'
    },
    icon: {
        type: String,
        default: ''
    }
})

const goto = () => {
    console.log('goto: ', props.link)
    router.push(props.link)
}
</script>

<style scoped>

.linkIcon{
    color: rgb(253 138 32);
    font-size: 35px;
    text-shadow: 1px 1px 1px gray;
    margin: 0 7px;
}
</style>
