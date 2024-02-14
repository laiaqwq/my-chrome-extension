function dataURLtoFile(dataurl, filename) {
    
    let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function asyncDesktop(currentScreen) {
    const position = {top:-(screenY-currentScreen.currentScreen.availTop)-(window.outerHeight - window.innerHeight),
        left:-(screenX-currentScreen.currentScreen.availLeft)-18};

    $(".bgo").css(position);
    // $(".bgo").height(screen.height); 
    // $(".bgo").width(screen.width);
    $(".bgo").height(currentScreen.currentScreen.height); 
    $(".bgo").width(currentScreen.currentScreen.width+20);
}

async function getScreens(){
    const ScreenDetails = await window.getScreenDetails();
    console.log(ScreenDetails);
    return ScreenDetails;
}



function loadSetting() {
    chrome.storage.local.get(['backgrondsetting'], function(result){
        let setting = result.backgrondsetting;
        switch(setting) {
            case "default":
                break;
            case "remote-url":
                $('input[value="remote-url"]').prop("checked", "checked");
                chrome.storage.local.get(['remoteurl'], function(result){
                    $('.bgo-img')[0].style.backgroundImage = `url(${result.remoteurl})`;
                });
                //$('.bgo')[0].style.backgroundImage = `url(${url})`
                break;
            case "local-url":
                $('input[value="local-url"]').prop("checked", "checked");
                //选择了本地图片
                chrome.storage.local.get(['key'], function(result) {
                    //console.log(result.key);
                    let file = dataURLtoFile(result.key, "img");
                    //console.log(file)
                    var url = URL.createObjectURL(file);
                    $('.bgo-img')[0].style.backgroundImage = `url(${url})`;
                });
                break;
            default:
            // code block
        }
    });
    chrome.storage.local.get(["remoteurl"]).then((result) => {
        console.log("remoteurl currently is " + result.remoteurl);
    });
    chrome.storage.local.get(["ifupdataAsyncDesktop"]).then(async (result) => {
        //console.log("ifupdataAsyncDesktop currently is " + result.ifupdataAsyncDesktop.value);
        ifupdataAsyncDesktop = result.ifupdataAsyncDesktop.value;
        $("#asyncdesktop").prop('checked',result.ifupdataAsyncDesktop.value);
        if (ifupdataAsyncDesktop){
            $(".bgo").addClass("updataAsyncDesktop");
            const ScreenDetails = await getScreens();
            asyncDesktop(ScreenDetails);
            // windows moved to other screen
            ScreenDetails.addEventListener('currentscreenchange', (event) => {
                asyncDesktop(ScreenDetails);
            });
            chrome.windows.onBoundsChanged.addListener(
                (event) => {
                    asyncDesktop(ScreenDetails);
                    //console.log("Listener,onBoundsChanged");
                }
            )
            window.addEventListener("resize",()=>{
                setTimeout(asyncDesktop, 200, ScreenDetails);
            })
            document.addEventListener("visibilitychange",()=>{
                setTimeout(asyncDesktop, 50, ScreenDetails);
                
                //console.log("Listener,visibilitychange");
            })

        }

    });


    
}

$(document).ready(function() {
    loadSetting();
    
    $("#menu").click(function(event) {
        $(this).toggleClass('on');
        $(".list").toggleClass('closed');
        //$("iframe").css("left","10%");
    });
    $("#guide-menu").click(function(event) {
        $(this).toggleClass('guide-opened');
        $(".iframe-guide").toggleClass('on');
        $("#search").fadeToggle();  
    })

    //本地上传图像
    function updateImageDisplay() {
        console.log("local-file");
        let img = $("#local-file")[0].files[0];
        let imgdate = new FileReader;
        imgdate.readAsDataURL(img);
        imgdate.onloadend = function () {
            chrome.storage.local.set({key: imgdate.result}, function() {
                //console.log(imgdate.result);

            });
        }

    }

    //远程地址改变
    function updateRemoteUrl() {
        console.log("updateRemoteUrl");
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        if (objExp.test(this.value) == true) {
            chrome.storage.local.set({remoteurl: this.value}, function() {
                console.log(this.value);
            });
        }
    }

    function updataAsyncDesktop() {
        console.log("updataAsyncDesktop");
        let value = $("#asyncdesktop")[0].checked;
        chrome.storage.local.set({ ifupdataAsyncDesktop: {value:value} }).then(() => {
            console.log("Value is set");
        });
        getScreens();
    }

    //事件监听
    $("#local-file").change(updateImageDisplay);//本地上传图像
    $("#remote-url").change(updateRemoteUrl);//远程地址改变
    $("#asyncdesktop").change(updataAsyncDesktop);
    //监听背景图片设置选项改变
    $('input[name="backgrond-setting"]').change(function() {
        //$.cookie('backgrondsetting', this.value);//cookie无法重启后保存
        //测试成功控制台无法调试
        chrome.storage.local.set({backgrondsetting:this.value}, function() {
            //console.log(imgdate.result);
        });
    });
});
