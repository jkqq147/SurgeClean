# Changelog

本文件用于记录 **SurgeClean** 的所有显著变更。  
遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。  

---

## [Unreleased]
- 重命名：`modules/bank-bypass.sgmodule` → `modules/proxy-bypass.sgmodule`
- 改进：模块定位更通用（代理豁免/敏感应用直连），描述与文档更新
- 维护：保留银行类直连规则，便于按需扩展其他敏感应用域名
### Added
- 代理豁免模块新增淘宝/天猫域名直连（`taobao.com`, `tmall.com`, `tb.cn`）

---

## [0.5.0] - 2025-08-21
### Added
- 新增知乎去广告模块 (`modules/zhihu.sgmodule`)
  - 全面移除知乎App各类广告内容
  - 屏蔽开屏广告、信息流广告、推荐流广告
  - 过滤品牌提问、营销消息、热榜推广内容
  - 清理个人页MCN信息和推广内容
  - 禁用云端广告配置和视频广告
  - 拦截知乎广告服务器IP地址
  - 包含JavaScript脚本精细处理响应数据

---

## [0.4.0] - 2025-08-21
### Added
- 新增银行应用代理豁免模块 (`modules/bank-bypass.sgmodule`)
  - 解决银行App检测VPN/代理连接的问题
  - 支持农业银行、工商银行、建设银行、中国银行、交通银行等主流银行
  - 涵盖招商银行、邮储银行、浦发银行、中信银行、民生银行等
  - 包含光大银行、华夏银行、平安银行及银联相关域名
  - 添加银行证书验证域名和常用IP段直连规则

---

## [0.3.0] - 2025-08-21
### Added
- 新增 Bilibili 去开屏广告模块 (`modules/bilibili-splash.sgmodule`)
  - 拦截开屏广告展示接口，返回空数据
  - 处理开屏广告预加载列表，设置时长为 0
  - 将广告时间戳设置为未来时间（2040年）以防止显示

---

## [0.2.0] - 2025-08-21
### Added
- 新增有道词典去广告模块 (`modules/youdao.sgmodule`)

---

## [0.1.0] - 2025-08-21
### Added
- 初始版本发布
- 发布 `README.md` 项目说明
