/**
 * 知乎去广告脚本
 * 功能：移除推荐流广告、信息流广告、品牌提问广告等
 */

let body = $response.body;

if (!body) {
    $done({});
} else {
    try {
        let obj = JSON.parse(body);
        const url = $request.url;
        
        // 推荐流去广告
        if (url.includes('/topstory') || url.includes('/recommend')) {
            if (obj.data) {
                obj.data = obj.data.filter(item => {
                    // 过滤广告类型
                    if (item.type === 'feed_advert' || 
                        item.type === 'market_card' ||
                        item.common_card?.feed_content?.type === 'ad') {
                        return false;
                    }
                    
                    // 过滤带广告标记的内容
                    if (item.extra?.type === 'ads' ||
                        item.card_type === 'slot_event_card' ||
                        item.ad_info) {
                        return false;
                    }
                    
                    // 过滤营销内容
                    if (item.target?.title_area?.text?.includes('广告') ||
                        item.target?.title_area?.text?.includes('营销')) {
                        return false;
                    }
                    
                    return true;
                });
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