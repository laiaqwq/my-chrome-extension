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

$(document).ready(function() {
    chrome.storage.local.get(['backgrondsetting'], function(result){
        let setting = result.backgrondsetting;
        switch(setting) {
            case "default":
                break;
            case "remote-url":
                $('input[value="remote-url"]').prop("checked", "checked");
                chrome.storage.local.get(['remoteurl'], function(result){
                    $('.bgo')[0].style.backgroundImage = `url(${result.remoteurl})`;
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
                    $('.bgo')[0].style.backgroundImage = `url(${url})`;
                });
                break;
            default:
            // code block
        }
    });
    chrome.storage.local.get(['remoteurl'], function(result){
        //console.log('result');
        $("#remote-url").val(result.remoteurl);
    });


    $('input[name="backgrond-setting"]').change(function() {
        //$.cookie('backgrondsetting', this.value);//cookie无法重启后保存
        //测试成功控制台无法调试
        chrome.storage.local.set({backgrondsetting:this.value}, function() {
            //console.log(imgdate.result);
        });
    });
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

    function updateRemoteUrl() {
        console.log("updateRemoteUrl")
        var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        var objExp = new RegExp(Expression);
        if (objExp.test(this.value) == true) {
            chrome.storage.local.set({remoteurl: this.value}, function() {
                console.log(this.value);
            });
        }
    }

    $("#local-file").change(updateImageDisplay);
    $("#remote-url").change(updateRemoteUrl);
});
