<script setup lang="ts">
import { ref } from "vue";
import LightLed from "./LightLed.vue";
import ControllerLabel from "./ControllerLabel.vue";

const emit = defineEmits(["changevalue"]);
defineProps<{ label?: string; invert?: boolean }>();
const active = ref<boolean>(false);

function changeValue() {
    active.value = !active.value;
    emit("changevalue", active.value);
}
</script>

<template>
    <div class="btn flex-col cursor-pointer" :title="label" @click="changeValue">
        <LightLed class="cursor-pointer" :status="active ? 'on' : 'off'" />
        <ControllerLabel v-if="label" :label="label" :invert="invert" />
    </div>
</template>

<style scoped land="scss"></style>
