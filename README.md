![./image/icon.png](./image/icon.png)

# Signature

这是一个简单的画布，但它的名字叫签名
> ps: 这很奇怪，我也不知道为什么叫这个，可能当时我在写一个签名板吧

## 功能

> 添加历史功能让它可以 `撤销/重做`  
> 绑定快捷键让它更加的好用 `ps: 我很确定!!!`  

## 日志

> 2023-2-26 MP  
> 计划重构版本为 `2.0`，它看起来比较简单

### options

#### CreateCanvasOptions

> `size` - `number` 笔画的大小  
> `delay` - `number` 鼠标移动数据的节流  
> `color` - `string` 笔画的颜色  
> `soften` - `number` 软化 - 径向透明度  
> `maxStack` - `number` 最大栈 - 重做/撤销  
> `optimize` - `number` 曲线优化  
> `distance` - `number` 两个点的距离超过才记录  
> ps: `delay` 将会影响到 `distance` 如果节流时间过程，可能会忽略掉很多坐标点的记录.