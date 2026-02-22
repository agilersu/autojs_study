// 等待无障碍服务
auto.waitFor();

// 初始化日志
console.show();
console.log("🍅 番茄畅听自动化脚本启动");
console.log("设备型号：" + device.brand + " " + device.model);

// 配置对象
var config = {
    // 应用包名
    packageName: "com.changting.android.app",

    // 任务开关
    tasks: {
        enableSignIn: true,
        enableWatchVideo: true,
        enableRead: true
    },

    // 时间配置（毫秒）
    timings: {
        pageLoadDelay: 3000,
        afterClickDelay: {
            min: 1500,
            max: 3000
        },
        taskInterval: 5000
    },

    // 重试配置
    retry: {
        maxRetries: 3,
        retryDelay: 2000
    },

    // 模拟人工参数
    humanSimulation: {
        coordinateOffset: 5,
        swipeSpeedVariation: 0.3
    }
};

// 工具函数对象
var utils = {
    randomDelay: function (min, max) {
        var delay = Math.random() * (max - min) + min;
        console.log("等待: " + delay.toFixed(0) + "ms");
        sleep(delay);
    },

    randomOffset: function (x, y, offset) {
        if (offset === undefined) offset = 5;
        var offsetX = (Math.random() - 0.5) * 2 * offset;
        var offsetY = (Math.random() - 0.5) * 2 * offset;
        return [x + offsetX, y + offsetY];
    },

    humanClick: function (x, y, desc) {
        if (desc === undefined) desc = "点击";
        try {
            var offsetResult = this.randomOffset(x, y, 5);
            var newX = offsetResult[0];
            var newY = offsetResult[1];
            var pressTime = 80 + Math.random() * 120;

            console.log("👆 " + desc + " at (" + newX + ", " + newY + "), 时长" + pressTime.toFixed(0) + "ms");
            press(newX, newY, pressTime);
            this.randomDelay(150, 400);
            return true;
        } catch (e) {
            console.error("❌ 点击失败: " + desc + ", Error: " + e);
            return false;
        }
    },

    humanClickWidget: function (uiObject, desc) {
        if (desc === undefined) desc = "控件";
        if (!uiObject) {
            console.warn("⚠️ 控件不存在: " + desc);
            return false;
        }
        try {
            var bounds = uiObject.bounds();
            var centerX = bounds.centerX();
            var centerY = bounds.centerY();
            var offsetResult = this.randomOffset(centerX, centerY, 8);
            var newX = offsetResult[0];
            var newY = offsetResult[1];
            var pressTime = 80 + Math.random() * 120;

            console.log("👆 " + desc + " at (" + newX + ", " + newY + "), 按压" + pressTime.toFixed(0) + "ms");
            press(newX, newY, pressTime);
            this.randomDelay(150, 400);
            return true;
        } catch (e) {
            console.error("❌ 控件点击失败: " + desc + ", Error: " + e);
            return false;
        }
    },

    humanSwipe: function (x1, y1, x2, y2, baseDuration, desc) {
        if (baseDuration === undefined) baseDuration = 500;
        if (desc === undefined) desc = "滑动";
        try {
            var offsetResult1 = this.randomOffset(x1, y1, 5);
            var newX1 = offsetResult1[0];
            var newY1 = offsetResult1[1];
            var offsetResult2 = this.randomOffset(x2, y2, 5);
            var newX2 = offsetResult2[0];
            var newY2 = offsetResult2[1];
            var duration = baseDuration * (0.8 + Math.random() * 0.4);

            console.log("👆 " + desc + " from (" + newX1 + ", " + newY1 + ") to (" + newX2 + ", " + newY2 + "), 时长" + duration.toFixed(0) + "ms");
            swipe(newX1, newY1, newX2, newY2, duration);
            this.randomDelay(300, 600);
        } catch (e) {
            console.error("❌ 滑动失败: " + desc + ", Error: " + e);
        }
    },

    randomSwipe: function (desc) {
        if (desc === undefined) desc = "随机滑动";
        var width = device.width;
        var height = device.height;

        var startX = width * (0.3 + Math.random() * 0.4);
        var startY = height * (0.6 + Math.random() * 0.3);
        var endX = width * (0.3 + Math.random() * 0.4);
        var endY = height * (0.2 + Math.random() * 0.3);
        var duration = 400 + Math.random() * 300;

        this.humanSwipe(startX, startY, endX, endY, duration, desc);
    },

    smartClick: function (uiObject, desc) {
        if (desc === undefined) desc = "元素";
        if (!uiObject) {
            console.warn("⚠️ 控件不存在: " + desc);
            return false;
        }
        try {
            var bounds = uiObject.bounds();
            var centerX = bounds.centerX();
            var centerY = bounds.centerY();

            if (uiObject.clickable()) {
                return this.humanClickWidget(uiObject, desc);
            } else {
                return this.humanClick(centerX, centerY, desc);
            }
        } catch (e) {
            console.error("❌ 智能点击失败: " + desc + ", Error: " + e);
            return false;
        }
    },

    safeClick: function (uiObject, desc) {
        if (desc === undefined) desc = "元素";
        return this.smartClick(uiObject, desc);
    },

    humanLongPress: function (x, y, duration, desc) {
        if (duration === undefined) duration = 800;
        if (desc === undefined) desc = "长按";
        try {
            var offsetResult = this.randomOffset(x, y, 5);
            var newX = offsetResult[0];
            var newY = offsetResult[1];
            var pressTime = duration * (0.9 + Math.random() * 0.2);

            console.log("👆 " + desc + " at (" + newX + ", " + newY + "), 时长" + pressTime.toFixed(0) + "ms");
            press(newX, newY, pressTime);
            this.randomDelay(200, 500);
        } catch (e) {
            console.error("❌ 长按失败: " + desc + ", Error: " + e);
        
    },

    humanMultiTouch: function (x1, y1, x2, y2, duration, desc) {
        if (duration === undefined) duration = 500;
        if (desc === undefined) desc = "双指操作";
        try {
            var offsetResult1 = this.randomOffset(x1, y1, 5);
            var newX1 = offsetResult1[0];
            var newY1 = offsetResult1[1];
            var offsetResult2 = this.randomOffset(x2, y2, 5);
            var newX2 = offsetResult2[0];
            var newY2 = offsetResult2[1];
            var actualDuration = duration * (0.9 + Math.random() * 0.2);

            console.log("👆 " + desc + " at (" + newX1 + ", " + newY1 + ") and (" + newX2 + ", " + newY2 + "), 时长" + actualDuration.toFixed(0) + "ms");

            gestures(actualDuration,
                [newX1, newY1],
                [newX2, newY2]
            );
            this.randomDelay(300, 600);
        } catch (e) {
            console.error("❌ 多点触控失败: " + desc + ", Error: " + e);
        }
    },

    randomPause: function () {
        var pauseTime = 500 + Math.random() * 1500;
        console.log("🤔 思考停顿 " + pauseTime.toFixed(0) + "ms");
        sleep(pauseTime);
    }
};

// UI选择器对象
var uiSelector = {
    signIn: {
        button: function () { return textMatches(/.*签到.*|.*立即签到.*/).findOne(3000); },
        successIndicator: function () { return textMatches(/.*签到成功.*|.*已签到.*/).findOne(3000); }
    },
    videoTask: {
        entry: function () { return textMatches(/.*看视频.*|.*视频奖励.*/).findOne(3000); },
        videoArea: function () { return className("android.view.View").depth(10).findOne(2000); }
    },
    readTask: {
        entry: function () { return textMatches(/.*阅读.*|.*阅读奖励.*/).findOne(3000); },
        contentArea: function () { return className("android.widget.TextView").depth(8).findOne(3000); }
    },
    closeButtons: function () { return descMatches("关闭|取消|×").findOne(2000); }
};

// 任务队列对象
var taskQueue = {
    tasks: [],

    addTask: function (name, taskFunction) {
        this.tasks.push({ name: name, taskFunction: taskFunction });
    },

    runAll: function () {
        console.log("🚀 开始执行任务队列，共 " + this.tasks.length + " 个任务");

        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            console.log("\n📋 任务 " + (i + 1) + "/" + this.tasks.length + ": " + task.name);

            var success = false;
            var retryCount = 0;

            while (!success && retryCount < config.retry.maxRetries) {
                if (retryCount > 0) {
                    console.log("🔄 第 " + (retryCount + 1) + " 次重试");
                }

                try {
                    success = task.taskFunction();
                    if (success) {
                        console.log("✅ 任务完成: " + task.name);
                    } else {
                        console.warn("⚠️ 任务执行失败: " + task.name);
                    }
                } catch (e) {
                    console.error("❌ 任务执行异常: " + e.message);
                }

                if (!success) {
                    retryCount++;
                    if (retryCount < config.retry.maxRetries) {
                        sleep(config.retry.retryDelay);
                    }
                }
            }

            if (i < this.tasks.length - 1) {
                utils.randomPause();
                utils.randomDelay(config.timings.taskInterval, config.timings.taskInterval + 2000);
            }
        }

        console.log("\n🎉 所有任务执行完毕");
    }
};

// 任务定义函数
function setupTasks() {
    if (config.tasks.enableSignIn) {
        taskQueue.addTask("每日签到", function () {
            console.log("点击签到按钮");
            utils.randomPause();
            var signInBtn = uiSelector.signIn.button();
            if (signInBtn) {
                utils.safeClick(signInBtn, "签到");
                utils.randomDelay(2000, 3000);

                var success = uiSelector.signIn.successIndicator();
                return success != null;
            }
            return false;
        });
    }

    if (config.tasks.enableWatchVideo) {
        taskQueue.addTask("看视频赚金币", function () {
            console.log("点击视频任务入口");
            utils.randomPause();
            var videoEntry = uiSelector.videoTask.entry();
            if (videoEntry) {
                utils.safeClick(videoEntry, "视频任务入口");
                utils.randomDelay(5000, 8000);

                for (var i = 0; i < 3; i++) {
                    utils.randomPause();
                    utils.humanSwipe(
                        device.width / 2, device.height * 0.8,
                        device.width / 2, device.height * 0.2, 500, "视频滑动"
                    );
                    utils.randomDelay(3000, 5000);
                }

                utils.randomPause();
                back();
                return true;
            }
            return false;
        });
    }

    if (config.tasks.enableRead) {
        taskQueue.addTask("阅读奖励", function () {
            console.log("点击阅读任务入口");
            utils.randomPause();
            var readEntry = uiSelector.readTask.entry();
            if (readEntry) {
                utils.safeClick(readEntry, "阅读任务入口");
                utils.randomDelay(3000, 5000);

                for (var i = 0; i < 5; i++) {
                    utils.randomPause();
                    utils.humanSwipe(
                        device.width / 2, device.height * 0.7,
                        device.width / 2, device.height * 0.3, 400, "阅读滑动"
                    );
                    utils.randomDelay(2000, 4000);
                }

                utils.randomPause();
                back();
                return true;
            }
            return false;
        });
    }
}

// 主执行函数
function main() {
    launchApp("番茄畅听");
    console.log("启动番茄畅听应用");
    utils.randomDelay(config.timings.pageLoadDelay, config.timings.pageLoadDelay + 2000);
    utils.randomPause();

    setupTasks();
    taskQueue.runAll();

    console.log("🍅 番茄畅听自动化脚本执行完成");
    toast("番茄畅听任务已完成");
}

// 异常处理
try {
    main();
} catch (e) {
    console.error("脚本执行出现异常: " + e);
    toast("脚本执行失败，请查看日志");
}
