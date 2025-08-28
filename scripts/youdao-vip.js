// 有道词典VIP解锁脚本

// 解析响应体
var objc = JSON.parse($response.body);

objc = {
    "planIds": ["22"],
    "auto": true,
    "svipExpire": 0,
    "permissions": ["ONE_MONTH", "VOICE_TRANSLATION"],
    "expire": 4102415999000,
    "purchasedPlanIds": ["22"],
    "firstAuto": false,
    "tag": "VIP会员",
    "vip": true,
    "svip": false,
    "open": true,
    "copyWritings": ["", ""]
};

// 返回修改后的响应
$done({ body: JSON.stringify(objc) });