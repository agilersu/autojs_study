if (!requestScreenCapture()) {
    alert("请求截图失败");
    exit();
}
//需要加个延迟，不然会截到请求权限的弹窗
sleep(2000)
// 设置图片路径
var path = "/sdcard/待识别图片.jpg";
// 截图保存
var 截图保存 = captureScreen(path);
if (!截图保存) {
    console.error("截图保存失败，请检查是否有权限");
    exit();
}
// OCR 接口链接
var url = "http://192.168.2.100:1224/api/ocr";
// 获取图片的 Base64 编码
var b64 = images.toBase64(images.read(path));
// 发送 HTTP POST 请求
var response = http.postJson(url, {
    "base64": b64
});
var res = response.body.json();
// 打印响应结果
console.log(res)
// 处理响应
if (res.code == 100) {
    console.log("成功识别到文字！");
    for (var i = 0; i < res.data.length; i++) {
        var 坐标数组 = res.data[i].box;
        var 左上 = 坐标数组[0];
        var 右下 = 坐标数组[2];
        console.log("文字：", res.data[i].text, "，范围为：", 左上[0], 左上[1], 右下[0], 右下[1]);
    }
} else if (res.code == 300) {
    console.log("base64解码失败！");
} else if (res.code == 101) {
    console.log("并没有识别到文字！");
} else {
    console.log("识别失败，请检查res报错");
}