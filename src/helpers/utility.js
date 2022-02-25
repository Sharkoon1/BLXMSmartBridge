"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumberToFloat = exports.compareUpTo = void 0;
function compareUpTo(a, b, decimals) {
    return a.toFixed(decimals) === b.toFixed(decimals);
}
exports.compareUpTo = compareUpTo;
function bigNumberToFloat(bigNumber) {
    return Number.parseFloat(bigNumber.toString());
}
exports.bigNumberToFloat = bigNumberToFloat;
//# sourceMappingURL=utility.js.map