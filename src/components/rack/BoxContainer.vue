<script lang="ts" setup></script>

<template>
    <div class="h-full table">
        <div class="table-row">
            <div class="hidden md:table-cell cell lt"></div>
            <div class="table-cell cell ct">
                <slot name="header"></slot>
            </div>
            <div class="hidden md:table-cell cell rt"></div>
        </div>

        <div class="table-row">
            <div class="hidden md:table-cell cell lc"></div>
            <div class="table-cell cell cc">
                <slot></slot>
            </div>
            <div class="hidden md:table-cell cell rc"></div>
        </div>

        <div class="table-row">
            <div class="hidden md:table-cell cell lb"></div>
            <div class="table-cell cell cb">
                <slot name="body"></slot>
            </div>
            <div class="hidden md:table-cell cell rb"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.table-row {
    &:first-child,
    &:last-child {
        .cell {
            height: 61px;
        }
    }

    &:nth-child(2) {
        .cell:first-child,
        .cell:last-child {
            background-repeat: repeat-y;
        }
    }

    .cell {
        &:first-child,
        &:last-child {
            background-repeat: no-repeat;
            width: 53px;
        }

        &:nth-child(2) {
            background-repeat: repeat-x;
        }

        &.lt {
            background-image: url(/box-top-left.jpg);
        }
        &.ct {
            background-image: url(/box-top-center.jpg);
        }
        &.rt {
            background-image: url(/box-top-right.jpg);
        }
        &.lc {
            background-image: url(/box-center-left.jpg);
        }
        &.rc {
            background-image: url(/box-center-right.jpg);
        }
        &.lb {
            background-image: url(/box-bottom-left.jpg);
        }
        &.cb {
            background-image: url(/box-bottom-center.jpg);
            background-position-y: bottom;
        }
        &.rb {
            background-image: url(/box-bottom-right.jpg);
        }
    }
}
</style>
