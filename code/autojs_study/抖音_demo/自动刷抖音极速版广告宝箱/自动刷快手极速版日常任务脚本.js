/**
 * 今天 Forece 做了一个简单利用 Auto.js 来实现快手极速版每日自动看广告赚金币的这么一个脚本。快手极速版日常任务中，有一个看广告领金币的任务，通过看15 - 30 秒左右的广告，拿到一定的金币。虽然不是很多。但是把这个任务做完也需要耗费最少5分钟的时间，通过脚本自动化，可以直接让手机挂机自动看广告。
 * 
 * Project: 快手福利任务
 * Author: Forece
 * Description: 自动化执行快手每日福利任务
 * Auto.js 版本: 4.1.1 Alpha2



*/

function runTask() {
    text('福利').findOne().click()
    sleep(35000)
    back()
    sleep(1000)
    if (text('放弃奖励').exists()) {
        text('放弃奖励').click()
        sleep(1000)
    }
    if (text('再看一个').exists()) {
        text('再看一个').click()
        sleep(35000)
        back()
        sleep(1000)
        if (text('放弃奖励').exists()) {
            text('放弃奖励').click()
            sleep(1000)
        }
    }
}

for (var i = 0; i < 10; i++) {
    runTask()
}