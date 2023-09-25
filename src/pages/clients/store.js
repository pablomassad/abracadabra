import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'src/boot/firebase'

const state = reactive({
    clients: undefined
})
const actions = {
    setClients (data) {
        console.log('store setClients:', data)
        state.clients = data
    },
    async getClients () {
        console.log('store getClients')
        ui.actions.showLoading()
        const res = await fb.getCollection('clients')
        actions.setClients(res)
        ui.actions.hideLoading()
    }
}

export default {
    state: readonly(state),
    actions
}
