<script setup lang="ts">
defineProps<{
    label: string;
    invert?: boolean;
}>();
</script>

<template>
    <label class="controller-label transition-opacity text-center" :class="{ invert: invert }">{{ label }}</label>
</template>

<style scoped></style>
