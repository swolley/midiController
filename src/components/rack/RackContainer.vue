<script lang="ts" setup></script>

<template>
    <div class="rack relative flex flex-col">
        <div class="rack-side left"></div>
        <div class="rack-side right"></div>
        <!-- preamps -->
        <div class="rack-devices grow overflow-y-scroll">
            <slot></slot>
        </div>
        <!-- footer -->
        <div class="relative z-10">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.rack {
    margin: -6px 0px 0px 3px;
    height: calc(100% + 12px);

    .rack-side {
        @apply absolute h-full top-0 bottom-0 z-0;
        width: 50px;
        background-repeat: repeat-y;

        &.left {
            @apply left-0;
            background-image: url(/interno_sx.gif);
        }
        &.right {
            @apply right-0;
            background-image: url(/interno_dx.gif);
        }
    }

    .rack-devices {
        @apply z-10 relative;
        // height: calc(100% - 110px);
        overflow-y: scroll;
    }
    // .rack .rack-devices:has(+ .preamp-display:not(.full)) {
    //     height: calc(100% - 66px);
    // }
}
</style>
