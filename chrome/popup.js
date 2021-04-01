console.log("加载了popup.js文件");
window.onload = function () {
    var eiUrl = document.getElementById('url');

    chrome.tabs.getSelected(null, function (tab) {

        var tablink = tab.url;
        // eiUrl.innerHTML = tablink;
    });


    var btn = document.getElementById("btn");

    // btn.addEventListener('click', function(){
        // alert(1)
        // chrome.tabs.create({ url: 'chrome://extensions/configureCommands' });
    // });
};


// chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
// chrome://extensions/shortcuts

// 创建自定义菜单
function createMenus(){
    chrome.contextMenus.create({
        "title": "ctx_string",
        "contexts":["selection"], // 有选中时右键才会出现的菜单
        "onclick":function(info, tab) {
        }
    });
}

createMenus();