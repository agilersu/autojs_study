
auto();
toastLog("开始执行控件点击函数");

clickBy("text", "领现金", { name: "匹配领现按钮", retry: 3 });
sleep(1500);
back();
clickBy("text", "短剧2", { name: "匹配短剧按钮", retry: 3 });
sleep(1500);
back();
toastLog("完成控件点击函数");
/** 
//   按 textMatches 正则匹配点击
clickBy("textMatches", /登录$/, { name: "匹配登录按钮", retry: 3 });

// 按 descContains 字符串包含匹配
clickBy("descContains", "未点赞", {
    verify: function () {
        return !descContains("未点赞").exists();
    }
});

// 查看类名以某个前缀开头的
clickBy("classNameStartsWith", "android.widget.Button", {
    name: "按钮",
    verify: function () {
        // 校验逻辑
    }
});
     
*/
/* 
设计思路与解读：
动态选择器：

利用 eval() 动态调用选择器函数。注意：使用 eval() 需要确保传入的 selectorType 是合法且可信的选择器，因为它执行的是字符串表达式。
增加灵活性：

任何 Auto.js 的选择器都可以用 "选择器函数名" 作为 selectorType 传入。
函数的调用更灵活，适应多种情况。
处理异常情况：

增加点击区域合法性检测，保证随机坐标在合法范围内（避开边框）。
集成重试机制和校验逻辑，提升点击模拟的稳定性和可靠性。
继续增强随机性：

随机化了点击区域、按压时间、动作间隔等参数，尽量模拟真实用户行为。

*/

/**
 * 通用点击模块（Auto.js 4.1）
 * 示例用法：
 *   clickBy("textMatches", /登录$/, { name: "匹配登录按钮", retry: 3 });
 *   clickBy("descContains", "点赞", { verify: function () { return !descContains("点赞").exists(); } });
 *   clickBy("classNameStartsWith", "android.widget.Button", { name: "按钮" });



*/

/**
 * 通用点击入口
 * @param {String} selectorType 选择器类型：textMatches / descContains / classNameStartsWith 等
 * @param {Any}    selectorArg 选择器参数
 * @param {Object} opts        配置项（可选）
 * @returns {Boolean}          是否点击成功
 */
function clickBy(selectorType, selectorArg, opts) {
    opts = opts || {};

    // 名字用于日志，如未传则默认用 selectorArg
    var name = opts.name || selectorArg.toString();

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
        // 等待控件出现
        var obj = waitForWidget(selectorType, selectorArg, timeoutMs, restrictToScreen);
        if (!obj) {
            toastLog("第 " + attempt + " 次未找到控件 [" + name + "]");
            if (attempt < retry) {
                sleep(random(400, 800)); // 下一次尝试前稍等
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

        // 校验逻辑处理
        if (!verifyOpt) {
            return true;
        }

        if (typeof verifyOpt === "function") {
            var passed = false;
            try {
                passed = !!verifyOpt();
            } catch (e) {
                log("[" + name + "] 自定义校验函数异常: " + e);
            }
            if (passed) {
                return true;
            } else {
                log("[" + name + "] 自定义校验未通过，准备重试");
                continue;
            }
        }

        var stillExists = eval(selectorType)(selectorArg).visibleToUser().exists();
        if (!stillExists) {
            return true;
        } else {
            log("[" + name + "] 点击后控件仍存在，准备重试");
        }
    }

    return false;
}

/**
 * 等待某个控件出现并返回
 * @param {String} selectorType    text / id / desc / descContains / className 等
 * @param {Any}    selectorArg
 * @param {Number} timeoutMs       最长等待时长（毫秒）
 * @param {Boolean} restrictToScreen 是否限制在屏幕区域内
 * @returns {UiObject|null}
 */
function waitForWidget(selectorType, selectorArg, timeoutMs, restrictToScreen) {
    timeoutMs = timeoutMs || 0;
    var start = new Date().getTime();

    while (true) {
        var selector = eval(selectorType)(selectorArg).visibleToUser();

        if (restrictToScreen) {
            selector = selector.boundsInside(0, 0, device.width, device.height);
        }

        var obj = selector.findOnce();
        if (obj) {
            return obj;
        }

        if (timeoutMs <= 0) {
            return null;
        }

        if (new Date().getTime() - start > timeoutMs) {
            return null;
        }

        sleep(200);
    }
}