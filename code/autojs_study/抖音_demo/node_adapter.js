// 简单的 Node 适配器，用于在桌面 Node 环境中模拟 Auto.js 常用 API
// 仅用于调试/演示，不会执行真实的设备交互
module.exports.install = function(target){
    target.auto = function(){
        console.log('[auto] 初始化模拟环境');
    };

    target.setScreenMetrics = function(w,h){
        console.log('[setScreenMetrics]', w, h);
    };

    target.launchApp = function(name){
        console.log('[launchApp]', name);
    };

    target.swipe = function(x1,y1,x2,y2,duration){
        console.log(`[swipe] ${x1},${y1} -> ${x2},${y2} dur ${duration}`);
    };

    target.click = function(x,y){
        if (typeof x === 'number' && typeof y === 'number')
            console.log('[click]', x, y);
        else
            console.log('[click]', x);
    };

    target.back = function(){
        console.log('[back]');
    };

    target.random = function(){
        return Math.random();
    };

    // 提供阻塞式 sleep（基于 Atomics，Node 环境可用）
    target.sleep = function(ms){
        if (ms <= 0) return;
        const sab = new SharedArrayBuffer(4);
        const ia = new Int32Array(sab);
        Atomics.wait(ia, 0, 0, ms);
    };

    // 简化的 id(selector) 模拟，返回带有 findOne().click() 和 setText() 的对象
    target.id = function(selector){
        return {
            findOne: function(){
                return {
                    click: function(){ console.log('[id click]', selector); },
                    setText: function(t){ console.log('[id setText]', selector, '->', t); }
                };
            }
        };
    };
};
