<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition mode="out-in">
                <!-- main content -->
                <component :is="Component"></component>
            </Transition>
        </template>
    </RouterView>
</template>

<style lang="scss"></style>
