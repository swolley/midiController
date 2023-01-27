<script setup lang="ts">
import type { RotaryStyle } from "@/services/types/devices";

defineProps<{
    potStyle?: RotaryStyle;
}>();
</script>

<template>
    <div class="mini-rotary" :class="potStyle || 'dark'">
        <div class="switch"></div>
    </div>
</template>

<style scoped lang="scss">
.mini-rotary {
    width: 20px;
    height: 20px;
    background-size: 20px;
    background-repeat: no-repeat;
    &.dark {
        background-image: url(/darkBackground.png);
        .switch {
            background-image: url(/darkFront.png);
        }
    }
    &.light {
        background-image: url(/lightBackground.png);
        .switch {
            background-image: url(/lightFront.png);
        }
    }
    &.metal {
        background-image: url(/metalBackground.png);
        .switch {
            background-image: url(/metalFront.png);
        }
    }

    .switch {
        @apply w-full h-full;
        background-size: 20px;
        background-repeat: no-repeat;
    }
}
</style>
