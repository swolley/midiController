<script setup lang="ts">
import type { LedStatus } from "@/services/types/devices";

defineProps<{ status: LedStatus }>();
</script>

<template>
    <div class="rounded-full w-3 h-3 aspect-square mx-auto border-3d" :class="'bg-' + status"></div>
</template>

<style scoped land="scss"></style>
