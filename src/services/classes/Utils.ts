import validator from "validator";

export function getOffset(el: HTMLElement | null) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent as HTMLElement | null;
    }
    return { top: _y, left: _x };
}

// export function moveElement(fromPosition: number, toPosition: number, fromList: Record<string, unknown>[]): void;
// export function moveElement(fromPosition: number, toPosition: number, fromList: Record<string, unknown>[], toList?: Record<string, unknown>[]): void {
//     const removed: Record<string, unknown> = fromList.splice(fromPosition, 1)[0];
//     if (removed && toList) toList.splice(toPosition, 0, removed);
// }

// export function reorderDevices(list: Record<string, unknown>[], fromPosition: number, toPosition: number) {
//     if (Number.isNaN(toPosition) || Number.isNaN(fromPosition)) return;

//     const removed = list.splice(fromPosition, 1)[0];
//     // if (list === "store") {
//     // console.log({ ...removed }, list, dropResult);
//     let newCategory = removed.category;
//     // console.log(newCategory);
//     if (dropResult.addedIndex === 0 && realList.length - 1 > dropResult.addedIndex) {
//         newCategory = realList[dropResult.addedIndex + 1].category;
//     } else if (dropResult.addedIndex > 0) {
//         newCategory = realList[dropResult.addedIndex - 1].category;
//     }

//     removed.category = newCategory;
//     // }

//     realList.splice(dropResult.addedIndex, 0, removed);
// }

export class StringUtils {
    public static ucFirst(str: string): string {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    }
}

export class Validators {
    public static isColor(str: string | undefined) {
        return str === undefined || str === "transparent" || validator.isHexColor(str);
    }

    public static isUnsignedInt(num: number, min?: number, max?: number) {
        return validator.isInt(num + "", { min: min || 0, max });
    }
}

export class ObjectUtils {
    public static clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}
