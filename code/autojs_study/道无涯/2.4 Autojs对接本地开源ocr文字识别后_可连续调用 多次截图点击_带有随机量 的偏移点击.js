// 不使用 "auto" 指令，避免强制检查无障碍导致的 BUG

/**
 * OCR识别指定文本并按"文本宽度倍数"偏移后点击
 */
function ocrOffsetClick(targetText, moveDir, moveUnits, threshold, opt) {
    targetText = (targetText == null) ? "待输入文书" : String(targetText);
    moveDir = (moveDir == null) ? "right" : String(moveDir);
    moveUnits = (moveUnits == null) ? 1 : Number(moveUnits);
    threshold = (threshold == null) ? 0.8 : Number(threshold);

    opt = opt || {};

    var ocrUrl = opt.ocrUrl || "http://192.168.2.100:1224/api/ocr";
    var savePath = opt.savePath || "/sdcard/待识别图片.jpg";
    var captureDelayMs = (opt.captureDelayMs == null) ? 1200 : opt.captureDelayMs;
    var debug = !!opt.debug;
    var randomRange = (opt.randomRange == null) ? 0.5 : opt.randomRange;
    var deleteAfterUse = (opt.deleteAfterUse == null) ? true : opt.deleteAfterUse;

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

    var baseX = best.x2;
    var baseY = best.y1 + charHeight / 2;

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

    clickX = Math.round(clickX + randomOffsetX);
    clickY = Math.round(clickY + randomOffsetY);

    click(clickX, clickY);

    console.log(
        "命中：", best.text,
        "score=", best.score,
        "box=[", best.x1, best.y1, best.x2, best.y2, "]",
        "每个字符宽度=", charWidth.toFixed(2),
        "字符高度=", charHeight,
        "偏移方向=", moveDir,
        "偏移倍数=", moveUnits,
        "随机偏移X=", randomOffsetX.toFixed(2),
        "随机偏移Y=", randomOffsetY.toFixed(2),
        "最终点击点=(", clickX, ",", clickY, ")"
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

ocrOffsetClick("USB", "right", 2, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",  // 可省略，tailscale
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

console.log("截图点击文件结束\n");

sleep(2090); // 等待2秒出现新的图片再执行下一个示例

console.log("开始下一个\n");

ocrOffsetClick("自动备份脚本", "right", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

sleep(2000); // 等待2秒出现新的图片再执行下一个示例
console.log("开始下一个\n");

ocrOffsetClick("随手记", "left", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

sleep(2000); // 等待2秒出现新的图片再执行下一个示例

console.log("开始下一个\n");

ocrOffsetClick("保存", "left", 1, 0.8, {
    ocrUrl: "http://100.126.156.91:1224/api/ocr",
    savePath: "/sdcard/待识别图片.jpg",
    captureDelayMs: 1500,
    debug: false,
    randomRange: 0.5
});

back();