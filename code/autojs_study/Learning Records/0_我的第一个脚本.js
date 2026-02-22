// 在脚本开头添加环境检查代码
log("=== 环境检查 ===");
log("typeof auto: " + typeof auto);
log("typeof automator: " + typeof automator);
log("typeof org.autojs: " + typeof org);
log("typeof devices: " + typeof devices);
log("typeof app: " + typeof app);
log("UI版本: " + (ui ? "存在" : "不存在"));

// 检查选择器API
log("text函数: " + (typeof text !== "undefined" ? "存在" : "不存在"));
log("Text函数: " + (typeof Text !== "undefined" ? "存在" : "不存在"));

// 检查应用上下文
try {
    log("当前包名: " + context.getPackageName());
} catch(e) {
    log("获取包名错误: " + e);
}

log("=== 检查结束 ===");