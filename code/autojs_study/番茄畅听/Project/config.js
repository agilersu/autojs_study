module.exports = {
    // 应用包名
    packageName: "com.changting.android.app",

    // 任务开关
    tasks: {
        enableSignIn: true,      // 启用签到
        enableWatchVideo: true,  // 启用看视频
        enableRead: true         // 启用阅读奖励
    },

    // 时间配置（毫秒）
    timings: {
        pageLoadDelay: 3000,     // 页面加载等待时间
        afterClickDelay: {        // 点击后的随机延迟范围
            min: 1500,
            max: 3000
        },
        taskInterval: 5000       // 任务间基础间隔
    },

    // 重试配置
    retry: {
        maxRetries: 3,           // 最大重试次数
        retryDelay: 2000         // 重试间隔
    },

    // 模拟人工参数
    humanSimulation: {
        coordinateOffset: 5,     // 点击坐标随机偏移量
        swipeSpeedVariation: 0.3 // 滑动速度变化范围
    }
};