//auto.waitFor();
auto();
/**
 * =============== 配置区 ===============
 * OCR.space / (a9t9) Free OCR API
 * Endpoint: https://api.ocr.space/parse/image
 */
const OCR_API_ENDPOINT = "https://api.ocr.space/parse/image"; // ([Online OCR](https://onlineocr.a9t9.com/OCRAPI))
const API_KEY = "helloworld"; // <- 改成你的 key（也可先试试 "helloworld"）

/**
 * 通过 OCR 找到包含 targetText 的文字片段，计算片段宽度，
 * 按 (片段宽度 * moveUnits) 向 moveDir 偏移后点击。
 *
 * @param {string} targetText 目标字符串，默认 "领取成功"
 * @param {string} moveDir    方向: "right"|"left"|"up"|"down"，默认 "right"
 * @param {number} moveUnits  移动单位(按“片段宽度倍数”)，默认 1；你要“2个宽度”就传 2
 * @param {number} threshold  匹配阈值(0~1)，默认 0.8（用 OCR 置信度估算）
 * @param {object} opt        可选参数：{language, ocrEngine, timeoutMs, intervalMs, debugToast}
 * @returns {boolean}         是否成功找到并点击
 */
function ocrOffsetClick(targetText, moveDir, moveUnits, threshold, opt) {
    targetText = targetText || "领取成功";
    moveDir = moveDir || "right";
    moveUnits = (moveUnits == null) ? 1 : moveUnits;
    threshold = (threshold == null) ? 0.8 : threshold;

    opt = opt || {};
    const language = opt.language || "chs";     // 中文简体 chs ([Online OCR](https://onlineocr.a9t9.com/OCRAPI))
    const ocrEngine = opt.ocrEngine || 1;      // 1 or 2
    const timeoutMs = opt.timeoutMs || 8000;
    const intervalMs = opt.intervalMs || 300;
    const debugToast = !!opt.debugToast;

    // 1) 请求截图权限（首次会弹窗，系统限制无法绕过）
    // Auto.js 4.1 兼容处理
    if (!requestScreenCapture()) {
        toast("请求截图权限失败");
        return false;
    }

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        // 2) 自动截图
        const img = captureScreen();
        if (!img) {
            sleep(intervalMs);
            continue;
        }

        // 3) OCR 识别并查找目标片段 bbox
        let hit = null;
        try {
            const ocrJson = ocrDetect(img, {
                apiKey: API_KEY,
                language: language,
                ocrEngine: ocrEngine,
                isOverlayRequired: true
            });

            hit = findSubstringBoxFromOcrSpace(ocrJson, targetText, threshold);
        } catch (e) {
            if (debugToast) toast("OCR异常: " + e);
            // OCR失败就继续重试
        } finally {
            img.recycle();
        }

        if (hit) {
            // hit: {left, top, right, bottom, text, score}
            const w = hit.right - hit.left;
            const h = hit.bottom - hit.top;

            const cx = hit.left + w / 2;
            const cy = hit.top + h / 2;

            const dist = w * moveUnits; // 你要“向右 2个宽度” => moveUnits=2

            let dx = 0, dy = 0;
            switch (moveDir) {
                case "right": dx = dist; break;
                case "left": dx = -dist; break;
                case "down": dy = dist; break; // 若你希望按高度倍数，可改为: h * moveUnits
                case "up": dy = -dist; break;
                default: dx = dist; break;
            }

            const tx = Math.round(cx + dx);
            const ty = Math.round(cy + dy);

            click(tx, ty);

            if (debugToast) {
                toast("命中: " + hit.text + " score=" + hit.score.toFixed(2));
            }
            return true;
        }

        sleep(intervalMs);
    }

    toast("超时未识别到: " + targetText);
    return false;
}

/**
 * 调用 (a9t9) OCR.space 在线接口进行识别
 * - 使用 base64Image 方式提交截图
 * - 开启 isOverlayRequired=true 获取 word bbox 坐标 ([Online OCR](https://onlineocr.a9t9.com/OCRAPI))
 *
 * @param {Image} img
 * @param {object} p {apiKey, language, ocrEngine, isOverlayRequired}
 * @returns {object} OCR.space JSON
 */
function ocrDetect(img, p) {
    if (!p || !p.apiKey || (p.apiKey === "842fc99ca688957" && p.apiKey !== "helloworld")) {
        // 你可以先把 API_KEY 改为 "helloworld" 试运行，但建议换成自己的key
        // 文档说明需要 API key ([Online OCR](https://onlineocr.a9t9.com/OCRAPI))
        throw new Error("请先设置 API_KEY（OCR.space/a9t9 的 API key）");
    }

    // Auto.js: 图片转 base64（png）
    // images.toBase64 通常返回不带 data: 前缀的 base64，我们手动补上更稳
    const b64 = images.toBase64(img, "png", 100);
    const base64Image = "data:image/png;base64," + b64;

    // 组装表单参数
    const form = {
        language: p.language || "chs",
        isOverlayRequired: String(!!p.isOverlayRequired), // "true"/"false"
        OCREngine: String(p.ocrEngine || 1),
        base64Image: base64Image
    };

    // OCR.space 文档提示 apikey 发送在 header（也有示例用表单字段；这里按文档走 header）([Online OCR](https://onlineocr.a9t9.com/OCRAPI))
    let res;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
        try {
            // 设置请求超时
            const requestTimeout = setTimeout(() => {
                throw new Error("网络请求超时");
            }, 10000); // 10秒超时

            res = http.post(OCR_API_ENDPOINT, form, {
                headers: {
                    apikey: p.apiKey
                }
            });

            clearTimeout(requestTimeout);
            break;
        } catch (e) {
            retryCount++;
            if (retryCount > maxRetries) {
                throw new Error("网络请求失败: " + e.message);
            }
            sleep(1000); // 重试前等待1秒
        }
    }

    if (!res) throw new Error("http.post 返回空");
    if (res.statusCode != 200) {
        throw new Error("HTTP状态码: " + res.statusCode + " body=" + safeBody(res));
    }

    const bodyStr = safeBody(res);
    let json;
    try {
        json = JSON.parse(bodyStr);
    } catch (e) {
        throw new Error("JSON解析失败: " + e + " body=" + bodyStr);
    }

    // OCR.space 常见失败标志：IsErroredOnProcessing / ErrorMessage
    if (json && json.IsErroredOnProcessing) {
        const msg = (json.ErrorMessage && json.ErrorMessage.join) ? json.ErrorMessage.join(" | ") : String(json.ErrorMessage || "未知错误");
        throw new Error("OCR处理失败: " + msg);
    }

    return json;
}

function safeBody(res) {
    try {
        return res.body.string();
    } catch (e) {
        try { return String(res.body); } catch (e2) { return ""; }
    }
}

/**
 * 在 OCR.space 返回的 overlay 里，查找“包含 targetText 的片段”，并返回该片段 bbox
 *
 * OCR.space overlay 结构通常在:
 * json.ParsedResults[0].TextOverlay.Lines[].Words[]
 * 每个 Word 通常包含: WordText, Left, Top, Width, Height, (Confidence)
 *
 * @param {object} ocrJson OCR.space JSON
 * @param {string} targetText
 * @param {number} threshold 0~1
 * @returns {object|null} {left, top, right, bottom, text, score}
 */
function findSubstringBoxFromOcrSpace(ocrJson, targetText, threshold) {
    // 容错处理：检查必要的字段
    if (!ocrJson || typeof ocrJson !== 'object') return null;
    if (!ocrJson.ParsedResults || !Array.isArray(ocrJson.ParsedResults) || ocrJson.ParsedResults.length === 0) return null;

    // 只取第一页/第一张（如你要多页可扩展循环 ParsedResults）
    const pr = ocrJson.ParsedResults[0];
    if (!pr) return null;
    
    const overlay = pr.TextOverlay;
    if (!overlay || !overlay.Lines || !Array.isArray(overlay.Lines) || overlay.Lines.length === 0) return null;

    let best = null;

    for (let li = 0; li < overlay.Lines.length; li++) {
        const line = overlay.Lines[li];
        if (!line) continue;
        
        const words = line.Words || [];
        if (!Array.isArray(words) || words.length === 0) continue;

        // 拼接整行文本，并记录每个 word 的字符区间
        let lineText = "";
        const spans = []; // [{start,end,left,top,right,bottom,conf}]
        for (let wi = 0; wi < words.length; wi++) {
            const w = words[wi];
            if (!w) continue;
            
            const wt = (w.WordText == null) ? "" : String(w.WordText);
            const start = lineText.length;
            lineText += wt;
            const end = lineText.length;

            // 容错处理：确保坐标值有效
            const left = Number(w.Left) || 0;
            const top = Number(w.Top) || 0;
            const width = Number(w.Width) || 0;
            const height = Number(w.Height) || 0;
            const right = left + width;
            const bottom = top + height;

            // OCR.space 的 Confidence 常见是 0~100（也可能没有）
            let conf = w.Confidence;
            if (conf == null && w.ConfidenceLevel != null) conf = w.ConfidenceLevel;
            conf = (conf == null) ? null : Number(conf);

            spans.push({
                start: start,
                end: end,
                left: left,
                top: top,
                right: right,
                bottom: bottom,
                conf: conf
            });
        }

        // 容错处理：使用更宽松的文本匹配
        const normalizedLineText = lineText.replace(/\s+/g, '');
        const normalizedTargetText = targetText.replace(/\s+/g, '');
        const idx = normalizedLineText.indexOf(normalizedTargetText);
        if (idx < 0) continue;

        const targetStart = idx;
        const targetEnd = idx + normalizedTargetText.length;

        // 找覆盖该 substring 的 spans
        let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
        let confSum = 0, confCnt = 0;

        for (let si = 0; si < spans.length; si++) {
            const s = spans[si];
            // span 与目标区间有交集
            const overlap = !(s.end <= targetStart || s.start >= targetEnd);
            if (!overlap) continue;

            minL = Math.min(minL, s.left);
            minT = Math.min(minT, s.top);
            maxR = Math.max(maxR, s.right);
            maxB = Math.max(maxB, s.bottom);

            if (s.conf != null && !isNaN(s.conf)) {
                confSum += s.conf;
                confCnt += 1;
            }
        }

        if (!isFinite(minL)) continue;

        // 计算 score：把 0~100 的平均置信度映射到 0~1
        let score = 1.0;
        if (confCnt > 0) score = (confSum / confCnt) / 100.0;

        if (score < threshold) continue;

        const hit = {
            left: minL,
            top: minT,
            right: maxR,
            bottom: maxB,
            text: targetText,
            score: score
        };

        if (!best || hit.score > best.score) best = hit;
    }

    return best;
}

/** ========== 示例调用 ========== */
// 你的要求：识别“领取成功”，向右移动 2 个“字符串宽度”，点击，阈值 0.8
// ocrOffsetClick("领取成功", "right", 2, 0.8, { language: "chs", ocrEngine: 1, debugToast: const ok = 
ocrOffsetClick("示例代码", "right", 1 ,0.8, {

    language: "chs",
    ocrEngine: 1,
    timeoutMs: 10000,
    intervalMs: 350,
    debugToast: true
});

log("ocrOffsetClick result = " + ok);