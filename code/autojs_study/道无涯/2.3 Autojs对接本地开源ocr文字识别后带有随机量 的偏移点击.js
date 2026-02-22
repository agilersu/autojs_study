// 不使用 "auto" 指令，避免强制检查无障碍导致的 BUG

/**
 * OCR识别指定文本并按"文本宽度倍数"偏移后点击
 *
 * @param {string} targetText   要匹配的文字（默认："待输入文书"）
 * @param {string} moveDir      偏移方向（默认："right"；可选："left"|"up"|"down"）
 * @param {number} moveUnits    偏移单位（默认：1；表示"按文本宽度的倍数偏移"）
 * @param {number} threshold    匹配阈值（默认：0.8；若OCR返回置信度则参与筛选）
 * @param {object} opt          可选参数：{ ocrUrl, savePath, captureDelayMs, debug, randomRange }
 * @returns {boolean}           成功找到并点击返回 true，否则 false
 */
function ocrOffsetClick(targetText, moveDir, moveUnits, threshold, opt) {
    // 若未传入目标文字，则用默认值"待输入文书"
    targetText = (targetText == null) ? "待输入文书" : String(targetText);
    // 若未传入方向，则默认向右
    moveDir = (moveDir == null) ? "right" : String(moveDir);
    // 若未传入单位倍数，则默认 1
    moveUnits = (moveUnits == null) ? 1 : Number(moveUnits);
    // 若未传入阈值，则默认 0.8
    threshold = (threshold == null) ? 0.8 : Number(threshold);

    opt = opt || {}; // 若未传入配置对象，则使用空对象
 
    // OCR接口地址（默认用你当前的本地接口）
  //var ocrUrl = opt.ocrUrl || "http://192.168.2.100:1224/api/ocr";  // Home-HP
    var ocrUrl = opt.ocrUrl || "http://100.126.156.91:1224/api/ocr";// CCTV2-tailscal
   // var ocrUrl = opt.ocrUrl || "http://192.168.3.101:1224/api/ocr";   // CCTV2-IP     
    // 截图保存路径（默认与你原代码一致）
    var savePath = opt.savePath || "/sdcard/待识别图片.jpg";
    // 截图前延迟（避免截到授权弹窗；可调）
    var captureDelayMs = (opt.captureDelayMs == null) ? 1200 : opt.captureDelayMs;
    // 是否打印调试日志（true/false）
    var debug = !!opt.debug;
    // 随机偏移范围系数，默认0.5（半个字符宽度/高度）
    var randomRange = (opt.randomRange == null) ? 0.5 : opt.randomRange;

    // 1) 请求截图权限（首次会弹系统框；授权一次后后续自动截图无需确认）
    //    传 false 表示不强制横屏；Auto.js 4.1.1 下常用写法
    if (!requestScreenCapture(false)) {
        alert("请求截图失败");
        return false;
    }

    // 需要加延迟，避免第一次授权弹窗被截到（你原代码也有这个逻辑）
    sleep(captureDelayMs);

    // 2) 截图并保存到指定路径
    var okSave = captureScreen(savePath); // 截图并保存为文件
    if (!okSave) {                        // 判断保存是否成功
        console.error("截图保存失败，请检查存储权限/路径");
        return false;
    }

    // 3) 读取图片并转为Base64，准备请求OCR
    var img = images.read(savePath);      // 从路径读取图片为Image对象
    if (!img) {                           // 判断图片是否读取成功
        console.error("图片读取失败：" + savePath);
        return false;
    }

    var b64 = images.toBase64(img);       // 将Image转为Base64字符串（不含data:image前缀）
    img.recycle();                        // 释放图片对象，避免内存泄露

    // 4) 发送HTTP请求到OCR服务（保持你原来的postJson方式）
    var response = http.postJson(ocrUrl, {
        "base64": b64                     // 传入base64字段（与你OCR服务的约定一致）
    });

    if (!response) {                      // 判断是否拿到HTTP响应对象
        console.error("OCR请求失败：response为空");
        return false;
    }

    var res;
    try {
        res = response.body.json();       // 将响应体解析成JSON对象
    } catch (e) {
        console.error("OCR响应JSON解析失败：" + e);
        return false;
    }

    if (debug) {
        console.log("OCR原始返回：", JSON.stringify(res));
    }

    // 5) 处理OCR结果：寻找"包含targetText"的文字块
    if (res.code != 100) {                // 你的接口中：100表示识别成功
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

    // 遍历识别结果，找"包含targetText"的条目，并按阈值筛选
    var best = null;                      // 用来保存最优命中的结果
    for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i];           // 当前识别项
        var text = (item.text == null) ? "" : String(item.text);
        // 只要"包含"目标字符串即可
        if (text.indexOf(targetText) < 0) {
            continue;                     // 不包含就跳过
        }

        // 取出置信度，字段名不确定时作兼容
        var score = 1.0;                  // 默认置信度 1.0（如果没有返回，则视为满足）
        if (item.score != null) {
            score = Number(item.score);
        } else if (item.confidence != null) {
            score = Number(item.confidence);
        } else if (item.prob != null) {
            score = Number(item.prob);
        }

        // 如果是百分制（>1），则缩放到 0~1
        if (score > 1.0) {
            score = score / 100.0;
        }

        if (score < threshold) {          // 低于阈值的不考虑
            continue;
        }

        var box = item.box;               // 你的接口中 box 是坐标数组
        if (!box || box.length < 3) {
            continue;                     // 非法 box 跳过
        }

        // 与你原代码保持一致：0 为左上，2 为右下
        var leftTop = box[0];
        var rightBottom = box[2];
        if (!leftTop || !rightBottom) {
            continue;
        }

        var x1 = Number(leftTop[0]);      // 左上x
        var y1 = Number(leftTop[1]);      // 左上y
        var x2 = Number(rightBottom[0]);  // 右下x
        var y2 = Number(rightBottom[1]);  // 右下y

        if (best == null || score > best.score) {
            // 保存最优匹配
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

    // 6) 计算宽度，高度，并按要求"从右边界偏移 N 个宽度"
    // 修改前：var width = best.x2 - best.x1;        // 文字框宽度
    // 修改后：计算每个字符的平均宽度
    var charWidth = (best.x2 - best.x1) / targetText.length;  // 单个字符的平均宽度
    var charHeight = best.y2 - best.y1;   // 字符高度（使用文本框高度）

    // 基准点：右边界中点
    var baseX = best.x2;                  // 右边界 x
    var baseY = best.y1 + charHeight / 2; // 垂直居中的 y

    // 偏移距离 = 单个字符宽度 * moveUnits
    var dist = charWidth * moveUnits;

    var clickX = baseX;
    var clickY = baseY;

    // 根据方向决定偏移方向
    if (moveDir == "right") {
        clickX = baseX + dist;           // 向右
    } else if (moveDir == "left") {
        clickX = baseX - dist;           // 向左（从右边界向左）
    } else if (moveDir == "down") {
        clickY = baseY + dist;           // 向下（这里仍用宽度作为单位）
    } else if (moveDir == "up") {
        clickY = baseY - dist;           // 向上
    } else {
        // 方向不合法就按向右处理
        clickX = baseX + dist;
    }

    // 7) 添加随机偏移，模拟人为操作
    // 生成-0.5到0.5之间的随机数，然后乘以字符宽度/高度
    var randomFactorX = (Math.random() - 0.5) * randomRange; // -0.5到0.5之间
    var randomFactorY = (Math.random() - 0.5) * randomRange; // -0.5到0.5之间

    // 计算随机偏移量：半个字符宽度/高度的随机偏移
    var randomOffsetX = randomFactorX * charWidth;
    var randomOffsetY = randomFactorY * charHeight;

    // 应用随机偏移
    clickX += randomOffsetX;
    clickY += randomOffsetY;

    // 确保点击位置是整数
    clickX = Math.round(clickX);
    clickY = Math.round(clickY);

    // 8) 执行点击
    click(clickX, clickY);

    // 9) 输出日志
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

    return true;
}

// ===================== 调用示例 =====================

/* // 你的需求：识别"领取成功"，向右偏移 2 个宽度后点击，阈值0.8
ocrOffsetClick("领取成功", "right", 2, 0.8, {
    ocrUrl: "http://192.168.2.100:1224/api/ocr",   // 可省略，用默认值
    savePath: "/sdcard/待识别图片.jpg",            // 可省略，用默认值
    captureDelayMs: 1500,                          // 截图前延迟
    debug: false,                                   // 需要看完整 OCR 返回时改为 true
    randomRange: 0.5                               // 随机偏移范围系数，默认0.5（半个字符宽度/高度）
}); */

sleep(2000); // 等待2秒再执行下一个示例
// 你的需求：识别"领取奖励"，向左偏移 1 个宽度后点击，阈值0.8

ocrOffsetClick("示例代码", "left", 1, 0.8, {
    //ocrUrl: "http://192.168.2.100:1224/api/ocr",   // 可省略，用默认值
    ocrUrl: "http://100.126.156.91:1224/api/ocr",   // 可省略，用默认值CCTV2-tailscale
    //ocrUrl: "http://192.168.3.99:1224/api/ocr",   // 可省略，用默认值MR
    //ocrUrl: "http://192.168.3.101:1224/api/ocr",   // 可省略，用默认值CCTV2-IP    
    savePath: "/sdcard/待识别图片.jpg",            // 可省略，用默认值
    captureDelayMs: 1500,                          // 截图前延迟
    debug: false,                                   // 需要看完整 OCR 返回时改为 true
    randomRange: 0.5                               // 随机偏移范围系数，默认0.5（半个字符宽度/高度）
});