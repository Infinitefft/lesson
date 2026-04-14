// 自定义 Pick
// 泛型
// T 原有的类型，参数
// extends 不是继承，受限于，必须是T的子集
// K 'name' | 'age'
// keyof: 获取一个“对象类型”的所有键（Key），并将它们合并成一个联合类型。
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];   // 遍历k
}