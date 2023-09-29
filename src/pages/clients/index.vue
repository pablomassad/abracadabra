<template>
    <div class="back">
        <q-input v-model="criteria" label="Buscar clientes" class="filterText" clearable color="black" bg-color="white" filled>
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="listFrame">
            <div v-for="cli in store.state.clients" :key="cli">
                <div class="grdClient" v-if="evalFilter(cli) && !cli.hidden" :class="{'negativeTag': (cli.balance < 0), 'positiveTag': (cli.balance >= 0)}">
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
                    <q-fab color="orange" text-color="white" icon="keyboard_arrow_left" direction="left" class="fabOptions" padding="xs">
                        <q-fab-action color="orange" text-color="white" @click="onEditAdd(cli)" icon="edit" />
                        <q-fab-action color="orange" text-color="white" @click="onDelete(cli)" icon="delete" />
                        <q-fab-action color="orange" text-color="white" @click="onMail(cli)" icon="mail" />
                        <q-fab-action color="orange" text-color="white" @click="onPhone(cli)" icon="phone" />
                    </q-fab>
                </div>
            </div>
        </div>

        <q-btn round @click="onEditAdd" icon="add" class="btnAdd" color="orange"></q-btn>

        <ConfirmDialog :prompt="prompt" message="Desea ocultar este cliente? (No se  perdera nada de la facturación)" :onCancel="onCancelDialog" :onAccept="onAcceptDialog" />
        <ClientForm ref="refClientForm" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import store from 'src/pages/clients/store'
import moment from 'moment'
import ConfirmDialog from 'fwk-q-confirmdialog'
import ClientForm from './clientForm.vue'

const criteria = ref()
const refClientForm = ref()

const prompt = ref(false)
const onAcceptDialog = ref()
const onCancelDialog = ref()

onMounted(async () => {
    store.actions.getClients()
})
const evalFilter = (v) => {
    const flag = Object.keys(v).some(k => {
        let result = false
        const o = v[k]
        if (o) { result = o.toString().toUpperCase().indexOf(criteria.value?.toUpperCase()) !== -1 || (!criteria.value) }
        return result
    })
    return flag
}
const onEditAdd = (cli) => {
    refClientForm.value.set({
        showForm: true,
        data: cli
    })
}
const onDelete = (cli) => {
    prompt.value = true
    onAcceptDialog.value = async () => {
        prompt.value = false
        await store.actions.hideClient(cli)
        await store.actions.getClients()
    }
    onCancelDialog.value = () => {
        prompt.value = false
    }
}
const onPhone = (cli) => {
    window.open(`tel:+${cli.telephone}`)
}
const onMail = (cli) => {
    const recipient = cli.mail
    const subject = 'Abracadabra'
    const body = ''

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
}

</script>

<style scoped>
.btnAdd {
    z-index: 1000;
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.fabOptions {
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.filterText {
    margin: 8px 16px 0;
}

.listFrame {
    overflow: auto;
    height: calc(100vh - 107px);
}

.grdClient {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    background: white;
    margin: 16px;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 1px 1px 10px #545353;
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
