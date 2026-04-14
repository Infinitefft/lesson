// 基础解法
function fn1(x) {
    if (x === 0) {
        return 1;
    }
    if (x === 1) {
        return 0;
    }
}
// 三元运算符
const fn2 = x => x === 0 ? 1 : 0;

// 数组映射
const fn3 = x => [1, 0][x];

// 异或 位运算符
const fn4 = x => x ^ 1;

// map
