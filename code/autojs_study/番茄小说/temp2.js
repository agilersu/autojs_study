"auto";

let umiOcrConfig = {
    baseUrl: "http://192.168.2.100:1224",
    options: {}
};

function clickText(targetText) {
    if (!requestScreenCapture(false)) {
        return false;
    }

    sleep(500);

    let img = captureScreen();
    if (!img) {
        return false;
    }

    let base64Img = images.toBase64(img, "png");
    if (base64Img.indexOf(",") !== -1) {
        base64Img = base64Img.split(",")[1];
    }

    try {
        let url = umiOcrConfig.baseUrl + "/api/ocr";
        let requestBody = {
            base64: base64Img,
            options: umiOcrConfig.options
        };

        let res = http.postJson(url, requestBody);
        if (res.statusCode != 200) {
            return false;
        }

        let json = res.body.json();
        if (json.code != 100) {
            return false;
        }

        let result = json.data;
        if (!result || result.length === 0) {
            return false;
        }

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
            return null;
        }

        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            let text = item.text || "";
            if (!text) continue;

            if (text.indexOf(targetText) !== -1) {
                let box = getBox(item);
                if (box) {
                    let clickX = box.x + box.w / 2;
                    let clickY = box.y + box.h / 2;
                    press(clickX, clickY, 50);
                    return true;
                }
            }
        }

        return false;

    } catch (e) {
        return false;
    }
}

clickText("通讯录");