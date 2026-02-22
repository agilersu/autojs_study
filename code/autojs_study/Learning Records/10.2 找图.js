
// 请求截图权限
requestScreenCapture();

// 等待1秒确保屏幕稳定
sleep(1000);

// 截取当前屏幕
var screenshot = captureScreen();

// 读取需要查找的小图（确保路径正确）
var template = images.read("/storage/emulated/0/脚本/找图/aaa.jpg");
if (!template) {
    toast("小图读取失败");
    exit();
}

// 在指定区域查找小图
var region = [340, 540, 300, 300];  // [x, y, width, height]
var point = findImage(screenshot, template, { region: region });

// 回收图片资源
images.recycle(screenshot);
images.recycle(template);

// 根据查找结果执行操作
if (point) {
    // 点击位置向左偏移200像素
    click(point.x - 200, point.y);
    toast("找到目标位置: " + point.x + "," + point.y);
} else {
    toast("未找到匹配图像");
}



/* 
这是一个用于Auto.js 4.1的找图脚本。代码中使用了findImage函数在指定区域内查找小图，并根据结果执行点击操作。然而，代码中存在几个问题需要修正：
变量名使用中文：虽然Auto.js支持中文变量名，但为了代码的通用性和可维护性，建议使用英文变量名（除非用户明确要求中文）。但这里用户没有特别要求，我们可以保留中文变量名，但要注意代码中变量名的一致性（比如“大图”和“小图”在后面的使用中要保持一致）。
findImage函数的使用：在Auto.js 4.1中，findImage函数返回的是一个Match对象，该对象包含匹配的位置和相似度等信息。因此，我们需要判断是否找到匹配，然后从Match对象中获取坐标点。但是，原代码中直接使用了p.x和p.y，这是正确的，因为findImage返回的匹配对象有x和y属性。
var p = findImage(大图, 小图, { region: [340, 540, 300, 300] });在“大图”的指定区域（左上角坐标(340,540)，宽度300像素，高度300像素）内查找“小图”。如果找到，返回匹配位置的坐标点；否则返回null。


点击偏移：代码中点击的位置是(p.x-200, p.y)，即找到的匹配点向左偏移200像素。这个偏移量需要根据实际需求调整。
资源释放：读取的小图片（小图）在使用后应该及时回收，以避免内存泄漏。在Auto.js中，可以使用images.recycle(小图)来回收图片。
异常处理：读取图片时，如果文件不存在或读取失败，应该进行错误处理。
区域参数：region参数是一个数组，指定了[x, y, width, height]，代码中给出的区域是[340,540,300,300]，这是正确的。
截图回收：同样，截取的大图也应该回收。但是，在Auto.js中，captureScreen()返回的是Image对象，使用后需要回收

*/