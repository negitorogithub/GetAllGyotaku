let vue;

function findGyotakuByUrl(url) {
    return new Promise(resolve => {
        console.log("findGyotakuByUrl Started");
        $.get("https://gyo.tc/" + url, null,
            function (data) {
                console.log(data);
                let gyotakuList_ = new DOMParser()
                    .parseFromString(data, "text/html")
                    .querySelectorAll("[id^=fish]");
                resolve(gyotakuList_)
            },
            "html"
        );
    })
}

function findInternetArchiveByUrl(url) {
    return new Promise(resolve => {
        $.get(`https://archive.is/${url}`, function (data) {
            let rowsList =
                new DOMParser()
                    .parseFromString(data, "text/html")
                    .querySelectorAll("[id^=row]");
            let archivesList = [];
            rowsList.forEach(row => {
                archivesList.push(
                    Array.from(
                        row.querySelectorAll("[style^=text\\-decoration\\:none]")
                    )
                )
            });
            resolve(archivesList.flat());
            console.log(`flatten archivesList is ${archivesList.flat()}`);
        })
    })
}

function findGoogleCache(url) {
    return new Promise(resolve => {
        $.get(`http://webcache.googleusercontent.com/search?q=cache:${url}`, function () {
            resolve(`http://webcache.googleusercontent.com/search?q=cache:${url}`);
        })
    })
}

function findWaybackMachineLatest(url) {
    return new Promise(resolve => {
        //limit=-1で最新
        $.get(`http://web.archive.org/cdx/search/cdx?limit=-1&fl=timestamp&url=${url}`, function (timestamp) {
            resolve(`https://web.archive.org/web/${timestamp}/${url}`);
            console.log(`waybackMachine response(latest) is ${timestamp}`);
        })
    })
}

function findWaybackMachineOldest(url) {
    return new Promise(resolve => {
        //limit=1で最古
        $.get(`http://web.archive.org/cdx/search/cdx?limit=1&fl=timestamp&url=${url}`, function (timestamp) {
            resolve(`https://web.archive.org/web/${timestamp}/${url}`);
            console.log(`waybackMachine response(latest) is ${timestamp}`);
        })
    })
}

console.log("popup.jsLoaded");

chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tabsArray) {
    console.log(`currentUrl is ${tabsArray[0].url}`);

    findGyotakuByUrl(tabsArray[0].url).then((gyotakuList) => {
        console.log(gyotakuList);
        gyotakuList.forEach(element => {
            vue.items.push(element)

        });
        vue.isLoadingGyotaku = false
    }).catch((err) => {
        console.log(err);
        vue.isLoadingGyotaku = false
    });
    findInternetArchiveByUrl(tabsArray[0].url).then((archivesList) => {
        console.log(archivesList);
        archivesList.forEach(element => {
            vue.items.push(element)
        });
        vue.isLoadingArchives = false
    }).catch((err) => {
        console.log(err);
        vue.isLoadingArchives = false
    });
    findGoogleCache(tabsArray[0].url).then((googleCacheUrl) => {
        console.log({
            href: googleCacheUrl
        });
        vue.items.push({
            href: googleCacheUrl
        });
        vue.isLoadingGoogleCache = false
    }).catch((err) => {
        console.log(err);
        vue.isLoadingGoogleCache = false
    });
    findWaybackMachineLatest(tabsArray[0].url).then((waybackMachineUrl) => {
        console.log({
            href: waybackMachineUrl
        });
        vue.items.push({
            href: waybackMachineUrl
        });
        vue.isLoadingWaybackMachine = false
    }).catch((err) => {
        console.log(err)
        vue.isLoadingWaybackMachine = false
    });
    findWaybackMachineOldest(tabsArray[0].url).then((waybackMachineUrl) => {
        console.log({
            href: waybackMachineUrl
        });
        vue.items.push({
            href: waybackMachineUrl
        });
        vue.isLoadingWaybackMachine = false

    }).catch((err) => {
        console.log(err)
        vue.isLoadingWaybackMachine = false
    });

});

$(function () {
    vue = new Vue({
        el: '#example-1',
        data: {
            items: [],
            isLoadingGyotaku: true,
            isLoadingArchives: true,
            isLoadingGoogleCache: true,
            isLoadingWaybackMachine: true,
        }
    })

});