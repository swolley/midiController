<script setup lang="ts">
import CustomDialog, { type IDialogButton } from "./CustomDialog.vue";
import { ref } from "vue";

const props = defineProps<{
    message: string;
    yesCallback: CallableFunction;
    noCallback: CallableFunction;
    cancelCallback?: CallableFunction;
}>();

const buttonsList = ref<IDialogButton[]>([
    { label: "No", callback: props.noCallback, class: "btn-secondary" },
    { label: "Yes", callback: props.yesCallback, class: "btn-primary" },
]);
</script>

<template>
    <CustomDialog :message="message" :buttons="buttonsList" @close="$emit('close')" :close="cancelCallback" />
</template>

<script></script>
