// 不使用 "auto" 指令，避免强制检查无障碍导致的 BUG

/**
 * 计算点击坐标
 * @param {object} positionInfo - 位置信息对象
 * @param {number} positionInfo.baseX - 基准X坐标
 * @param {number} positionInfo.baseY - 基准Y坐标
 * @param {number} positionInfo.charWidth - 字符宽度
 * @param {number} positionInfo.charHeight - 字符高度
 * @param {string} moveDir - 偏移方向
 * @param {number} moveUnits - 偏移倍数
 * @param {number} randomRange - 随机偏移范围
 * @returns {object} 计算后的点击坐标
 */
function calculateClickPosition(positionInfo, moveDir, moveUnits, randomRange) {
    var baseX = positionInfo.baseX;
    var baseY = positionInfo.baseY;
    var charWidth = positionInfo.charWidth;
    var charHeight = positionInfo.charHeight;

    var dist = charWidth * moveUnits;

    var clickX = baseX;
    var clickY = baseY;

    if (moveDir == "right") {
        clickX = baseX + dist;
    } else if (moveDir == "left") {
        clickX = baseX - dist;
    } else if (moveDir == "down") {
        clickY = baseY + dist;
    } else if (moveDir == "up") {
        clickY = baseY - dist;
    } else {
        clickX = baseX + dist;
    }

    var randomFactorX = (Math.random() - 0.5) * randomRange;
    var randomFactorY = (Math.random() - 0.5) * randomRange;

    var randomOffsetX = randomFactorX * charWidth;
    var randomOffsetY = randomFactorY * charHeight;

    return {
        x: Math.round(clickX + randomOffsetX),
        y: Math.round(clickY + randomOffsetY),
        randomOffsetX: randomOffsetX,
        randomOffsetY: randomOffsetY
    };
}

/**
 * 根据偏移方向获取基准点
 * @param {object} bounds - 控件边界对象
 * @param {number} bounds.left - 左边界
 * @param {number} bounds.top - 上边界
 * @param {number} bounds.right - 右边界
 * @param {number} bounds.bottom - 下边界
 * @param {number} charWidth - 字符宽度
 * @param {number} charHeight - 字符高度
 * @param {string} moveDir - 偏移方向
 * @returns {object} 基准点坐标
 */
function getBasePoint(bounds, charWidth, charHeight, moveDir) {
    if (moveDir == "right") {
        return {
            baseX: bounds.right,
            baseY: bounds.top + charHeight / 2
        };
    } else if (moveDir == "left") {
        return {
            baseX: bounds.left,
            baseY: bounds.top + charHeight / 2
        };
    } else if (moveDir == "down") {
        return {
            baseX: bounds.left + charWidth / 2,
            baseY: bounds.bottom
        };
    } else if (moveDir == "up") {
        return {
            baseX: bounds.left + charWidth / 2,
            baseY: bounds.top
        };
    } else {
        return {
            baseX: bounds.right,
            baseY: bounds.top + charHeight / 2
        };
    }
}

/**
 * 检查当前页面是否存在包含目标文本的控件
 * @param {string} targetText - 目标文本
 * @returns {object|null} 找到的控件对象，包含bounds信息
 */
function findControlWithText(targetText) {
    var targetStr = String(targetText);
    try {
        // 方法1：使用textContains查找包含指定文本的控件
        var textControls = textContains(targetStr).find();
        if (textControls && textControls.length > 0) {
            for (var i = 0; i < textControls.length; i++) {
                try {
                    var control = textControls[i];
                    if (control && control.bounds) {
                        var bounds = control.bounds();
                        var text = control.text();
                        var desc = control.desc();
                        var id = control.id();
                        var className = control.className();

                        console.log("通过textContains找到控件：");
                        console.log("  text=", text);
                        console.log("  desc=", desc);
                        console.log("  id=", id);
                        console.log("  className=", className);

                        return {
                            type: "control",
                            text: text,
                            desc: desc,
                            id: id,
                            className: className,
                            bounds: bounds
                        };
                    }
                } catch (e) {
                    console.log("控件访问异常：" + e.message);
                }
            }
        }

        // 方法2：使用descContains查找包含指定描述的控件
        var descControls = descContains(targetStr).find();
        if (descControls && descControls.length > 0) {
            for (var i = 0; i < descControls.length; i++) {
                try {
                    var control = descControls[i];
                    if (control && control.bounds) {
                        var bounds = control.bounds();
                        var text = control.text();
                        var desc = control.desc();
                        var id = control.id();
                        var className = control.className();

                        console.log("通过descContains找到控件：");
                        console.log("  text=", text);
                        console.log("  desc=", desc);
                        console.log("  id=", id);
                        console.log("  className=", className);

                        return {
                            type: "control",
                            text: text,
                            desc: desc,
                            id: id,
                            className: className,
                            bounds: bounds
                        };
                    }
                } catch (e) {
                    console.log("控件访问异常：" + e.message);
                }
            }
        }

        // 方法3：遍历所有可见控件进行匹配（兜底方案）
        var allControls = className("*").visibleToUser(true).find();
        console.log("遍历控件总数：" + allControls.length);

        for (var i = 0; i < allControls.length; i++) {
            var control = allControls[i];
            try {
                var text = control.text();
                var desc = control.desc();
                var id = control.id();
                var className = control.className();

                if (text && text.indexOf(targetStr) >= 0) {
                    var bounds = control.bounds();
                    console.log("通过遍历找到控件（text）：");
                    console.log("  text=", text);
                    console.log("  desc=", desc);
                    console.log("  id=", id);
                    console.log("  className=", className);
                    return {
                        type: "control",
                        text: text,
                        desc: desc,
                        id: id,
                        className: className,
                        bounds: bounds
                    };
                }

                if (desc && desc.indexOf(targetStr) >= 0) {
                    var bounds = control.bounds();
                    console.log("通过遍历找到控件（desc）：");
                    console.log("  text=", text);
                    console.log("  desc=", desc);
                    console.log("  id=", id);
                    console.log("  className=", className);
                    return {
                        type: "control",
                        text: text,
                        desc: desc,
                        id: id,
                        className: className,
                        bounds: bounds
                    };
                }
            } catch (e) {
                // 忽略单个控件访问异常
            }
        }
    } catch (e) {
        console.error("控件查找失败：" + e.message);
    }
    console.log("未找到包含文本的控件：" + targetStr);
    return null;
}

/**
 * OCR识别指定文本并按"文本宽度倍数"偏移后点击
 * 优先尝试控件识别，失败后使用OCR
 */
function ocrOffsetClick(targetText, moveDir, moveUnits, threshold, opt) {
    targetText = (targetText == null) ? "待输入文书" : String(targetText);
    moveDir = (moveDir == null) ? "right" : String(moveDir);
    moveUnits = (moveUnits == null) ? 1 : Number(moveUnits);
    threshold = (threshold == null) ? 0.8 : Number(threshold);

    opt = opt || {};

    var ocrUrl = opt.ocrUrl || "http://100.126.156.91:1224/api/ocr";
    var savePath = opt.savePath || "/sdcard/待识别图片.jpg";
    var captureDelayMs = (opt.captureDelayMs == null) ? 1200 : opt.captureDelayMs;
    var debug = !!opt.debug;
    var randomRange = (opt.randomRange == null) ? 0.5 : opt.randomRange;
    var deleteAfterUse = (opt.deleteAfterUse == null) ? true : opt.deleteAfterUse;

    // 1) 优先检查控件
    var control = findControlWithText(targetText);
    if (control) {
        console.log("已检测到此控件，详细信息：");
        console.log("  text=", control.text);
        console.log("  desc=", control.desc);
        console.log("  id=", control.id);
        console.log("  className=", control.className);

        var bounds = control.bounds;
        var textWidth = bounds.right - bounds.left;
        var textHeight = bounds.bottom - bounds.top;
        var charWidth = textWidth;
        var charHeight = textHeight;

        var basePoint = getBasePoint(bounds, charWidth, charHeight, moveDir);
        var positionInfo = {
            baseX: basePoint.baseX,
            baseY: basePoint.baseY,
            charWidth: charWidth,
            charHeight: charHeight
        };

        var clickPos = calculateClickPosition(positionInfo, moveDir, moveUnits, randomRange);

        click(clickPos.x, clickPos.y);

        console.log(
            "控件命中：", control.text,
            "bounds=[", bounds.left, bounds.top, bounds.right, bounds.bottom, "]",
            "每个字符宽度=", charWidth.toFixed(2),
            "字符高度=", charHeight,
            "偏移方向=", moveDir,
            "偏移倍数=", moveUnits,
            "随机偏移X=", clickPos.randomOffsetX.toFixed(2),
            "随机偏移Y=", clickPos.randomOffsetY.toFixed(2),
            "最终点击点=(", clickPos.x, ",", clickPos.y, ")"
        );

        return true;
    }

    console.log("未找到控件，开始使用OCR识别...");

    // ================== 关键修改：删除这里的 requestScreenCapture ==================
    // 不在函数内部重复申请截图权限，否则第二次可能卡死
    // ============================================================================

    // 截图前延迟，避免截到弹窗
    sleep(captureDelayMs);

    // 2) 截图并保存到指定路径
    var okSave = captureScreen(savePath);
    if (!okSave) {
        console.error("截图保存失败，请检查存储权限/路径");
        return false;
    }

    // 3) 读取图片并转为Base64，准备请求OCR
    var img = images.read(savePath);
    if (!img) {
        console.error("图片读取失败：" + savePath);
        return false;
    }

    var b64 = images.toBase64(img);
    img.recycle();

    // 4) 发送HTTP请求到OCR服务
    var response = http.postJson(ocrUrl, {
        "base64": b64
    });

    if (!response) {
        console.error("OCR请求失败：response为空");
        return false;
    }

    var res;
    try {
        res = response.body.json();
    } catch (e) {
        console.error("OCR响应JSON解析失败：" + e);
        return false;
    }

    if (debug) {
        console.log("OCR原始返回：", JSON.stringify(res));
    }

    // 5) 处理OCR结果
    if (res.code != 100) {
        if (res.code == 300) {
            console.log("base64解码失败！");
        } else if (res.code == 101) {
            console.log("并没有识别到文字！");
        } else {
            console.log("识别失败，请检查res报错，code=" + res.code);
        }
        return false;
    }

    if (!res.data || res.data.length == 0) {
        console.log("识别成功但data为空");
        return false;
    }

    var best = null;
    for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i];
        var text = (item.text == null) ? "" : String(item.text);
        if (text.indexOf(targetText) < 0) {
            continue;
        }

        var score = 1.0;
        if (item.score != null) {
            score = Number(item.score);
        } else if (item.confidence != null) {
            score = Number(item.confidence);
        } else if (item.prob != null) {
            score = Number(item.prob);
        }
        if (score > 1.0) score = score / 100.0;
        if (score < threshold) continue;

        var box = item.box;
        if (!box || box.length < 3) continue;
        var leftTop = box[0];
        var rightBottom = box[2];
        if (!leftTop || !rightBottom) continue;

        var x1 = Number(leftTop[0]);
        var y1 = Number(leftTop[1]);
        var x2 = Number(rightBottom[0]);
        var y2 = Number(rightBottom[1]);

        if (best == null || score > best.score) {
            best = {
                text: text,
                score: score,
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
        }
    }

    if (best == null) {
        console.log("未找到包含目标字符串的识别结果：" + targetText);
        return false;
    }

    var charWidth = (best.x2 - best.x1) / targetText.length;
    var charHeight = best.y2 - best.y1;

    var bounds = {
        left: best.x1,
        top: best.y1,
        right: best.x2,
        bottom: best.y2
    };

    var basePoint = getBasePoint(bounds, charWidth, charHeight, moveDir);
    var positionInfo = {
        baseX: basePoint.baseX,
        baseY: basePoint.baseY,
        charWidth: charWidth,
        charHeight: charHeight
    };

    var clickPos = calculateClickPosition(positionInfo, moveDir, moveUnits, randomRange);

    click(clickPos.x, clickPos.y);

    console.log(
        "OCR命中：", best.text,
        "score=", best.score,
        "box=[", best.x1, best.y1, best.x2, best.y2, "]",
        "每个字符宽度=", charWidth.toFixed(2),
        "字符高度=", charHeight,
        "偏移方向=", moveDir,
        "偏移倍数=", moveUnits,
        "随机偏移X=", clickPos.randomOffsetX.toFixed(2),
        "随机偏移Y=", clickPos.randomOffsetY.toFixed(2),
        "最终点击点=(", clickPos.x, ",", clickPos.y, ")"
    );

    if (deleteAfterUse && files.exists(savePath)) {
        files.remove(savePath);
        if (debug) {
            console.log("已删除临时截图文件：" + savePath);
        }
    }

    return true;
}

// ===================== 调用示例 =====================

// 关键：在脚本最前面统一申请一次截图权限
if (!requestScreenCapture(false)) {
    toast("请求截图失败");
    exit();
}

console.log("开始...\n");

ocrOffsetClick("通讯录", "right", 1, 0.8, {
    //ocrOffsetClick("抖音极速版", "left", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",  // 可省略，tailscale
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

console.log("截图点击文件结束\n");

sleep(10000); // 等待2秒出现新的图片再执行下一个示例

console.log("开始下一个\n");

ocrOffsetClick("新的朋友", "left", 0, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

sleep(2000); // 等待2秒出现新的图片再执行下一个示例
console.log("开始下一个\n");

ocrOffsetClick("添加手机联系人", "left", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

sleep(2000); // 等待2秒出现新的图片再执行下一个示例

console.log("开始下一个\n");

ocrOffsetClick("添加", "left", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

back();