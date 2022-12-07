<script setup lang="ts">
defineProps<{ show: boolean }>();
</script>
<template>
    <Transition name="modal">
        <div v-if="show" class="modal-mask">
            <div class="modal-wrapper backdrop-blur-sm" @click="$emit('close')">
                <div
                    class="mx-auto p-4 bg-black/75 border-2 border-white/5 rounded shadow-lg transition-all overflow-hidden max-h-screen w-full md:max-w-7xl"
                    @click.stop
                >
                    <div class="modal-header">
                        <slot name="header"></slot>
                    </div>

                    <div class="modal-body my-4 overflow-y-auto pr-1">
                        <slot name="body"></slot>
                    </div>

                    <div class="modal-footer flex items-center justify-center mx-auto">
                        <slot name="footer">
                            <button
                                class="rounded border border-white/10 w-full p-2 shadow bg-white/10 hover:bg-white/20 text-white transition-colors"
                                @click="$emit('close')"
                            >
                                Ok
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

/* Transition */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.modal-leave-to .modal-container {
    -webkit-transform: scale(0.1);
    transform: scale(0.1);
}

.modal-body.overflow-y-auto {
    max-height: calc(100vh - 300px);
}
</style>
