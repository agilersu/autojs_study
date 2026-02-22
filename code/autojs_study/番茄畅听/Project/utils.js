module.exports = {
    /**
     * 模拟人工随机延迟
     * @param {number} min 最小延迟(毫秒)
     * @param {number} max 最大延迟(毫秒)
     */
    randomDelay: function (min, max) {
        const delay = Math.random() * (max - min) + min;
        console.log("等待: " + delay.toFixed(0) + "ms");
        sleep(delay);
    },

    /**
     * 生成随机偏移坐标
     * @param {number} x 原始X坐标
     * @param {number} y 原始Y坐标
     * @param {number} offset 最大偏移量
     * @returns {Array} [newX, newY]
     */
    randomOffset: function (x, y, offset = 5) {
        const offsetX = (Math.random() - 0.5) * 2 * offset;
        const offsetY = (Math.random() - 0.5) * 2 * offset;
        return [Math.floor(x + offsetX), Math.floor(y + offsetY)];
    },

    /**
     * 模拟人工点击（带随机偏移和按压时间）
     * @param {number} x X坐标
     * @param {number} y Y坐标
     * @param {string} desc 操作描述
     * @returns {boolean} 是否成功
     */
    humanClick: function (x, y, desc = "点击") {
        try {
            const [newX, newY] = this.randomOffset(x, y, 5);
            const pressTime = 80 + Math.random() * 120;

            console.log(`👆 ${desc} at (${newX}, ${newY}), 按压${pressTime.toFixed(0)}ms`);
            press(newX, newY, pressTime);
            this.randomDelay(150, 400);
            return true;
        } catch (e) {
            console.error("❌ 点击失败: " + desc + ", Error: " + e);
            return false;
        }
    },

    /**
     * 模拟人工控件点击（带随机偏移）
     * @param {UiObject} uiObject 控件对象
     * @param {string} desc 控件描述
     * @returns {boolean} 是否成功
     */
    humanClickWidget: function (uiObject, desc = "控件") {
        if (!uiObject) {
            console.warn("⚠️ 控件不存在: " + desc);
            return false;
        }
        try {
            const bounds = uiObject.bounds();
            const centerX = bounds.centerX();
            const centerY = bounds.centerY();
            const [newX, newY] = this.randomOffset(centerX, centerY, 8);
            const pressTime = 80 + Math.random() * 120;

            console.log(`👆 ${desc} at (${newX}, ${newY}), 按压${pressTime.toFixed(0)}ms`);
            press(newX, newY, pressTime);
            this.randomDelay(150, 400);
            return true;
        } catch (e) {
            console.error("❌ 控件点击失败: " + desc + ", Error: " + e);
            return false;
        }
    },

    /**
     * 模拟人工滑动（带随机速度和路径）
     * @param {number} x1 起始X
     * @param {number} y1 起始Y
     * @param {number} x2 结束X
     * @param {number} y2 结束Y
     * @param {number} baseDuration 基础时长
     * @param {string} desc 操作描述
     */
    humanSwipe: function (x1, y1, x2, y2, baseDuration = 500, desc = "滑动") {
        try {
            const [newX1, newY1] = this.randomOffset(x1, y1, 5);
            const [newX2, newY2] = this.randomOffset(x2, y2, 5);
            const duration = baseDuration * (0.8 + Math.random() * 0.4);

            console.log(`👆 ${desc} from (${newX1}, ${newY1}) to (${newX2}, ${newY2}), 时长${duration.toFixed(0)}ms`);
            swipe(newX1, newY1, newX2, newY2, duration);
            this.randomDelay(300, 600);
        } catch (e) {
            console.error("❌ 滑动失败: " + desc + ", Error: " + e);
        }
    },

    /**
     * 模拟人工随机滑动（随机方向和距离）
     * @param {string} desc 操作描述
     */
    randomSwipe: function (desc = "随机滑动") {
        const width = device.width;
        const height = device.height;

        const startX = width * (0.3 + Math.random() * 0.4);
        const startY = height * (0.6 + Math.random() * 0.3);
        const endX = width * (0.3 + Math.random() * 0.4);
        const endY = height * (0.2 + Math.random() * 0.3);
        const duration = 400 + Math.random() * 300;

        this.humanSwipe(startX, startY, endX, endY, duration, desc);
    },

    /**
     * 智能点击（优先控件点击，失败则坐标点击）
     * @param {UiObject} uiObject 控件对象
     * @param {string} desc 控件描述
     * @returns {boolean} 是否成功
     */
    smartClick: function (uiObject, desc = "元素") {
        if (!uiObject) {
            console.warn("⚠️ 控件不存在: " + desc);
            return false;
        }
        try {
            const bounds = uiObject.bounds();
            const centerX = bounds.centerX();
            const centerY = bounds.centerY();

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

    /**
     * 安全点击控件（带错误处理）
     * @param {UiObject} uiObject 控件对象
     * @param {string} desc 控件描述（用于日志）
     * @returns {boolean} 点击是否成功
     */
    safeClick: function (uiObject, desc = "元素") {
        return this.smartClick(uiObject, desc);
    },

    /**
     * 模拟人工长按
     * @param {number} x X坐标
     * @param {number} y Y坐标
     * @param {number} duration 长按时长
     * @param {string} desc 操作描述
     */
    humanLongPress: function (x, y, duration = 800, desc = "长按") {
        try {
            const [newX, newY] = this.randomOffset(x, y, 5);
            const pressTime = duration * (0.9 + Math.random() * 0.2);

            console.log(`👆 ${desc} at (${newX}, ${newY}), 时长${pressTime.toFixed(0)}ms`);
            press(newX, newY, pressTime);
            this.randomDelay(200, 500);
        } catch (e) {
            console.error("❌ 长按失败: " + desc + ", Error: " + e);
        }
    },

    /**
     * 模拟人工多点触控（双指缩放）
     * @param {number} x1 第一个点X
     * @param {number} y1 第一个点Y
     * @param {number} x2 第二个点X
     * @param {number} y2 第二个点Y
     * @param {number} duration 时长
     * @param {string} desc 操作描述
     */
    humanMultiTouch: function (x1, y1, x2, y2, duration = 500, desc = "双指操作") {
        try {
            const [newX1, newY1] = this.randomOffset(x1, y1, 5);
            const [newX2, newY2] = this.randomOffset(x2, y2, 5);
            const actualDuration = duration * (0.9 + Math.random() * 0.2);

            console.log(`👆 ${desc} at (${newX1}, ${newY1}) and (${newX2}, ${newY2}), 时长${actualDuration.toFixed(0)}ms`);

            gestures(actualDuration,
                [newX1, newY1],
                [newX2, newY2]
            );
            this.randomDelay(300, 600);
        } catch (e) {
            console.error("❌ 多点触控失败: " + desc + ", Error: " + e);
        }
    },

    /**
     * 模拟人工随机停顿（思考时间）
     */
    randomPause: function () {
        const pauseTime = 500 + Math.random() * 1500;
        console.log(`🤔 思考停顿 ${pauseTime.toFixed(0)}ms`);
        sleep(pauseTime);
    }
};
