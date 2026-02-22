// ========== 优化后的脚本 ==========
const MAX_RETRY = 3;  // 最大重试次数
let retryCount = 0;

function unlockDevice() {
    // 1. 屏幕状态检测
    if (!device.isScreenOn()) {
        toastLog("检测到屏幕关闭，开始唤醒流程");

        // 2. 双重唤醒机制
        device.wakeUp();
        if (!device.waitForScreenOn(2000)) {  // 2秒内检测屏幕是否亮起
            device.wakeUpIfNeeded();
            sleep(1500);
        }

        // 3. 滑动解锁（带异常处理）
        try {
            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.2, 400);
            sleep(800);  // 增加等待时间确保解锁界面加载

            // 4. 智能密码输入（适配不同设备）
            const password = [1, 2, 3, 4];  // 实际密码序列
            password.forEach(num => {
                const btn = descContains(String(num)).findOne(1000);
                if (btn) {
                    btn.click();
                    sleep(300);  // 按键间隔
                } else {
                    throw new Error("密码按钮未找到: " + num);
                }
            });

            toastLog("解锁成功");
            return true;
        } catch (e) {
            toastLog("解锁失败: " + e);
            return false;
        }
    }
    return true;  // 屏幕已开启
}

// ========== 主执行流程 ==========
while (retryCount < MAX_RETRY) {
    if (unlockDevice()) {
        // 5. 延迟启动主脚本（确保系统稳定）
        sleep(2000);
        engines.execScriptFile("测试.js");
        break;
    }
    retryCount++;
    sleep(2000);  // 失败后等待重试
}

if (retryCount >= MAX_RETRY) {
    toastLog("解锁失败，终止流程");
}

/* 

智能唤醒机制
新增 device.waitForScreenOn()检测唤醒状态
动态调整等待时间（1500ms → 2000ms）
添加唤醒状态日志提示
自适应滑动解锁
使用 device.width / height替代固定坐标
按屏幕比例计算滑动位置（90 % → 20 % 高度）
增加滑动后的等待时间（400ms → 800ms）
健壮的密码输入
改用 descContains()更宽松的匹配方式
添加按钮存在性检测（1000ms超时）
支持自定义密码序列（可配置数字 / 图案）
错误处理与重试
添加 try-catch 异常捕获
实现最多3次的重试机制
失败时显示具体错误原因
执行流程优化
封装解锁操作为独立函数
主脚本启动前增加2秒稳定等待
完全失败时终止流程避免无限循环
使用建议：
将 password数组替换为实际密码描述（如数字密码用["1", "2", "3", "4"]，图案密码用["左上", "右上", "左下", "右下"]）
不同品牌设备可能需要调整滑动速度（300 - 500ms）
在真机测试时逐步调整等待时间参数
复杂解锁界面可添加 className("android.widget.Button")等多条件选择器
 */