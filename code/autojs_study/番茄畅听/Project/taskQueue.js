module.exports = {
    tasks: [],

    // 添加任务到队列
    addTask: function (name, taskFunction) {
        this.tasks.push({ name, taskFunction });
    },

    // 执行所有任务
    runAll: function () {
        const config = require('./config.js');
        const utils = require('./utils.js');

        console.log("🚀 开始执行任务队列，共 " + this.tasks.length + " 个任务");

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            console.log(`\n📋 任务 ${i + 1}/${this.tasks.length}: ${task.name}`);

            let success = false;
            let retryCount = 0;

            // 任务重试逻辑
            while (!success && retryCount < config.retry.maxRetries) {
                if (retryCount > 0) {
                    console.log(`🔄 第 ${retryCount + 1} 次重试`);
                }

                try {
                    success = task.taskFunction();
                    if (success) {
                        console.log("✅ 任务完成: " + task.name);
                    } else {
                        console.warn("⚠️ 任务执行失败: " + task.name);
                    }
                } catch (e) {
                    console.error("❌ 任务执行异常: " + e.message);
                }

                if (!success) {
                    retryCount++;
                    if (retryCount < config.retry.maxRetries) {
                        sleep(config.retry.retryDelay);
                    }
                }
            }

            // 任务间隔
            if (i < this.tasks.length - 1) {
                utils.randomPause();
                utils.randomDelay(config.timings.taskInterval, config.timings.taskInterval + 2000);
            }
        }

        console.log("\n🎉 所有任务执行完毕");
    }
};