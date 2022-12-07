<script setup lang="ts">
import CustomDialog from "./CustomDialog.vue";
defineEmits(["close"]);

defineProps<{
    message: string;
    yesCallback?: CallableFunction;
}>();
</script>

<template>
    <CustomDialog :message="message" :buttons="[{ label: 'Ok', callback: () => {}, class: 'btn-primary' }]" @close="$emit('close')" />
</template>

<script></script>
