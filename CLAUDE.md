# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PureSurge Ruleset is a personal Surge ad-blocking and splash screen removal ruleset project. It's designed to provide a clean, fast, and non-intrusive network experience by blocking ads, splash screens, and tracking domains while maintaining app functionality.

## Project Structure

The project follows a modular structure for Surge rules:
- `/modules/` - Surge module files (.sgmodule)
  - `base.sgmodule` - Basic ad-blocking rules
  - `splash.sgmodule` - Splash screen ad removal
  - `tracker.sgmodule` - Common tracking domain blocking
- `/scripts/` - JavaScript files for advanced rule modifications
  - `cleaner.js` - Example script for fine-tuning

## Key Technical Context

### Surge Module Format
Surge modules use the `.sgmodule` extension and follow this general structure:
```
#!name=Module Name
#!desc=Module Description

[Rule]
DOMAIN-SUFFIX,ad.example.com,REJECT
DOMAIN-KEYWORD,tracking,REJECT

[URL Rewrite]
^https?://api\.example\.com/ads - reject

[Map Local]
^https?://api\.example\.com/splash data="empty.json"

[Script]
script-name = type=http-response,pattern=^https?://api\.example\.com/config,script-path=cleaner.js

[MITM]
hostname = %APPEND% api.example.com
```

### Rule Types
1. **DOMAIN Rules**: Block specific domains or domain keywords
2. **URL Rewrite**: Redirect or reject specific URL patterns
3. **Map Local**: Replace responses with local data
4. **Script**: Execute JavaScript for complex modifications

## Development Guidelines

### Creating New Rules
When adding new blocking rules:
1. Test thoroughly to avoid breaking app functionality
2. Prefer domain-based rules over URL patterns when possible
3. Group related rules in appropriate modules
4. Document the target app and ad type in comments

### Testing Rules
1. Enable MitM in Surge for the target domains
2. Load the module in Surge
3. Monitor the Surge request log to verify blocking
4. Test the target app's core functionality

### Module Maintenance
- Keep rules minimal and focused on high-frequency ads
- Regularly check for rule effectiveness after app updates
- Remove obsolete rules to keep modules lightweight
- Maintain transparency with clear, readable rules

## Common Patterns

### Blocking SDK Domains
Common ad SDK domains to block:
- Tencent: `*.l.qq.com`, `*.gdt.qq.com`
- Baidu: `*.baidu.com/api/ads`
- Umeng: `*.umeng.com`, `*.umengcloud.com`

### Splash Screen Patterns
Common splash screen API patterns:
- `/api/v*/splash`
- `/startup/ad`
- `/app/init` (often contains ad config)

### Tracking Domains
Focus on analytics and user behavior tracking:
- Event reporting endpoints
- User behavior analytics
- Crash reporting (be selective)

## Important Considerations

1. **HTTPS Decryption**: Most ad APIs use HTTPS, requiring MitM configuration
2. **Selective MitM**: Only enable MitM for necessary domains to maintain security
3. **False Positives**: Test thoroughly as overly broad rules can break app functionality
4. **Performance**: Keep rules lightweight to avoid impacting network performance
5. **Privacy**: This project focuses on blocking ads and tracking, not on collecting user data

## Version Management

Follow semantic versioning in CHANGELOG.md:
- MAJOR: Breaking changes or significant rule restructuring
- MINOR: New feature modules or significant rule additions
- PATCH: Bug fixes, minor rule adjustments, false positive fixes