function bodyonload() {
    login();
}

async function generate_qrcode(url, channel) {
    console.log('generate_qrcode: [' + channel + ']')
    if (channel != null){
        if (document.getElementById('channel').innerHTML == '')
        {
            create_qrcode(url, channel);
            await sleep(1000);
            login();
        }
        else
        {
            await sleep(1000);
            login();
        }
    }
    else
        document.getElementById('error').innerHTML = 'channel parameter not found'
}

function create_qrcode(url, channel) {
    document.getElementById('channel').innerHTML = 'Login to ' + channel;
    console.log("create_qrcode: " + url);
    new QRCode(document.getElementById("qrcode"), url);
}


function create_video() {
    url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    video = document.createElement('video');
    video.src = url;
    video.width = 1280;
    video.muted = true;
    video.autoplay = true;
    // video.controls = true;
    // document.getElementById('video').appendChild(video);
    document.body.appendChild(video);
}

function login() {
    url = location.origin;
    url += location.pathname.replace('index.html', 'api/login');
    url += '?channel=' + getQueryParam('channel');

    console.log('login: ' + url);

    httpGet(url, function (response) {
        console.log('login.response: ' + response);
        if (response == "true")
            create_video();
        else
            generate_qrcode(url.replace('login', 'authorise'), getQueryParam('channel'));
    })
}


function getQueryParam(name) {
    parameters = decodeURIComponent(decodeURIComponent(location.search));
    if (
        (name = new RegExp(
            "[?&]" + encodeURIComponent(name) + "=([^&]*)"
            ).exec(parameters))
        )
        return decodeURIComponent(name[1]);
}

function httpGet(data, cb) {
    var url = data;
    var xmlHttp = new XMLHttpRequest();
    var format = "json";

    if (typeof data == "object") {
        url = data.url;
        if (data.format) {
            format = "xml";
        }
    }

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            cb(format === "xml" ? xmlHttp.responseXML : xmlHttp.response);
        }
    };

    xmlHttp.open("GET", url, true); // true for asynchronous

    if (typeof data == "object" && data.apiHeaders) {
        var key = null,
            value = null;
        for (key in data.apiHeaders) {
            value = data.apiHeaders[key];
            xmlHttp.setRequestHeader(key, value);
        }
    }

    xmlHttp.send();
}

// sleep time expects milliseconds
async function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
