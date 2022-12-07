<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition mode="out-in">
                <KeepAlive>
                    <Suspense>
                        <!-- main content -->
                        <component :is="Component"></component>

                        <!-- loading state -->
                        <template #fallback>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Loading...</div>
                        </template>
                    </Suspense>
                </KeepAlive>
            </Transition>
        </template>
    </RouterView>
</template>

<style lang="scss"></style>
