# Changelog

本文件用于记录 **PureSurge Ruleset** 的所有显著变更。  
遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 格式，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。  

---

## [Unreleased]
- 待添加的新规则
- 调整已有规则
- 修复可能的误杀

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

