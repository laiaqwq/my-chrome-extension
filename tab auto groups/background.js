let googlesearchDomain = [
  ".google.com",".google.ad",".google.ae",".google.com.af",".google.com.ag",".google.com.ai",".google.al",".google.am",".google.co.ao",".google.com.ar",".google.as",".google.at",".google.com.au",".google.az",".google.ba",".google.com.bd",".google.be",".google.bf",".google.bg",".google.com.bh",".google.bi",".google.bj",".google.com.bn",".google.com.bo",".google.com.br",".google.bs",".google.bt",".google.co.bw",".google.by",".google.com.bz",".google.ca",".google.cd",".google.cf",".google.cg",".google.ch",".google.ci",".google.co.ck",".google.cl",".google.cm",".google.cn",".google.com.co",".google.co.cr",".google.com.cu",".google.cv",".google.com.cy",".google.cz",".google.de",".google.dj",".google.dk",".google.dm",".google.com.do",".google.dz",".google.com.ec",".google.ee",".google.com.eg",".google.es",".google.com.et",".google.fi",".google.com.fj",".google.fm",".google.fr",".google.ga",".google.ge",".google.gg",".google.com.gh",".google.com.gi",".google.gl",".google.gm",".google.gr",".google.com.gt",".google.gy",".google.com.hk",".google.hn",".google.hr",".google.ht",".google.hu",".google.co.id",".google.ie",".google.co.il",".google.im",".google.co.in",".google.iq",".google.is",".google.it",".google.je",".google.com.jm",".google.jo",".google.co.jp",".google.co.ke",".google.com.kh",".google.ki",".google.kg",".google.co.kr",".google.com.kw",".google.kz",".google.la",".google.com.lb",".google.li",".google.lk",".google.co.ls",".google.lt",".google.lu",".google.lv",".google.com.ly",".google.co.ma",".google.md",".google.me",".google.mg",".google.mk",".google.ml",".google.com.mm",".google.mn",".google.ms",".google.com.mt",".google.mu",".google.mv",".google.mw",".google.com.mx",".google.com.my",".google.co.mz",".google.com.na",".google.com.ng",".google.com.ni",".google.ne",".google.nl",".google.no",".google.com.np",".google.nr",".google.nu",".google.co.nz",".google.com.om",".google.com.pa",".google.com.pe",".google.com.pg",".google.com.ph",".google.com.pk",".google.pl",".google.pn",".google.com.pr",".google.ps",".google.pt",".google.com.py",".google.com.qa",".google.ro",".google.ru",".google.rw",".google.com.sa",".google.com.sb",".google.sc",".google.se",".google.com.sg",".google.sh",".google.si",".google.sk",".google.com.sl",".google.sn",".google.so",".google.sm",".google.sr",".google.st",".google.com.sv",".google.td",".google.tg",".google.co.th",".google.com.tj",".google.tl",".google.tm",".google.tn",".google.to",".google.com.tr",".google.tt",".google.com.tw",".google.co.tz",".google.com.ua",".google.co.ug",".google.co.uk",".google.com.uy",".google.co.uz",".google.com.vc",".google.co.ve",".google.vg",".google.co.vi",".google.com.vn",".google.vu",".google.ws",".google.rs",".google.co.za",".google.co.zm",".google.co.zw",".google.cat"
]

//初次安装打开设置 
function getobj(url) {// 开发环境中需要先获得url
  //var str = url.split("?")[1]; // 将所有参数从url中分离出来
  // console.log(str); // page=1&pageSize=5
  // var keyValue = str.split("&"); // 将所有的参数放到一个数组里// ["page=1", "pageSize=5"]
  let obj = {para:[],path:"",domain:""}; // 定义一个对象 用来存放所有参数
  obj.path = url.split("?")[0];
  obj.domain = (obj.path.split("://")[1]).split("/")[0];
  return obj;
}

chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'onboarding.html'
    });
  }
});

function ifDomainInList(domain,list){
  for (const i of list) {
    if (i = domain){
      return true;
    }
  }
  return false;
}

function ifstrInList(domain,list){
  for (const i of list) {
    if (domain.indexOf(i) != -1){
      return true;
    }
  }
  return false;
}

chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    if (changeInfo.status != "loading"){
      return
    }
    let domain = getobj(tab.url).domain
    // read changeInfo data and do something with it (like read the url）
    console.log("info");
    console.log(changeInfo);
    console.log(tab);
    if (tab.groupId==-1){
      if (ifstrInList(domain,googlesearchDomain)){
        groupOption={
          createProperties:{},
          tabIds:tab.id
        };
        chrome.tabs.group(groupOption);
      }
    }else{

    }
  }
);