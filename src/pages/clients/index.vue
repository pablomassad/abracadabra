<template>
    <div class="backIntegralmente">
        <q-input v-model="criteria" label="Buscar clientes" class="filterText" clearable  color="black" bg-color="lightgray" filled >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
        <div class="listFrame">
            <div v-for="cli in store.state.clients" :key="cli">
                <div class="grdClient" v-if="evalFilter(cli)">
                    <div class="grdItem">
                        <q-icon name="shopping_cart" class="clientIcon"></q-icon>
                        <div class="clientValue">$ {{ cli.balance }}</div>
                    </div>
                    <div class="grdItem">
                        <q-icon name="person" class="clientIcon"></q-icon>
                        <div class="clientValue"> {{ cli.lastName }} {{ cli.firstName }}</div>
                    </div>
                    <div class="grdItem">
                        <q-icon name="place" class="clientIcon"></q-icon>
                        <div class="clientValue"> {{ cli.address }} </div>
                    </div>
                    <div class="grdItem">
                        <q-icon name="email" class="clientIcon"></q-icon>
                        <div class="clientValue"> {{ cli.email }} </div>
                    </div>
                    <div class="grdItem">
                        <q-icon name="phone" class="clientIcon"></q-icon>
                        <div class="clientValue"> {{ cli.telephone }}</div>
                    </div>
                    <div class="grdItem">
                        <q-icon name="cake" class="clientIcon"></q-icon>
                        <div class="clientValue"> {{ moment(cli.birthday).format('DD/MM/YYYY') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!--<ion-item class="clientCard" [style.background]="(cli.balance >= 0) ?
        'linear-gradient(to bottom, #ded 0%, #ded 88%, #cdc 100%)':
        'linear-gradient(to bottom, #edd 0%, #edd 88%, #dcc 100%)'">-->

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import store from 'src/pages/clients/store'
import moment from 'moment'

const criteria = ref()

onMounted(async () => {
    store.actions.getClients()
})
const onChangeFilter = (event) => {
    criteria.value = event
}
const evalFilter = (v) => {
    const flag = Object.keys(v).some(k => {
        let result = false
        const o = v[k]
        if (o) { result = o.toString().toUpperCase().indexOf(criteria.value?.toUpperCase()) !== -1 || (!criteria.value) }
        return result
    })
    return flag
}
</script>

<style scoped>
.filterText{
    margin:8px 16px 0;
}
.listFrame {
    overflow: auto;
    height: calc(100vh - 107px);
}

.grdClient {
    display: flex;
    flex-wrap: wrap;
    background: white;
    margin: 16px;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 1px 1px 4px gray;
}

.grdItem {
    display: flex;
    padding: 4px 0;
    width: 300px;
    flex-basis: 300px;
    flex-grow: 1;
    flex-shrink: 1;
}

.clientIcon {
    font-size: 20px;
    text-shadow: 1px 1px 1px lightgray;
    padding: 0 8px 0 0;
    color: gray;
}
</style>
