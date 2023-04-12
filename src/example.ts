import { Keyboard } from './lib/Keyboard';
import { CreateCanvas } from './index';
import { limitToRange } from './utils';

const $ = (element: string) => document.querySelector(element) as HTMLInputElement;

// 绑定快捷键
const keyboard = new Keyboard(window.document as unknown as HTMLElement);

// 初始化画布
const canvas = new CreateCanvas('.app-canvas', { delay: 10, ratio: 2 });

// 快捷键 - 撤销
keyboard.bind('ControlLeft+KeyZ', () => canvas.undo());

// 快捷键 - 重做
keyboard.bind('ControlLeft+ShiftLeft+KeyZ', () => canvas.redo());

function handleValue(func: (value: string, target: HTMLInputElement) => void) {
  return function (e: any) {
    func(e.target.value, e.target);
  };
}

$('#color').onchange = handleValue((color, target) => {
  canvas.color = color || '#000000';
  target.value = canvas.color;
});

$('#size').onchange = handleValue((value, target) => {
  canvas.size = limitToRange(parseInt(value), 1, 1000);
  target.value = canvas.size.toString();
});

$('#soften').onchange = handleValue((value, target) => {
  const soften = limitToRange(parseInt(value), 1, 100);
  target.value = soften.toString();
  canvas.soften = soften * 0.01;
});

$('#optimize').onchange = handleValue((value, target) => {
  const optimize = limitToRange(parseInt(value), 1, 9);
  target.value = optimize.toString();
  canvas.optimize = optimize * 0.1;
});

window.addEventListener('load', function () {
  const { color, size, soften, optimize } = canvas;
  $('#color').value = color;
  $('#size').value = size.toString();
  $('#soften').value = (soften * 100).toString();
  $('#optimize').value = (optimize * 10).toString();
});

/***
 * 曲线优化
 * 贝塞尔提供3个坐标点才可以进行曲线计算
 * 前面两个坐标点如果在画布上显示用户体验将会扣分
 * 假设用户鼠标移动产生了3个点，我们通过一次贝塞尔计算优化值参与与曲线生成
 * p0 -> p1 = (p0p1) * t = [a0, p1],
 * 当我们得到第3个坐标时，同样计算出 a0 （同上面），
 * p1 -> p2 = (p1p2) * t = [a1, p2]
 * 这时我们拥有4个坐标，这时就可以去生成曲线了 [a0, p1, a1]，依次循环，这就是曲线优化
 */
