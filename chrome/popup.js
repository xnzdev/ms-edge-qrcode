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