<template>
    <div>
        <q-input v-model="criteria" :label="texto" class="filterText" clearable dense color="black" bg-color="white" filled @change="onChange">
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const criteria = ref()

const emit = defineEmits(['change'])
const props = defineProps({
    texto: {
        type: String
    }
})

const onChange = (evt) => {
    emit('change', evt)
}

</script>

<style scoped>
.filterText {
    margin: 8px;
}
</style>
