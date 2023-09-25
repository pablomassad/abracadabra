import { reactive, readonly } from 'vue'
import { ui } from 'fwk-q-ui'
import fb from 'src/boot/firebase'
import moment from 'moment'

const state = reactive({
    salesToday: undefined
})
const actions = {
    setSalesToday (data) {
        console.log('store setSalesToday:', data)
        state.salesToday = data
    },
    async getSalesByDate (sortField, dir) {
        console.log('store getSalesByDate')
        ui.actions.showLoading()
        // const ops = {
        //    field: 'datetime',
        //    op: '>',
        //    val: new Date().getTime(),
        //    sortField,
        //    dir
        // }
        const ops = {
            sortField,
            dir
        }
        const res = await fb.getCollectionFlex('movements', ops)
        actions.setSalesToday(res)
        ui.actions.hideLoading()
    }
}

export default {
    state: readonly(state),
    actions
}
