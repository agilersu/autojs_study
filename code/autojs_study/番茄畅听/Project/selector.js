module.exports = {
    // 签到相关控件
    signIn: {
        // 签到按钮可能出现的多种文本
        button: () => textMatches(/.*签到.*|.*立即签到.*/).findOne(3000),
        // 签到成功的确认标识
        successIndicator: () => textMatches(/.*签到成功.*|.*已签到.*/).findOne(3000)
    },

    // 视频任务相关
    videoTask: {
        // 视频任务入口
        entry: () => textMatches(/.*看视频.*|.*视频奖励.*/).findOne(3000),
        // 视频播放区域（用于关闭广告等）
        videoArea: () => className("android.view.View").depth(10).findOne(2000)
    },

    // 阅读任务相关
    readTask: {
        entry: () => textMatches(/.*阅读.*|.*阅读奖励.*/).findOne(3000),
        contentArea: () => className("android.widget.TextView").depth(8).findOne(3000)
    },

    // 通用关闭按钮（用于弹窗、广告等）
    closeButtons: () => descMatches("关闭|取消|×").findOne(2000)
};