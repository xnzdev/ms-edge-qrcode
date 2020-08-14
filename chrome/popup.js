var eiUrl = document.getElementById('url');
eiUrl.innerHTML = window.location.href;

chrome.tabs.getSelected(null,function(tab) {

    var tablink = tab.url;
    eiUrl.innerHTML = tablink;
});
