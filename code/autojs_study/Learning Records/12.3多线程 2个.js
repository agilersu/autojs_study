// 导入Auto.js线程模块
/* 代码创建了两个线程，分别命名为“应用”和“雷军”。每个线程执行一个无限循环，不断在屏幕上查找对应的文本（“应用”或“雷军”），找到后打印日志并休眠1秒。注释部分说明了线程的停止方法：通过雷军.interrupt()可以停止“雷军”这个特定线程，而threads.shutdownAll()则可以停止所有线程。这段代码可能用于自动化测试或界面监控场景，但需要注意线程是无限循环的，必须通过中断或关闭操作来终止，否则程序会持续运行。
 */
// 创建第一个线程（命名为"应用"）
var thread1 = threads.start(function () {
    // 设置线程名称（便于调试识别）
    threads.currentThread().setName("应用");

    // 无限循环：持续监控屏幕内容
    while (true) {
        // 核心功能：在屏幕上查找"应用"文本
        if (text("应用").findOnce()) {
            // 找到目标时打印日志（带线程名和时间戳）
            log("线程[" + threads.currentThread().getName() + "]发现目标: 应用 " + new Date());
        }

        // 每次循环后休眠1000毫秒（1秒）
        sleep(1000);
    }
});

// 创建第二个线程（命名为"雷军"）
var thread2 = threads.start(function () {
    threads.currentThread().setName("雷军");

    while (true) {
        // 查找屏幕上的"雷军"文本
        if (text("雷军").findOnce()) {
            log("线程[" + threads.currentThread().getName() + "]发现目标: 雷军 " + new Date());
        }
        sleep(1000);
    }
});

/* 
 * 线程控制方法说明：
 * 
 * 1. 停止特定线程（如停止"雷军"线程）：
 *    thread2.interrupt();  // 调用线程对象的interrupt()方法
 * 
 * 2. 停止所有活动线程：
 *    threads.shutdownAll();  // 全局线程管理方法
 * 
 * 3. 注意事项：
 *    - 线程使用无限循环需确保有终止机制
 *    - 未处理的异常会导致线程崩溃
 *    - 频繁截图可能影响性能
 */