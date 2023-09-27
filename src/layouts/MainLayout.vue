<template>
    <q-layout view="hHh Lpr lff">
        <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-orange'">
            <q-toolbar>
                <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
                <q-toolbar-title>{{ ui.state.title }}</q-toolbar-title>
                <div>
                    <span>
                        Version: 1
                    </span>
                    <q-avatar style="cursor: pointer;" color="teal" class="q-ml-sm" @click="(dialog = !dialog)">
                        PM
                    </q-avatar>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="drawerLeft" style="color: #666" :width="250" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'" :breakpoint="500">
            <q-list style="padding-top:70px">
                <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view v-slot="{Component}">
                <!--<transition :enter-active-class="route.meta.enterClass" :leave-active-class="route.meta.leaveClass">-->
                <component :is="Component" />
                <!--</transition>-->
            </router-view>
        </q-page-container>
    </q-layout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ui } from 'fwk-q-ui'
import EssentialLink from 'src/components/EssentialLink.vue'

const drawerLeft = ref(false)

const linksList = ref([
    {
        title: 'Clientes',
        caption: 'Alta, edición y baja',
        icon: 'group',
        link: '/clients'
    },
    {
        title: 'Ventas diarias',
        caption: 'Resumen diario de ventas',
        icon: 'move_to_inbox',
        link: '/sales'
    },
    {
        title: 'Cuentas Corrientes',
        caption: 'Estado de cuentas',
        icon: 'manage_accounts',
        link: '/accounts'
    },
    {
        title: 'Resumenes de cuenta',
        caption: 'Lista de actividad',
        icon: 'work',
        link: '/summary'
    },
    {
        title: 'Reportes',
        caption: 'Graficos estadísticos',
        icon: 'bar_chart',
        link: '/reports'
    },
    {
        title: 'Stock',
        caption: 'Administracion de stock',
        icon: 'bar_chart',
        link: '/stock'
    },
    {
        title: 'Mercaderia',
        caption: 'Administracion de códigos',
        icon: 'assignment',
        link: '/products'
    },
    {
        title: 'Proveedores',
        caption: 'Gestion de proveedores',
        icon: 'align_horizontal_left',
        link: '/providers'
    },
    {
        title: 'Opciones',
        caption: 'Configuracion de alertas',
        icon: 'alert',
        link: '/settings'
    },
    {
        title: 'Descargar App',
        caption: 'Bajar aplicación',
        icon: 'download',
        link: '/download'
    }
])

onMounted(() => {
    ui.actions.setTitle('Abracadabra')
})
const toggleLeftDrawer = () => {
    drawerLeft.value = !drawerLeft.value
}
</script>

<style scoped>
.contentx {
    height: calc(100vh - 50px);
    position: relative;
    overflow: auto;
    /*border:4px solid black;
  background:lightgoldenrodyellow;*/
}

.cardFrame {
    text-align: center;
    background: lightblue;
}

.title {
    color: rgb(255, 255, 255);
    justify-content: center;
    font-size: 35px;
    text-shadow: 1px 1px 1px black;
    font-weight: bold;
    align-content: center;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease-out;
}
</style>
