auto();


/**
 * from deepseek
 * 随机滑动函数
 * @param {number} x1 起始点x坐标
 * @param {number} y1 起始点y坐标
 * @param {number} x2 结束点x坐标
 * @param {number} y2 结束点y坐标
 * @param {number} duration 滑动总时间（毫秒），默认800-1200ms随机
 * @param {number} steps 滑动步数，默认20-30随机
 */
function randomSwipe(x1, y1, x2, y2, duration, steps) {
    // 设置默认参数
    if (duration === undefined) {
        duration = random(800, 1200);
    }
    if (steps === undefined) {
        steps = random(20, 30);
    }

    // 获取屏幕尺寸
    var width = device.width;
    var height = device.height;

    // 确保坐标在屏幕范围内
    x1 = Math.max(0, Math.min(x1, width - 1));
    y1 = Math.max(0, Math.min(y1, height - 1));
    x2 = Math.max(0, Math.min(x2, width - 1));
    y2 = Math.max(0, Math.min(y2, height - 1));

    // 生成带随机波动的滑动路径
    var points = [];
    var controlPoint = {
        x: (x1 + x2) / 2 + random(-100, 100),
        y: (y1 + y2) / 2 + random(-100, 100)
    };

    for (var i = 0; i <= steps; i++) {
        var t = i / steps;

        // 使用贝塞尔曲线计算中间点
        var cx = Math.pow(1 - t, 2) * x1 +
            2 * (1 - t) * t * controlPoint.x +
            Math.pow(t, 2) * x2;

        var cy = Math.pow(1 - t, 2) * y1 +
            2 * (1 - t) * t * controlPoint.y +
            Math.pow(t, 2) * y2;

        // 添加随机抖动
        cx += random(-5, 5);
        cy += random(-5, 5);

        // 确保不超出屏幕
        cx = Math.max(0, Math.min(cx, width - 1));
        cy = Math.max(0, Math.min(cy, height - 1));

        points.push([parseInt(cx), parseInt(cy)]);
    }

    // 生成非线性的时间间隔
    var timePoints = [];
    var totalTime = 0;

    for (var j = 0; j <= steps; j++) {
        // 使用缓动函数使速度变化更自然
        var t = j / steps;
        var easeTime = easeInOutCubic(t);
        var time = duration * easeTime;

        // 添加随机时间波动
        time += random(-10, 10);
        time = Math.max(0, time);

        timePoints.push(parseInt(time));
    }

    // 执行滑动
    for (var k = 0; k < points.length - 1; k++) {
        var startPoint = points[k];
        var endPoint = points[k + 1];
        var swipeDuration = timePoints[k + 1] - timePoints[k];

        if (swipeDuration > 0) {
            // 添加随机延迟
            var delay = random(0, 5);
            if (delay > 0) sleep(delay);

            // 执行单步滑动
            swipe(startPoint[0], startPoint[1],
                endPoint[0], endPoint[1],
                swipeDuration);
        }
    }
}

/**
 * 缓动函数 - 平滑的加速和减速
 */
function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * 生成随机数
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机滑动示例：从屏幕底部滑动到顶部
 */
function swipeUpExample() {
    var width = device.width;
    var height = device.height;

    // 从底部中间滑动到顶部中间
    var startX = width / 2;
    var startY = height * 0.8;
    var endX = width / 2 + random(-50, 50);  // 添加水平随机偏移
    var endY = height * 0.2;

    randomSwipe(startX, startY, endX, endY);
}

/**
 * 随机滑动示例：从屏幕顶部滑动到底部
 */
function swipeDownExample() {
    var width = device.width;
    var height = device.height;

    var startX = width / 2;
    var startY = height * 0.2;
    var endX = width / 2 + random(-50, 50);
    var endY = height * 0.8;

    randomSwipe(startX, startY, endX, endY);
}

/**
 * 随机滑动示例：从右向左滑动
 */
function swipeLeftExample() {
    var width = device.width;
    var height = device.height;

    var startX = width * 0.8;
    var startY = height / 2;
    var endX = width * 0.2;
    var endY = height / 2 + random(-50, 50);

    randomSwipe(startX, startY, endX, endY);
}

/**
 * 随机滑动示例：从左向右滑动
 */
function swipeRightExample() {
    var width = device.width;
    var height = device.height;

    var startX = width * 0.2;
    var startY = height / 2;
    var endX = width * 0.8;
    var endY = height / 2 + random(-50, 50);

    randomSwipe(startX, startY, endX, endY);
}

// 使用示例
swipeUpExample();  // 向上滑动
//swipeDownExample();  // 向下滑动
// swipeLeftExample();  // 向左滑动
// swipeRightExample(); // 向右滑动
