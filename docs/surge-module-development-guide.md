# Surge 模块开发手册

## 概述

Surge 模块是对当前配置文件的"补丁"，模块中的设置具有比原始配置更高的优先级。

## 模块类型

1. **内部模块** - Surge 内置提供的模块
2. **本地模块** - 存储在配置文件目录的 `.sgmodule` 文件
3. **安装模块** - 基于 URL 的远程模块

## 模块结构

### 元数据（Metadata）

模块文件开头必须包含元数据：

```
#!name=模块名称
#!desc=模块描述
#!system=平台 (可选)
#!requirement=版本/条件要求 (可选)
```

### 可覆盖的配置段

模块可以覆盖以下配置段：

1. **[General]** - 通用设置
2. **[Replica]** - 复制设置
3. **[MITM]** - 中间人攻击设置
4. **[Rule]** - 规则
5. **[Script]** - 脚本
6. **[URL Rewrite]** - URL 重写
7. **[Header Rewrite]** - 头部重写
8. **[Host]** - 主机设置

## 覆盖技术

### 1. 直接覆盖
```
key = value
```
直接替换原配置中的值

### 2. 追加 (%APPEND%)
```
key = %APPEND% value
```
在原有值后追加新值

### 3. 插入到前面 (%INSERT%)
```
key = %INSERT% value
```
在原有值前插入新值

## 规则限制

### 模块规则的策略限制
模块中的规则只能使用内部策略：
- `DIRECT` - 直连
- `REJECT` - 拒绝
- `REJECT-TINYGIF` - 返回透明 GIF

### MITM 主机名操作
支持对 MITM 主机名进行各种操作：
- 追加主机名
- 排除特定主机名（使用 `-` 前缀）

## 平台和版本要求

### 条件变量
模块可以使用以下变量设置条件：

- `CORE_VERSION` - Surge 核心版本
- `SYSTEM` - 操作系统（iOS, tvOS, macOS）
- `SYSTEM_VERSION` - 系统版本
- `DEVICE_MODEL` - 设备型号
- `LANGUAGE` - 系统语言

### 条件示例
```
#!requirement=CORE_VERSION>=20
#!requirement=CORE_VERSION>=20 && (SYSTEM = 'iOS' || SYSTEM = 'tvOS')
#!requirement=SYSTEM_VERSION>=15.0
```

### 最低支持版本
- iOS: 5.10.0+
- Mac: 5.6.0+

## 完整模块示例

### 基础广告拦截模块
```
#!name=基础广告拦截
#!desc=拦截常见广告域名

[Rule]
DOMAIN-SUFFIX,ad.example.com,REJECT
DOMAIN-KEYWORD,tracking,REJECT

[URL Rewrite]
^https?://api\.example\.com/ads - reject

[MITM]
hostname = %APPEND% api.example.com
```

### 开屏广告移除模块
```
#!name=开屏广告移除
#!desc=移除应用开屏广告
#!system=iOS

[Map Local]
^https?://api\.example\.com/splash data="empty.json"

[Script]
splash-remove = type=http-response,pattern=^https?://api\.example\.com/config,script-path=scripts/splash-remove.js

[MITM]
hostname = %APPEND% api.example.com
```

### MitM 所有主机名示例
```
#!name=MitM All Hostnames
#!desc=对所有 443 端口的主机名执行 MitM，除了 Apple 服务

[MITM]
hostname = -*.apple.com, -*.icloud.com, *
```

## 开发最佳实践

### 1. 模块设计原则
- 保持模块功能单一和专注
- 避免过度阻塞导致应用功能异常
- 使用描述性的模块名称和说明

### 2. 规则优化
- 优先使用域名规则而非 URL 模式
- 合理使用 REJECT-TINYGIF 避免加载错误
- 测试规则对应用核心功能的影响

### 3. MITM 安全
- 仅对必要的域名启用 MITM
- 排除金融和敏感服务域名
- 使用 `-` 前缀明确排除不应拦截的域名

### 4. 版本兼容
- 设置合理的最低版本要求
- 使用条件语句支持多平台
- 测试在不同版本的兼容性

### 5. 性能考虑
- 避免过多的正则表达式规则
- 合理使用脚本，避免复杂计算
- 定期清理无效或过时的规则

## Script 配置详解

### 脚本类型
- `http-request` - HTTP 请求脚本
- `http-response` - HTTP 响应脚本
- `cron` - 定时任务脚本
- `event` - 事件脚本
- `dns` - DNS 脚本
- `rule` - 规则脚本
- `generic` - 通用脚本

### 脚本参数
```
script-name = type=类型,pattern=正则表达式,requires-body=1,script-path=路径,timeout=5,debug=1,engine=jsc,argument=参数
```

参数说明：
- `type` - 脚本类型（必需）
- `script-path` - 脚本路径，可以是相对路径、绝对路径或 URL
- `pattern` - URL 匹配正则表达式（http-request/response 必需）
- `requires-body` - 是否需要请求/响应体（0 或 1）
- `timeout` - 脚本超时时间（默认 5 秒）
- `debug` - 启用详细日志记录
- `engine` - 脚本执行引擎（jsc 或 webview）
- `argument` - 传递给脚本的参数

### 脚本引擎选择

#### JavaScriptCore (jsc)
- 快速初始化
- 低延迟
- 内存占用较高
- 适合小型、频繁执行的脚本

#### WebView
- 独立进程运行
- 降低 NE 进程内存影响
- 支持 JIT 编译
- 初始化稍慢
- 适合复杂、内存密集型脚本

## Surge 脚本 API

### 1. 网络信息 API

```javascript
// 获取网络环境信息
$network.v4.primaryAddress  // IPv4 地址
$network.v6.primaryAddress  // IPv6 地址
$network.wifi.ssid         // WiFi SSID
$network.wifi.bssid        // WiFi BSSID

// 获取脚本信息
$script.name               // 脚本名称
$script.startTime          // 开始时间
$script.type               // 脚本类型

// 环境信息
$environment.system        // 系统类型
$environment.systemVersion // 系统版本
$environment.language      // 系统语言
$environment.surge-version // Surge 版本
```

### 2. 持久化存储 API

```javascript
// 写入数据
$persistentStore.write(data, key)

// 读取数据
let data = $persistentStore.read(key)

// 示例
$persistentStore.write("value", "myKey")
let value = $persistentStore.read("myKey")
```

### 3. HTTP 客户端 API

```javascript
// GET 请求
$httpClient.get(url, callback)
$httpClient.get(options, callback)

// POST 请求
$httpClient.post(options, callback)

// 其他方法
$httpClient.put(options, callback)
$httpClient.delete(options, callback)
$httpClient.head(options, callback)
$httpClient.options(options, callback)
$httpClient.patch(options, callback)

// 请求选项
let options = {
    url: "https://api.example.com",
    headers: {
        "User-Agent": "Surge"
    },
    body: "request body",
    timeout: 5
}

// 回调函数
function callback(error, response, data) {
    if (error) {
        console.log(error)
    } else {
        console.log(response.status)
        console.log(data)
    }
    $done()
}
```

### 4. 工具 API

```javascript
// IP 地理位置查询
let location = $utils.geoip("8.8.8.8")
// 返回: { country: "US" }

// IP ASN 查询
let asn = $utils.ipasn("8.8.8.8")
// 返回: { asn: "15169", name: "Google LLC" }

// Gzip 解压
let decompressed = $utils.ungzip(compressedData)
```

### 5. 通知 API

```javascript
// 发送系统通知
$notification.post(title, subtitle, content)

// 示例
$notification.post("标题", "副标题", "通知内容")
```

### 6. HTTP 请求/响应对象

#### $request 对象（http-request 脚本）
```javascript
$request = {
    url: "https://example.com/path",
    method: "GET",
    headers: {
        "User-Agent": "...",
        "Accept": "*/*"
    },
    body: "请求体内容"  // 仅当 requires-body=1 时可用
}
```

#### $response 对象（http-response 脚本）
```javascript
$response = {
    status: 200,
    headers: {
        "Content-Type": "application/json"
    },
    body: "响应体内容"  // 仅当 requires-body=1 时可用
}
```

### 7. 脚本完成

```javascript
// 所有脚本必须调用 $done() 表示完成

// http-request 脚本
$done({})  // 不修改请求
$done($request)  // 返回修改后的请求

// http-response 脚本
$done({})  // 不修改响应
$done($response)  // 返回修改后的响应

// 其他脚本
$done()  // 简单完成
```

## 实用脚本示例

### 修改请求头
```javascript
// http-request 脚本
let headers = $request.headers
headers["Custom-Header"] = "Custom Value"
delete headers["User-Agent"]
$done({ headers })
```

### 修改响应体
```javascript
// http-response 脚本
if ($response.body) {
    let body = $response.body
    body = body.replace(/广告/g, "")
    $done({ body })
} else {
    $done({})
}
```

### 定时任务
```javascript
// cron 脚本
let now = new Date()
$notification.post("定时任务", "", `当前时间: ${now}`)
$done()
```

### 异步请求示例
```javascript
// 使用 async/await
async function fetchData() {
    return new Promise((resolve, reject) => {
        $httpClient.get("https://api.example.com", (error, response, data) => {
            if (error) reject(error)
            else resolve(data)
        })
    })
}

(async () => {
    try {
        let data = await fetchData()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
    $done()
})()
```

## 重要注意事项

1. **必须调用 $done()**：所有脚本都必须调用 $done() 来表示执行完成
2. **响应体大小限制**：处理大型响应体时要谨慎，避免内存问题
3. **超时控制**：默认 5 秒超时，复杂脚本可适当增加
4. **调试模式**：开发时启用 debug=1 查看详细日志
5. **引擎选择**：根据脚本复杂度选择合适的引擎

## URL Rewrite 语法

### 基本语法
```
匹配模式 替换内容 [header|302|307]
```

### 示例
```
# 拒绝请求
^https?://example\.com/ads - reject

# 302 重定向
^https?://example\.com/old https://example.com/new 302

# 修改 header
^https?://example\.com/api - request-header User-Agent: Custom
```

## Map Local 语法

### 映射到本地数据
```
^https?://example\.com/api data="响应内容"
```

### 映射到本地文件
```
^https?://example\.com/api data-path=local-file.json
```

## 调试技巧

1. **查看请求日志** - 在 Surge 中查看详细的请求日志
2. **测试单个模块** - 单独启用模块进行测试
3. **使用工具** - 利用 Surge 的调试工具和统计功能
4. **逐步添加规则** - 避免一次性添加过多规则

## 常见问题

### Q: 模块规则不生效？
A: 检查 MITM 是否配置正确，确认域名在 hostname 列表中

### Q: 如何处理 HTTPS 请求？
A: 需要在 [MITM] 段添加对应的 hostname

### Q: 模块之间的优先级？
A: 后加载的模块优先级更高，会覆盖先加载的模块

### Q: 如何排除特定域名？
A: 使用 `-` 前缀，如 `-*.apple.com`

---

*本手册基于 Surge 官方文档整理，适用于 iOS 5.10.0+ 和 Mac 5.6.0+ 版本*