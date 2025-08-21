/**
 * 知乎去广告脚本
 * 功能：移除推荐流广告、信息流广告、品牌提问广告等
 */

let body = $response.body;
const url = $request.url;

if (!body) {
    $done({});
} else {
    // 特殊处理开屏广告 - 使用正则直接替换（不解析JSON避免转义问题）
    if (url.match(/commercial_api\/real_time_launch/) || url.match(/commercial_api.*launch/)) {
        try {
            // 关键：使用转义的引号匹配，因为响应可能是转义的JSON
            body = body.replace(/img_play_duration\\":\d+/g, 'img_play_duration\\":0');
            body = body.replace(/launch_timeout\\":\d+/g, 'launch_timeout\\":0');
            
            // 同时处理未转义的情况
            body = body.replace(/"img_play_duration":\d+/g, '"img_play_duration":0');
            body = body.replace(/"launch_timeout":\d+/g, '"launch_timeout":0');
            body = body.replace(/"duration":\d+/g, '"duration":0');
            body = body.replace(/"show_time":\d+/g, '"show_time":0');
            body = body.replace(/"ads_v2":\s*\[[\s\S]*?\]/g, '"ads_v2":[]');
            body = body.replace(/"launch":\s*\[[\s\S]*?\]/g, '"launch":[]');
            
            $done({ body });
            return;
        } catch (e) {
            console.log('知乎开屏广告处理错误: ' + e);
        }
    }
    
    try {
        let obj = JSON.parse(body);
        const url = $request.url;
        
        // 推荐流去广告（增强版）
        if (url.includes('/topstory/recommend')) {
            if (obj.data) {
                // 过滤关键词
                const filterKeywords = ['副业', '赚钱', '挣钱', '变现', '运营', '电商', '剪辑', '失业', '收益', '稿费', '贷款', '存款', '兼职'];
                
                obj.data = obj.data.filter(item => {
                    // 过滤明确的广告
                    if (item.hasOwnProperty('ad') || 
                        item.promotion_extra != null ||
                        item.type === 'market_card' ||
                        item.common_card?.style?.type === 'ads' ||
                        item.extra?.type === 'ads') {
                        return false;
                    }
                    
                    // 过滤包含营销关键词的内容
                    if (item.common_card?.feed_content?.title?.panel_text) {
                        let title = item.common_card.feed_content.title.panel_text;
                        for (let keyword of filterKeywords) {
                            if (title.includes(keyword)) return false;
                        }
                    }
                    
                    return true;
                });
                
                // 重新编号
                for (let i = 0; i < obj.data.length; i++) {
                    obj.data[i].offset = i + 1;
                }
            }
        }
        
        // 回答页去广告
        if (url.includes('/v4/questions') || url.includes('/questions')) {
            if (obj.data && Array.isArray(obj.data)) {
                obj.data = obj.data.filter(item => {
                    return !item.ad_info && item.type !== 'ad';
                });
            }
            // 移除底部推荐商品
            if (obj.ad_info) {
                delete obj.ad_info;
            }
        }
        
        // 个人页去广告
        if (url.includes('/people/')) {
            // 移除个人页广告位
            if (obj.mcn_user_info) {
                delete obj.mcn_user_info;
            }
            if (obj.brand_info) {
                delete obj.brand_info;
            }
            if (obj.promotion_extra_info) {
                delete obj.promotion_extra_info;
            }
        }
        
        // 动态页去广告
        if (url.includes('/moments') || url.includes('/feed-root')) {
            if (obj.data) {
                obj.data = obj.data.filter(item => {
                    return item.type !== 'moment_card' || !item.ad;
                });
            }
        }
        
        // 开屏广告处理
        if (url.includes('/commercial_api') || 
            url.includes('/root/window') ||
            url.includes('/app/config') ||
            url.includes('/ab/api')) {
            // 返回空的开屏广告数据
            obj = {
                "success": true,
                "launch": [],
                "ads": [],
                "show": false,
                "duration": 0,
                "next_req_time": 9999999999999
            };
        }
        
        // 处理浮窗广告
        if (url.includes('/bazaar/float_window') || url.includes('/me/guides')) {
            obj = {};
        }
        
        // 云端配置处理 - 禁用广告相关配置
        if (url.includes('m-cloud.zhihu.com') || url.includes('appcloud2.zhihu.com')) {
            if (obj.config) {
                // 禁用广告模块
                if (obj.config.homepage_feed_tab) {
                    delete obj.config.homepage_feed_tab.ad;
                }
                if (obj.config.feed) {
                    delete obj.config.feed.ad;
                }
                if (obj.config.answer) {
                    delete obj.config.answer.ad;
                }
                // 禁用视频广告
                if (obj.config.video) {
                    obj.config.video.enable_ad = false;
                    obj.config.video.enable_pre_ad = false;
                }
                // 禁用开屏广告
                if (obj.config.zhihu) {
                    if (obj.config.zhihu.splash) {
                        obj.config.zhihu.splash = {};
                    }
                    if (obj.config.zhihu.ad) {
                        obj.config.zhihu.ad = {};
                    }
                }
            }
        }
        
        // 搜索预置词处理
        if (url.includes('/search/preset_words')) {
            if (obj.preset_words) {
                // 过滤商业推广词
                obj.preset_words = obj.preset_words.filter(word => {
                    return !word.is_ad && !word.is_promotion;
                });
            }
        }
        
        // 热榜去广告
        if (url.includes('/hot_lists') || url.includes('/hot/lists')) {
            if (obj.data) {
                obj.data = obj.data.filter(item => {
                    return !item.promotion && !item.ad_info;
                });
            }
        }
        
        body = JSON.stringify(obj);
    } catch (e) {
        console.log('知乎去广告脚本错误: ' + e);
    }
    
    $done({ body });
}