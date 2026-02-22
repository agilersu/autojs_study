auto();
toastLog("开始执行控件点击函数");

for (var i = 0; i < 5; i++) {
    clickBy(
        () => descStartsWith("领取成功").child(0),
        {
            name: "领取成功 按钮",
            retry: 4,
            timeoutMs: 6000 + random(15, 5000)
        }
    );




    sleep(3000 + random(0, 2000));



    clickBy(
        () => descStartsWith("领取奖励"),

        { name: "领取奖励 按钮", retry: 4, timeoutMs: 6000 + random(0, 3000) }

    );

    sleep(45000 + random(0, 15000));

}


sleep(1500 + random(15, 6000));
back();

toastLog("完成控件点击函数");


/*
**使用说明与示例

你提到的多条件链式查询
示例：id("abc").textStartsWith("abc").descContains("确定")
clickBy(
    () => id("abc").textStartsWith("abc").descContains("确定"),
    {
        name: "复杂条件按钮",
        retry: 3,
        timeoutMs: 6000
    }
);


带“点击后校验”的用法
使用自定义校验函数
比如：点击“登录”按钮后，需要判断页面上是否出现“个人中心”字样：

clickBy(
    () => text("登录"),
    {
        name: "登录按钮",
        retry: 3,
        verify: function () {
            // 点击之后，检查“个人中心”是否出现
            return textContains("个人中心").exists();
        }
    }
);
脚本逻辑：
找到“登录”按钮，随机坐标点击；
调用 verify 函数，如果返回 true，认为成功；
如果返回 false，继续重试（再找按钮再点），直到超过 retry 次数。
4.2 使用默认校验：点击后控件消失
如果你传 verify: true 或 verify: 1 这种“非函数”的值（常量），会走内置校验逻辑：
“点击后再次检查同一个 selector 是否还存在；不存在则认为成功”。

例：

clickBy(
    () => text("关闭").id("close_btn"),
    {
        name: "关闭弹窗按钮",
        retry: 3,
        verify: true // 使用默认校验 —— 点击后按钮消失
    }
);
注意：严格来说 verify 在上面的实现中，只是用“非函数”的任何值来触发默认校验逻辑；你也可以改成 verifyDefault 之类更明晰的字段，有需求可以再改。
*/




/**
 * 通用点击入口（“原生写法”版）
 *
 * 用法示例：
 * clickBy(
 *   () => id("abc").textStartsWith("abc"),
 *   { name: "示例按钮" }
 * );
 *
 * @param {Function} builderFn  返回 UiSelector 的函数
 * @param {Object}   opts       配置项（可选）
 * @returns {Boolean}           是否点击成功
 */
function clickBy(builderFn, opts) {
    opts = opts || {};

    // 名字用于日志，可选：如果没传，就用 builderFn.toString() 的前几行
    var name = opts.name || (function () {
        var s = builderFn.toString().replace(/\s+/g, " ");
        if (s.length > 80) {
            s = s.slice(0, 77) + "...";
        }
        return s;
    })();

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
        var obj = waitForWidgetFn(builderFn, timeoutMs, restrictToScreen);
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
            // 没有校验要求，点击一次就认为成功
            return true;
        }

        // 1. 自定义函数校验
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

        // 2. 内置简单校验：点击后该控件是否还存在（用同一个 builderFn 再查）
        var stillExists = false;
        try {
            stillExists = buildSelectorFromFn(builderFn, restrictToScreen).exists();
        } catch (e) {
            log("[" + name + "] 校验时构建 selector 异常: " + e);
            stillExists = false; // 出异常时当作不存在
        }

        if (!stillExists) {
            return true;
        } else {
            log("[" + name + "] 点击后控件仍存在，准备重试");
        }
    }

    return false;
}


/**
 * 构建 selector（从 builder 函数中获得）
 * @param {Function} builderFn 例如： () => id("abc").textStartsWith("abc")
 * @param {Boolean} restrictToScreen 是否限制在屏幕范围内
 * @returns {UiSelector}
 */
function buildSelectorFromFn(builderFn, restrictToScreen) {
    if (typeof builderFn !== "function") {
        throw new Error("builderFn 必须是函数，例如: () => id(\"abc\").textStartsWith(\"abc\")");
    }

    var sel;
    try {
        sel = builderFn();
    } catch (e) {
        throw new Error("执行 builderFn 出错: " + e);
    }

    if (!sel || typeof sel.visibleToUser !== "function") {
        throw new Error("builderFn 必须返回 UiSelector，例如：return id(\"abc\")...");
    }

    sel = sel.visibleToUser();

    if (restrictToScreen) {
        sel = sel.boundsInside(0, 0, device.width, device.height);
    }

    return sel;
}

/**
 * 等待某个控件出现并返回 —— 使用 builderFn 构造 selector
 * @param {Function} builderFn  返回 UiSelector 的函数
 * @param {Number} timeoutMs   最长等待时长（毫秒）
 * @param {Boolean} restrictToScreen 是否限制在屏幕区域内
 * @returns {UiObject|null}
 */
function waitForWidgetFn(builderFn, timeoutMs, restrictToScreen) {
    timeoutMs = timeoutMs || 0;
    var start = new Date().getTime();

    while (true) {
        var selector;
        try {
            selector = buildSelectorFromFn(builderFn, restrictToScreen);
        } catch (e) {
            log("构建 selector 失败: " + e);
            return null;
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



/*
****使用说明与示例


1. 最基础用法：单条件
// 点击 text 为“登录”的控件
clickBy(
    () => text("登录"),
    {
        name: "登录按钮",
        timeoutMs: 8000, // 最多等 8 秒
        retry: 2         // 最多点击尝试 2 次
    }
);
2. 你提到的多条件链式查询
示例：id("abc").textStartsWith("abc")
clickBy(
    () => id("abc").textStartsWith("abc"),
    {
        name: "id=abc 且 text 以 abc 开头的控件"
    }
);
示例：id("abc").textStartsWith("abc").descContains("确定")
clickBy(
    () => id("abc").textStartsWith("abc").descContains("确定"),
    {
        name: "复杂条件按钮",
        retry: 3,
        timeoutMs: 6000
    }
);
3. 配合正则匹配 textMatches
clickBy(
    () => textMatches(/登录|Sign in/).className("android.widget.Button"),
    {
        name: "登录按钮（多语言）"
    }
);
Auto.js 4 可以直接写 /登录|Sign in/ 这种正则对象。

4. 带“点击后校验”的用法
4.1 使用自定义校验函数
比如：点击“登录”按钮后，需要判断页面上是否出现“个人中心”字样：

clickBy(
    () => text("登录"),
    {
        name: "登录按钮",
        retry: 3,
        verify: function () {
            // 点击之后，检查“个人中心”是否出现
            return textContains("个人中心").exists();
        }
    }
);
脚本逻辑：

找到“登录”按钮，随机坐标点击；
调用 verify 函数，如果返回 true，认为成功；
如果返回 false，继续重试（再找按钮再点），直到超过 retry 次数。
4.2 使用默认校验：点击后控件消失
如果你传 verify: true 或 verify: 1 这种“非函数”的值（常量），会走内置校验逻辑：
“点击后再次检查同一个 selector 是否还存在；不存在则认为成功”。

例：

clickBy(
    () => text("关闭").id("close_btn"),
    {
        name: "关闭弹窗按钮",
        retry: 3,
        verify: true // 使用默认校验 —— 点击后按钮消失
    }
);
注意：严格来说 verify 在上面的实现中，只是用“非函数”的任何值来触发默认校验逻辑；你也可以改成 verifyDefault 之类更明晰的字段，有需求可以再改。

5. 调整“人类行为”的配置项
在 opts 中都可以覆盖默认值：

clickBy(
    () => id("btn_ok"),
    {
        name: "确认按钮",
        timeoutMs: 10000,      // 等待 10 秒
        retry: 3,              // 最多重试 3 次

        preSleepMin: 50,       // 点击前随机等待 [50, 150]ms
        preSleepMax: 150,
        postSleepMin: 500,     // 点击后随机等待 [500, 1500]ms
        postSleepMax: 1500,

        pressMin: 80,          // 按压时长 [80, 200]ms
        pressMax: 200,

        borderOffset: 3,       // 不点在控件边缘，向内缩 3 像素
        restrictToScreen: true // 限制在屏幕范围内
    }
);


*/


