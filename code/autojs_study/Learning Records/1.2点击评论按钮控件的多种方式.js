
auto();// 自动获取无障碍权限
toastLog("控件检测开始");
// 如下方案1，2,3  对于抖音视频 评论 控件按钮可行

//方案1，直接点击其父控件
//id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).findOne().parent().click(); 


/*
// 方案2：向上查找可点击父节点并点击，带最大查找高度限制
// 

// 主流程

var node = id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).findOne();
if (node) {
    if (clickUpwardToClickableRoot(node, 6)) {
        // 点击成功
    } else {
        toastLog("方案A向上查找可点击父节点失败,尝试方案B/C");
    }
} else {
    toastLog("找不到目标控件");
}

function clickUpwardToClickableRoot(startNode, maxDepth) {
    var cur = startNode;
    var depth = 0;
    while (cur != null && depth <= (maxDepth || 6)) {
        // 优先使用当前节点的可点击性
        if (typeof cur.clickable === 'boolean' && cur.clickable && cur.click && cur.click()) {
            toastLog("方案2,在第 " + depth + " 级父节点点击成功");
            return true;
        }
        // 尝试对当前节点执行一次点击（若该节点可点击，会有反应）
        try {
            if (cur.click && cur.click()) {
                toastLog("方案2在第 " + depth + " 级父节点尝试点击成功（尝试结果不确定，继续向上）");
                return true;
            }
        } catch (e) {
            // 忽略点击异常
        }
        cur = cur.parent();
        depth++;
    }
    return false;
}



*/


// 方案 4，检查符合条件的控件是否存在，如下方案不可行，因为存在bounds区域为空
/* 
id("d6o").className("android.widget.ImageView").desc("评论9678，按钮").findOne().parent().click() */

/* toastLog("控件检测开始");

if (id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).exists()) {
    var a = id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).findOne();
    if (a != null) {
        var b = a.bounds();
        toastLog("Bounds: left=" + b.left + " top=" + b.top + " right=" + b.right + " bottom=" + b.bottom);
        var cx = b.centerX();
        var cy = b.centerY();
        toastLog("Center: cx=" + cx + " cy=" + cy);
        if (cx >= 0 && cy >= 0 && cx < device.width && cy < device.height) {
            click(cx, cy);
            toastLog("点击坐标点执行完成");
        } else {
            toastLog("无效的点击坐标，已跳过点击");
        }
    } else {
        toastLog("控件存在但找不到可点击对象");
    }
} else {
    toastLog("找不到控件");
}
 */








/**
 * // 方案3
 * 查找并点击评论按钮
 * 如果直接点击失败，会尝试向上查找可点击的父节点
 */

function findAndClickCommentButton() {
    // 查找目标节点
    var targetNode = id("d6o")
        .className("android.widget.ImageView")
        .descMatches(/^评论.*按钮$/)
        .findOne();

    if (!targetNode) {
        toastLog("❌ 找不到目标控件：评论按钮");
        return false;
    }

    toastLog("✅ 找到目标控件，开始尝试点击...");

    // 先尝试直接点击目标节点
    if (tryClickNode(targetNode, "目标节点")) {
        return true;
    }

    // 如果直接点击失败，尝试向上查找可点击的父节点
    toastLog("目标节点不可点击，尝试向上查找可点击父节点...");
    if (clickUpwardToClickableRoot(targetNode, 6)) {
        return true;
    }

    // 如果所有方法都失败
    toastLog("❌ 所有点击方案均失败");
    return false;
}

/**
 * 向上查找可点击的父节点并点击
 * @param {UiObject} startNode - 起始节点
 * @param {number} maxDepth - 最大查找深度
 * @returns {boolean} 是否点击成功
 */
function clickUpwardToClickableRoot(startNode, maxDepth) {
    if (!startNode) {
        toastLog("❌ 起始节点为空");
        return false;
    }

    var currentNode = startNode;
    var maxDepth = maxDepth || 6;
    var currentDepth = 0;

    toastLog("开始向上查找可点击父节点，最大深度：" + maxDepth);

    while (currentNode && currentDepth < maxDepth) {
        // 尝试点击当前节点
        var clickResult = tryClickNode(currentNode, "第" + currentDepth + "级父节点");

        if (clickResult) {
            toastLog("✅ 在第" + currentDepth + "级父节点点击成功");
            return true;
        }

        // 获取父节点，继续向上查找
        var parentNode = currentNode.parent();
        if (!parentNode) {
            toastLog("已到达根节点，停止查找");
            break;
        }

        currentNode = parentNode;
        currentDepth++;

        // 显示当前查找进度
        if (currentDepth < maxDepth) {
            toastLog("↥ 向上查找第" + currentDepth + "级父节点...");
        }
    }

    toastLog("❌ 向上查找" + maxDepth + "层仍未找到可点击节点");
    return false;
}

/**
 * 尝试点击节点
 * @param {UiObject} node - 要点击的节点
 * @param {string} nodeDescription - 节点描述（用于日志）
 * @returns {boolean} 点击是否成功
 */
function tryClickNode(node, nodeDescription) {
    if (!node) {
        toastLog("❌ " + nodeDescription + "：节点为空");
        return false;
    }

    // 检查节点是否可点击
    if (typeof node.clickable === 'boolean' && node.clickable) {
        toastLog("✓ " + nodeDescription + "：标记为可点击，尝试点击...");
    } else {
        toastLog("? " + nodeDescription + "：未标记为可点击，但仍尝试点击...");
    }

    // 尝试点击
    try {
        if (node.click && node.click()) {
            toastLog("✓ " + nodeDescription + "：点击动作执行成功");

            // 添加短暂等待，让界面响应
            sleep(300);

            // 这里可以添加点击成功的验证逻辑
            // 例如：检查特定元素是否出现、界面是否变化等

            return true;
        } else {
            toastLog("✗ " + nodeDescription + "：点击方法返回失败");
        }
    } catch (error) {
        toastLog("⚠ " + nodeDescription + "：点击时发生异常：" + error.toString());
    }

    return false;
}

/**
 * 增强型点击方法，包含点击位置偏移
 * @param {UiObject} node - 要点击的节点
 * @param {number} offsetX - X轴偏移（百分比，0-1）
 * @param {number} offsetY - Y轴偏移（百分比，0-1）
 * @returns {boolean} 点击是否成功
 */
function clickNodeWithOffset(node, offsetX, offsetY) {
    if (!node || !node.bounds()) {
        return false;
    }

    var bounds = node.bounds();
    var centerX = bounds.centerX();
    var centerY = bounds.centerY();
    var width = bounds.width();
    var height = bounds.height();

    // 计算点击位置（允许在控件范围内偏移）
    var clickX = centerX + (offsetX || 0) * width;
    var clickY = centerY + (offsetY || 0) * height;

    return click(clickX, clickY);
}

// 主程序入口
function main() {
    toastLog("=== 开始执行评论按钮点击程序 ===");

    // 添加超时机制
    var timeout = 10000; // 10秒超时
    var startTime = new Date().getTime();

    while (new Date().getTime() - startTime < timeout) {
        if (findAndClickCommentButton()) {
            toastLog("🎉 评论按钮点击成功！");
            return;
        }

        toastLog("等待1秒后重试...");
        sleep(1000);
    }

    toastLog("⏰ 操作超时，未能成功点击评论按钮");
}

// 执行主程序
main();

