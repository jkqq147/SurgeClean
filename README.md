# PureSurge Ruleset

一个由个人维护的 **Surge 去广告 / 去开屏规则集**，目标是为日常使用提供更加**干净、快速、无干扰**的网络体验。  

---

## ✨ 项目背景
移动应用的开屏广告和埋点追踪越来越多，不仅浪费流量和时间，还可能影响隐私。  
现成的规则集合往往过大或过度拦截，容易误杀。**PureSurge** 致力于提供一份 **精简、透明、可持续维护** 的规则集。  

---

## 🎯 项目目标
- 🚫 去除常见 **开屏广告**  
- 🛡 拦截主流 **广告 SDK** 请求（如腾讯、百度、友盟等）  
- 🔒 屏蔽常见 **追踪域名**，降低隐私泄露  
- ⚡ 保持 **App 正常功能**，力求“不误杀”  

---

## 🛠 特点
- **模块化**：按需加载，支持 Surge `.sgmodule`  
- **轻量化**：仅保留高频广告/追踪域名，避免臃肿  
- **可审计**：全部为明文规则，透明可查  
- **可扩展**：支持 Map Local、URL Rewrite 与 Script 精修  

---

## 📦 使用方法
1. 确保 Surge 已启用 **MitM** 并安装信任证书。  
2. 在 Surge 中选择：  
   `Module → + → Install from URL`  
   粘贴本项目提供的规则链接。  
3. 重启需要净化的 App，验证效果。  

---

## 📋 可用模块

### 有道词典去广告
- **模块地址**: [youdao.sgmodule](https://raw.githubusercontent.com/jkqq147/SurgeClean/main/modules/youdao.sgmodule)
- **功能说明**: 去除有道词典应用内广告

### Bilibili 去开屏广告
- **模块地址**: [bilibili-splash.sgmodule](https://raw.githubusercontent.com/jkqq147/SurgeClean/main/modules/bilibili-splash.sgmodule)
- **功能说明**: 移除哔哩哔哩客户端开屏广告
  - 拦截开屏广告展示接口
  - 处理开屏广告预加载列表
  - 将广告时间设置为未来时间，阻止显示

### 代理豁免（敏感应用直连）
- **模块地址**: [proxy-bypass.sgmodule](https://raw.githubusercontent.com/jkqq147/SurgeClean/main/modules/proxy-bypass.sgmodule)
- **功能说明**: 为对代理敏感的 App 提供直连（DIRECT）
  - 默认涵盖主流银行与银联相关域名
  - 新增淘宝/天猫相关域名直连（可按需扩展）
  - 包含通用证书验证域名与必要 IP 段直连
  - 可按需在本地添加其他敏感应用域名（如政务/支付等）

### 知乎去广告
- **模块地址**: [zhihu.sgmodule](https://raw.githubusercontent.com/jkqq147/SurgeClean/main/modules/zhihu.sgmodule)
- **功能说明**: 全面移除知乎各类广告和营销内容
  - 屏蔽开屏广告、信息流广告、推荐流广告
  - 过滤品牌提问、营销消息、热榜推广
  - 清理个人页MCN信息、推广内容
  - 禁用云端广告配置、视频广告
  - 拦截知乎广告服务器IP地址

---

---

## 🔄 维护计划
- **每周检查**：抓取常用 App 更新后的接口变化  
- **用户反馈**：欢迎提交 issue 或 PR  

---

## ⚠️ 注意事项
- **需开启 HTTPS 解密 (MitM)**：大多数广告接口为 HTTPS  
- **避免全局 MitM**：只对必要域名启用  
- **规则更新可能带来误杀**：如遇问题可关闭对应模块或添加白名单  

---

## 📖 License
本项目遵循 **MIT 协议** 开源，欢迎 fork 和改造。  
