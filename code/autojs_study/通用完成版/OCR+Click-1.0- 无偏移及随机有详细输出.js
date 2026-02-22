auto;

let umiOcrConfig = {
    baseUrl: "http://192.168.2.100:1224",
    options: {}
};

function clickText(targetText) {
    console.log("\n====== 查找并点击文字：" + targetText + " ======");

    if (!requestScreenCapture(false)) {
        console.error("请求截屏权限失败");
        return false;
    }

    sleep(500);

    let img = captureScreen();
    if (!img) {
        console.error("截图失败");
        return false;
    }

    console.log("截图成功");

    let base64Img = images.toBase64(img, "png");
    if (base64Img.indexOf(",") !== -1) {
        base64Img = base64Img.split(",")[1];
    }

    console.log("Base64转换完成");

    try {
        console.log("开始OCR识别...");
        let url = umiOcrConfig.baseUrl + "/api/ocr";
        let requestBody = {
            base64: base64Img,
            options: umiOcrConfig.options
        };

        let res = http.postJson(url, requestBody);
        if (res.statusCode != 200) {
            console.error("HTTP请求失败，状态码：" + res.statusCode);
            return false;
        }

        let json = res.body.json();
        if (json.code != 100) {
            console.error("OCR错误，code：" + json.code);
            return false;
        }

        let result = json.data;
        if (!result || result.length === 0) {
            console.error("未识别到文字");
            return false;
        }

        console.log("OCR识别成功，共识别到" + result.length + "个文字块");

        function getBox(item) {
            if (item.box && item.box.length === 4) {
                let box = item.box;
                if (Array.isArray(box[0]) && box[0].length === 2) {
                    let xs = [box[0][0], box[1][0], box[2][0], box[3][0]];
                    let ys = [box[0][1], box[1][1], box[2][1], box[3][1]];
                    return {
                        x: Math.min.apply(null, xs),
                        y: Math.min.apply(null, ys),
                        w: Math.max.apply(null, xs) - Math.min.apply(null, xs),
                        h: Math.max.apply(null, ys) - Math.min.apply(null, ys)
                    };
                }
            }

            if (item.box && item.box.length >= 8) {
                let xs = [item.box[0], item.box[2], item.box[4], item.box[6]];
                let ys = [item.box[1], item.box[3], item.box[5], item.box[7]];
                return {
                    x: Math.min.apply(null, xs),
                    y: Math.min.apply(null, ys),
                    w: Math.max.apply(null, xs) - Math.min.apply(null, xs),
                    h: Math.max.apply(null, ys) - Math.min.apply(null, ys)
                };
            }

            if (item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
                return {
                    x: item.x,
                    y: item.y,
                    w: item.w,
                    h: item.h
                };
            }

            if (item.left !== undefined && item.top !== undefined && item.width !== undefined && item.height !== undefined) {
                return {
                    x: item.left,
                    y: item.top,
                    w: item.width,
                    h: item.height
                };
            }

            console.error("无法解析位置信息");
            return null;
        }

        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            let text = item.text || "";
            if (!text) continue;

            if (text.indexOf(targetText) !== -1) {
                console.log("找到目标文字：" + text);
                let box = getBox(item);
                if (box) {
                    console.log("位置信息：x=" + box.x + ", y=" + box.y + ", w=" + box.w + ", h=" + box.h);
                    let clickX = box.x + box.w / 2;
                    let clickY = box.y + box.h / 2;
                    console.log("准备点击坐标：(" + clickX.toFixed(1) + ", " + clickY.toFixed(1) + ")");
                    press(clickX, clickY, 50);
                    console.log("点击成功！");
                    return true;
                } else {
                    console.error("获取位置失败，继续查找...");
                }
            }
        }

        console.error("未找到文字：" + targetText);
        console.log("\n识别到的所有文字：");
        for (let i = 0; i < result.length; i++) {
            console.log("  [" + i + "] " + (result[i].text || ""));
        }
        return false;

    } catch (e) {
        console.error("调用OCR失败：" + e);
        console.error("错误堆栈：" + e.stack);
        return false;
    }
}

clickText("通讯录");
sleep(1000);
clickText("新的");
sleep(1000);
clickText("AA");
sleep(1000);
clickText("添加到通讯录");
sleep(1000);
clickText("发送");

