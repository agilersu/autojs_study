auto();
toastLog("开始执行控件点击函数");

clickByChain([
    ["text", "我的"],
    ["className", "android.widget.RadioButton"]
],

{name: "匹配我的按钮", retry: 2, timeoutMs: 6000}

);
sleep(1500);


clickByChain([
    ["text", "领现金"],
 
],
    { name: "匹配领现金按钮", retry: 2, timeoutMs: 6000 }
);
sleep(1500);


clickByChain([
    ["text", "短剧"],
], {
    name: "匹配短剧按钮", retry: 2, 
    verify: function () {
        return !descContains("短剧").exists();
    }
});




sleep(1500);
back();

toastLog("完成控件点击函数");



/**
 * 链式查找 + 人类点击
 * 
 使用举例 
clickByChain([
    ["id", "abc"],
    ["textStartsWith", "abc"]
], { name: "id=abc & textStartsWith=abc", retry: 2, timeoutMs: 6000 });

 * 
 * 
 * @param {Array} steps
 * @param {Object} opts
 * @returns {Boolean}
 */
function clickByChain(steps, opts) {
    opts = opts || {};
    var name = opts.name || JSON.stringify(steps);

    var timeoutMs = opts.timeoutMs || 5000;
    var retry = opts.retry || 1;
    var postSleepMin = opts.postSleepMin || 600;
    var postSleepMax = opts.postSleepMax || 1200;
    var preSleepMin = opts.preSleepMin || 80;
    var preSleepMax = opts.preSleepMax || 220;
    var pressMin = opts.pressMin || 60;
    var pressMax = opts.pressMax || 200;
    var borderOffset = (typeof opts.borderOffset === "number") ? opts.borderOffset : 1;
    var restrictToScreen = (opts.restrictToScreen !== false);
    var verifyOpt = opts.verify;

    for (var attempt = 1; attempt <= retry; attempt++) {
        var obj = waitForWidgetChain(steps, timeoutMs, restrictToScreen);
        if (!obj) {
            toastLog("第 " + attempt + " 次未找到控件 [" + name + "]");
            if (attempt < retry) {
                sleep(random(400, 800));
                continue;
            }
            return false;
        }

        var b = obj.bounds();
        var x = random(Math.floor(b.left + borderOffset), Math.floor(b.right - borderOffset));
        var y = random(Math.floor(b.top + borderOffset), Math.floor(b.bottom - borderOffset));

        if (x <= b.left || x >= b.right || y <= b.top || y >= b.bottom) {
            log("[" + name + "] bounds 异常: " + JSON.stringify(b));
            return false;
        }

        var duration = random(pressMin, pressMax);
        toastLog("点击 [" + name + "] 第 " + attempt + " 次, 坐标(" + x + "," + y + "), 按压 " + duration + "ms");

        sleep(random(preSleepMin, preSleepMax));
        press(x, y, duration);
        sleep(random(postSleepMin, postSleepMax));

        // 校验逻辑
        if (!verifyOpt) return true;

        if (typeof verifyOpt === "function") {
            var passed = false;
            try {
                passed = !!verifyOpt();
            } catch (e) {
                log("[" + name + "] 自定义校验函数异常: " + e);
            }
            if (passed) return true;

            log("[" + name + "] 自定义校验未通过，准备重试");
            continue;
        }

        // 默认校验：点击后控件是否还存在（同样用 steps 重新查）
        var stillExists = false;
        try {
            stillExists = buildSelector(steps, restrictToScreen).exists();
        } catch (e) {
            log("[" + name + "] 校验构建 selector 异常: " + e);
            stillExists = false; // 构建失败通常当作不存在
        }

        if (!stillExists) return true;
        log("[" + name + "] 点击后控件仍存在，准备重试");
    }

    return false;
}

/**
 * 根据 steps 构建链式 selector
 * steps 示例：
 * [
 *   ["id", "abc"],
 *   ["textStartsWith", "abc"],
 *   ["descContains", "xxx"],
 * ]
 *
 * @param {Array} steps
 * @param {Boolean} restrictToScreen
 * @returns {UiSelector}
 */
function buildSelector(steps, restrictToScreen) {
    if (!steps || !steps.length) {
        throw new Error("steps 不能为空");
    }

    // 第一步必须是选择器“入口函数”，如 id/text/desc/className/textMatches...
    var first = steps[0];
    var sel = eval(first[0]).apply(null, first.slice(1));

    // 后续步骤是对 selector 的链式调用
    for (var i = 1; i < steps.length; i++) {
        var step = steps[i];
        var fn = step[0];
        var args = step.slice(1);

        if (typeof sel[fn] !== "function") {
            throw new Error("selector 不支持方法: " + fn);
        }
        sel = sel[fn].apply(sel, args);
    }

    // 统一加 visibleToUser
    sel = sel.visibleToUser();

    if (restrictToScreen) {
        sel = sel.boundsInside(0, 0, device.width, device.height);
    }

    return sel;
}/**
 * 等待链式条件控件出现并返回
 * @param {Array} steps
 * @param {Number} timeoutMs
 * @param {Boolean} restrictToScreen
 * @returns {UiObject|null}
 */
function waitForWidgetChain(steps, timeoutMs, restrictToScreen) {
    timeoutMs = timeoutMs || 0;
    var start = new Date().getTime();

    while (true) {
        var selector;
        try {
            selector = buildSelector(steps, restrictToScreen);
        } catch (e) {
            log("构建 selector 失败: " + e);
            return null;
        }

        var obj = selector.findOnce();
        if (obj) return obj;

        if (timeoutMs <= 0) return null;
        if (new Date().getTime() - start > timeoutMs) return null;

        sleep(200);
    }
}