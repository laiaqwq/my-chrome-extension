function isActive() {
    //最后的操作时间
    var lastTime = new Date().getTime();
    var currentTime = new Date().getTime();
    //设置超时时间： 1分
    
    var timeOut = 1 * 60 * 1000;

    window.onload = function() {
        /* 检测鼠标移动事件 */
        document.addEventListener('mousemove', function() {
            // 更新最后的操作时间
            lastTime = new Date().getTime();
        })
    }

    /* 定时器  间隔5秒，检测是否长时间未操作页面  */
    var quitTime = window.setInterval(testTime, 5*1000);

    // 超时函数
    function testTime() {
        //更新当前时间
        currentTime = new Date().getTime();
        console.log('currentTime', currentTime)
        //判断是否超时
        if (currentTime - lastTime > timeOut) {
            // console.log('超时拉')
            // 超时操作
            
            // 清除掉定时器
            window.clearInterval(quitTime);
        }
    }

    
}



isActive();