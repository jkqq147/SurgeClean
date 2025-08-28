// Bilibili 开屏广告移除脚本

let body = $response.body;
let url = $request.url;

try {
    let obj = JSON.parse(body);
    
    // Handle splash list endpoint (预加载)
    if (obj.data && obj.data.list) {
        // Neutralize each splash ad item
        for (let item of obj.data.list) {
            // Set display duration to 0
            item.duration = 0;
            // Set begin and end times to future date (2040)
            // This prevents the splash from being shown
            item.begin_time = 2240150400;
            item.end_time = 2240150400;
        }
    }
    
    body = JSON.stringify(obj);
} catch (err) {
    console.log("Bilibili splash ad removal error: " + err);
}

$done({ body });