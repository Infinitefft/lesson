# 布局

BFC 对于两列式、三列式 起到了关键性支持，先介绍下
Block Formating Context 块级格式化上下文  是css中独立（不受外界影响）的布局区域
核心规则分为`创建规则`、`布局规则`、`交互规则`

- 创建的规则
    - html 就是最大的BFC元素
        - 块级元素从上到下布局
    - 浮动
        float: left/right (none不算)
    - 绝对、固定、粘性定位
        position absolute/fixed/sticky
    - 行内块
        display: inline-block
    - 表格相关
        table 用的很少
        display: table-cell/table-caption
    - 溢出非可见 BFC 用的最多
        overflow: hidden/auto/scroll
        而 overflow: visible 不触发BFC
    - 弹性/网格 flex/inline-flex/grid/inline-grid

### BFC 内部的布局规则
- 垂直排列
    - BFC 内部块级盒子从上到下依次垂直排列
    - 边距折叠 相邻块级盒子的垂直margin会折叠，取最大值，非相加
    - 触边对齐
        每个盒子左外边缘紧贴BFC 容器左边缘，即使有浮动元素在
    - 独立计算
        BFC是独立渲染的区域，不受外界影响

### BFC与外部交互的规则
- 包含内部浮动，BFC 会包裹所有内部浮动元素（解决父元素高度塌陷问题）
- 排除外部浮动，BFC 区域不与外部浮动元素重叠


### 两列式布局
- float + overflow



###
方法一，圣杯布局
父容器留白，中间栏占满宽度，左右栏通过负边距和相对定位，嵌入父容器的留白区域
main先输出 更快看到主要内容
带来布局的难度，把aside 拽到main 的左边去
- 三个元素float: left
- margin-left: -100% 逆流而上
- 相对定位

方法二：双飞翼布局
给中间栏套个内容容器并设左右外边距