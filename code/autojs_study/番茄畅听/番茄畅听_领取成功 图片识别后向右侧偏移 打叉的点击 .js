auto();
requestScreenCapture();

// 查找"领取成功"
function findTarget() {
    // 尝试多种方式
    let target = null;
    
    // 1. 通过控件
    target = descStartsWith("领取成功").findOne(1000);
    if (target) return {type: "control", obj: target};
    
    target = textStartsWith("领取成功").findOne(1000);
    if (target) return {type: "control", obj: target};
    
    // 2. 通过图片（需要模板图片）
    if (images.requestScreenCapture()) {
        let screen = captureScreen();
        let template = images.read("./lingquchenggong.png");
        if (template) {
            let pos = images.findImage(screen, template, {threshold: 0.7});
            if (pos) {
                return {type: "image", pos: pos, width: template.getWidth(), height: template.getHeight()};
            }
        }
    }
    
    return null;
}

// 计算合理的点击位置
function calculateClickPosition(targetInfo) {
    let clickX, clickY;
    
    if (targetInfo.type === "control") {
        let bounds = targetInfo.obj.bounds();
        clickY = bounds.centerY();
        
        // 自动估算字符宽度
        // 假设"领取成功"是4个字符，计算平均字符宽度
        let avgCharWidth = bounds.width() / 4;
        
        // 右侧移动2个英文字符，假设英文字符宽度是汉字的一半
        let englishCharWidth = avgCharWidth / 2;
        clickX = bounds.right + (2 * englishCharWidth);
        
        toastLog("控件位置: 宽" + bounds.width() + ", 估算英文字符宽: " + englishCharWidth.toFixed(1));
    } else if (targetInfo.type === "image") {
        clickY = targetInfo.pos.y + targetInfo.height / 2;
        
        // 对于图片，使用经验值
        let englishCharWidth = 10; // 假设英文字符宽度为10像素
        clickX = targetInfo.pos.x + targetInfo.width + (2 * englishCharWidth);
        
        toastLog("图片位置: 宽" + targetInfo.width + ", 使用固定英文字符宽: " + englishCharWidth);
    }
    
    // 边界检查
    clickX = Math.max(20, Math.min(clickX, device.width - 20));
    clickY = Math.max(20, Math.min(clickY, device.height - 20));
    
    return {x: clickX, y: clickY};
}

// 主程序
toastLog("开始执行");
let targetInfo = findTarget();

if (targetInfo) {
    toastLog("找到目标，类型: " + targetInfo.type);
    
    let clickPos = calculateClickPosition(targetInfo);
    toastLog("计算点击位置: (" + clickPos.x.toFixed(0) + ", " + clickPos.y.toFixed(0) + ")");
    
    // 显示点击位置（调试用）
    // toastAt("点击这里", clickPos.x, clickPos.y);
    
    // 点击操作
    sleep(500);
    click(clickPos.x, clickPos.y); // 可增加随机偏移，模拟真人点击
    toastLog("点击完成");
    
    // 验证点击是否成功（可选）
    sleep(1000);
    // 这里可以添加验证逻辑
} else {
    toastLog("未找到目标");
}