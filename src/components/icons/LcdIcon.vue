<script setup lang="ts">
defineProps<{
    invert: boolean;
}>();
</script>

<template>
    <div class="flex flex-col items-center p-1">
        <div class="flex items-center flex-row justify-center border-3d px-1" :class="invert ? 'invert bg-white' : 'bg-black'">
            <div class="w-4">
                <div class="font-digital select-none cursor-default pointer-events-none bg-black/0 text-off/40 text-center" :class="{ invert: invert }">88</div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
