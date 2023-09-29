<template>
    <ConfirmDialog :prompt="local.showForm">
        <template #header>
            <div class="row justify-between">
                <span class="text-h6 text-primary text-weight-bold">
                    {{ local.data?.wonum ? 'Editar ' : 'Crear' }} Cliente
                </span>
            </div>
        </template>
        <template #default>
            <div class="background-expansion">
                <InputTextV1 ref="refFirstName" @change="evalDirtysInputs" class="inputFrame " />
                <InputTextV1 ref="refLastName" @change="evalDirtysInputs" class="inputFrame " />
                <InputTextV1 ref="refAddress" @change="evalDirtysInputs" class="inputFrame " />
                <InputTextV1 ref="refTelephone" @change="evalDirtysInputs" class="inputFrame " />
                <InputTextV1 ref="refMail" @change="evalDirtysInputs" class="inputFrame " />
                <InputTextV1 ref="refBirthday" @change="evalDirtysInputs" class="inputFrame " />
            </div>
        </template>
        <template #footer>
            <div class="btnContainer">
                <q-btn class="btnFooter" round color="blue-8" icon="close" @click="cancel" />
                <q-btn class="btnFooter" round color="blue-8" icon="save" @click="confirmSave" :disable="!ui.state.preventBack" />
            </div>
        </template>
    </ConfirmDialog>
    <ConfirmDialog :prompt="showConfirm" :message="dialogMessage" :onAccept="onAcceptDialog" :onCancel="onCancelDialog" />
</template>

<script setup>
import { ref } from 'vue'
import ConfirmDialog from 'fwk-q-confirmdialog'
import { InputTextV1 } from 'fwk-q-inputs'
import store from './store'
import { ui } from 'fwk-q-ui'
import { useMerge } from 'fwk-composables'

const { merge } = useMerge()

console.log('ClientForm CONSTRUCTOR: ')

const showConfirm = ref(false)
const dialogMessage = ref()
const onAcceptDialog = ref()
const onCancelDialog = ref()

const refFirstName = ref(null)
const refLastName = ref(null)
const refAddress = ref(null)
const refMail = ref(null)
const refTelephone = ref(null)
const refBirthday = ref(null)

const local = ref({
    showForm: false,
    data: undefined
})

const initBindingForm = () => {
    refFirstName.value.setData({
        label: 'Ingrese  Nombre',
        value: local.value.data?.firstname,
        required: false
    }, '*')
    refLastName.value.setData({
        label: 'Ingrese apellido',
        value: local.value.data?.lastName,
        required: true
    }, '*')
    refAddress.value.setData({
        label: 'Ingrese domicilio',
        value: local.value.data?.address,
        required: false
    }, '*')
    refTelephone.value.setData({
        label: 'Ingrese teléfono',
        value: local.value.data?.telephone,
        required: true
    }, '*')
    refMail.value.setData({
        label: 'Ingrese email',
        value: local.value.data?.email,
        required: false
    }, '*')
    refBirthday.value.setData({
        label: 'Ingrese cumpleaños',
        value: local.value.data?.birthday,
        required: false
    }, '*')
}

const cancel = () => {
    if (ui.state.preventBack) {
        showConfirm.value = true
        dialogMessage.value = 'Tiene cambios pendientes, ¿desea salir sin grabar?'
        onAcceptDialog.value = async () => {
            showConfirm.value = false
            resetForm()
        }
        onCancelDialog.value = () => {
            showConfirm.value = false
        }
    } else {
        resetForm()
    }
}
const resetForm = () => {
    local.value.showForm = false
    local.value.data = undefined
    ui.actions.setPreventBack(false)
}

const confirmSave = () => {
    showConfirm.value = true
    dialogMessage.value = 'Confirma la grabacion de cambios?'
    onAcceptDialog.value = async () => {
        const firstName = refFirstName.value.props.data.value.firstName
        const lastName = refLastName.value.props.data.value.lastName
        const payload = {
            firstName,
            lastName,
            fullName: `${lastName}, ${firstName}`,
            address: refAddress.value.props.data.value.address,
            email: refMail.value.props.data.value.mail,
            telephone: refAddress.value.props.data.value.telephone,
            birthday: refAddress.value.props.data.value.birthday
        }
        await saveData(payload)
    }
    onCancelDialog.value = () => {
        console.log('cancel  dialog')
        showConfirm.value = false
    }
}

const saveData = async (payload, plNovelty) => {
    const result = await store.actions.save(payload)
    showConfirm.value = false
    if (!result) return
    resetForm()
}

const evalDirtysInputs = () => {
    const flag = refFirstName.value.props.data.dirty ||
        refLastName.value.props.data.dirty ||
        refAddress.value.props.data.dirty ||
        refMail.value.props.data.dirty ||
        refAddress.value.props.data.dirty ||
        refTelephone.value.props.data.dirty ||
        refMail.value.props.data.dirty ||
        refBirthday.value.props.data.dirty

    ui.actions.setPreventBack(flag)
}
const set = (val, prop) => {
    local.value = merge(local.value, val, prop)
    setTimeout(() => {
        initBindingForm()
    }, 10)
}
defineExpose({ set })

</script>

<style lang="scss" scoped>
.inputFrame {
    margin-bottom: 15px;
    /*margin-bottom: 30px !important;*/
}
</style>
