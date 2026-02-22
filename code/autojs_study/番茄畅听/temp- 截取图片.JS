// 专门针对"领取成功"字符串的优化函数
auto();

/**
 * 查找"领取成功"并点击其右侧指定距离
 * @param {number} charWidthMultiplier - 移动的字符宽度倍数
 * @param {string} direction - 移动方向: 'right'(右侧), 'left'(左侧)
 * @return {boolean} - 是否成功点击
 */
function clickNearReceivedSuccess(charWidthMultiplier, direction) {
    charWidthMultiplier = charWidthMultiplier || 2;
    direction = direction || 'right';

    toastLog("开始查找'领取成功'");

    // 尝试多种方式查找"领取成功"
    let target = null;
    let findMethods = [
        { method: "desc", pattern: "领取成功" },
        { method: "descContains", pattern: "领取成功" },
        { method: "descContains", pattern: "领取" },
        { method: "text", pattern: "领取成功" },
        { method: "textContains", pattern: "领取成功" },
        { method: "textContains", pattern: "领取" }
    ];

    // 尝试每种查找方法
    for (let i = 0; i < findMethods.length && !target; i++) {
        let method = findMethods[i];
        toastLog("尝试方法: " + method.method + ", 模式: " + method.pattern);

        switch (method.method) {
            case 'desc':
                target = descStartsWith(method.pattern).findOne(500);
                break;
            case 'descContains':
                target = descContains(method.pattern).findOne(500);
                break;
            case 'text':
                target = textStartsWith(method.pattern).findOne(500);
                break;
            case 'textContains':
                target = textContains(method.pattern).findOne(500);
                break;
        }

        if (target) {
            toastLog("通过" + method.method + "找到'领取成功'");
            break;
        }
    }

    if (!target) {
        toastLog("未找到'领取成功'");
        return false;
    }

    // 获取控件信息
    let bounds = target.bounds();
    let centerX = bounds.centerX();
    let centerY = bounds.centerY();
    let controlWidth = bounds.width();
    let controlHeight = bounds.height();

    // 计算字符宽度
    let text = target.text() || target.desc() || "领取成功";
    let charCount = calculateCharCountForChinese(text);
    let charWidth = controlWidth / Math.max(charCount, 1);

    toastLog("控件宽度: " + controlWidth + ", 文本: " + text +
        ", 字符数: " + charCount + ", 字符宽度: " + charWidth.toFixed(2));

    // 计算点击位置
    let clickX, clickY = centerY;
    let moveDistance = charWidth * charWidthMultiplier;

    if (direction === 'right') {
        clickX = bounds.right + moveDistance;
    } else if (direction === 'left') {
        clickX = bounds.left - moveDistance;
    } else if (direction === 'right-center') {
        clickX = centerX + moveDistance;
    } else if (direction === 'left-center') {
        clickX = centerX - moveDistance;
    } else {
        toastLog("不支持的方向: " + direction);
        return false;
    }

    // 边界检查
    clickX = Math.max(20, Math.min(clickX, device.width - 20));

    toastLog("点击位置: (" + Math.round(clickX) + ", " + Math.round(clickY) + ")");

    // 点击
    click(clickX, clickY);

    return true;
}

/**
 * 计算中文字符数量（中文字符算1，英文字符和数字算0.5）
 */
function calculateCharCountForChinese(text) {
    let count = 0;

    for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
            // 中文字符
            count += 1.0;
        } else if ((charCode >= 0x30 && charCode <= 0x39) || // 数字
            (charCode >= 0x41 && charCode <= 0x5A) || // 大写字母
            (charCode >= 0x61 && charCode <= 0x7A)) { // 小写字母
            // 英文字母和数字
            count += 0.5;
        } else {
            // 标点符号和空格
            count += 0.3;
        }
    }

    return Math.max(count, 1); // 至少返回1
}

/**
 * 增强版：在屏幕中查找任何包含"领取"的控件
 */
function clickNearAnyReceiveControl(moveUnits, direction) {
    moveUnits = moveUnits || 2;
    direction = direction || 'right';

    toastLog("查找任何包含'领取'的控件");

    // 查找所有可能包含"领取"的控件
    let allReceives = descContains("领取").find();
    allReceives = allReceives.concat(textContains("领取").find());
    allReceives = allReceives.concat(descContains("成功").find());
    allReceives = allReceives.concat(textContains("成功").find());

    if (allReceives.length === 0) {
        toastLog("未找到任何包含'领取'或'成功'的控件");
        return false;
    }

    toastLog("找到" + allReceives.length + "个可能相关的控件");

    // 按面积排序，通常较大的控件是目标
    allReceives.sort((a, b) => {
        let aArea = a.bounds().width() * a.bounds().height();
        let bArea = b.bounds().width() * b.bounds().height();
        return bArea - aArea; // 从大到小排序
    });

    // 选择第一个（面积最大的）
    let target = allReceives[0];
    let bounds = target.bounds();

    // 获取控件文本
    let text = target.text() || target.desc() || "领取";
    toastLog("选择控件: " + text + ", 面积: " + (bounds.width() * bounds.height()));

    // 计算点击位置
    let centerX = bounds.centerX();
    let centerY = bounds.centerY();
    let charWidth = bounds.width() / Math.max(text.length, 1);

    let clickX, clickY = centerY;
    let moveDistance = charWidth * moveUnits;

    if (direction === 'right') {
        clickX = bounds.right + moveDistance;
    } else if (direction === 'left') {
        clickX = bounds.left - moveDistance;
    } else {
        clickX = bounds.right + moveDistance;
    }

    // 边界检查
    clickX = Math.max(20, Math.min(clickX, device.width - 20));

    toastLog("点击位置: (" + Math.round(clickX) + ", " + Math.round(clickY) + ")");
    click(clickX, clickY);

    return true;
}

// 主程序
function main() {
    auto();

    // 等待应用启动
    sleep(3000);

    // 方法1: 精确查找"领取成功"
    let success = clickNearReceivedSuccess(2, 'right');

    if (!success) {
        toastLog("精确查找失败，尝试模糊查找");

        // 方法2: 模糊查找包含"领取"的控件
        success = clickNearAnyReceiveControl(2, 'right');
    }

    if (success) {
        toastLog("操作成功完成");
    } else {
        toastLog("操作失败");
    }
}

// 执行
main();