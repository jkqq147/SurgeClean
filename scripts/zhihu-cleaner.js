/**
 * 知乎去广告脚本
 * 功能：移除开屏广告、推荐流广告、信息流广告等
 */

let body = $response.body;

if (body) {
    switch(true) {
        // 开屏广告处理 - 同时处理 launch_v2 和 real_time_launch
        case /commercial_api.*launch/.test($request.url):
        case /commercial_api\/real_time_launch/.test($request.url):
            try {
                // 处理转义的JSON（\\"）
                body = body.replace(/img_play_duration\\":\d+/g, 'img_play_duration\\":-1')
                          .replace(/launch_timeout\\":\d+/g, 'launch_timeout\\":-1')
                          .replace(/duration\\":\d+/g, 'duration\\":-1')
                          .replace(/show_duration\\":\d+/g, 'show_duration\\":-1');
                
                // 处理正常的JSON（"）
                body = body.replace(/"img_play_duration":\d+/g, '"img_play_duration":-1')
                          .replace(/"launch_timeout":\d+/g, '"launch_timeout":-1')
                          .replace(/"duration":\d+/g, '"duration":-1')
                          .replace(/"show_duration":\d+/g, '"show_duration":-1');
            } catch(error) {
                console.log('zhihu openad' + error);
            }
            break;
            
        // 推荐流去广告
        case /topstory\/recommend/.test($request.url):
            try {
                let obj = JSON.parse(body);
                const filterKeywords = ['副业', '赚钱', '挣钱', '变现', '运营', '电商', '剪辑', '创业', '失业', '收益', '稿费', '贷款', '存款', '兼职'];
                let items = [];
                
                for (let item of obj.data) {
                    // 过滤广告
                    if (item.hasOwnProperty('ad') || 
                        item.promotion_extra != null ||
                        item.type == 'market_card' ||
                        item.common_card?.style?.type == 'ads' ||
                        item.extra?.type == 'ads') {
                        continue;
                    }
                    
                    // 过滤营销内容
                    if (item.common_card?.feed_content?.title?.panel_text) {
                        let title = item.common_card.feed_content.title.panel_text;
                        let find = false;
                        filterKeywords.forEach(keyword => {
                            if (title.includes(keyword)) find = true;
                        });
                        if (!find) items.push(item);
                    } else {
                        items.push(item);
                    }
                }
                
                obj.data = items;
                // 重新编号
                for (let i = 0; i < obj.data.length; i++) {
                    obj.data[i].offset = i + 1;
                }
                body = JSON.stringify(obj);
            } catch(error) {
                console.log('zhihu recommend' + error);
            }
            break;
            
        // 回答页广告
        case /questions\/\d+\/feeds/.test($request.url):
            try {
                body = body.replace(/ad_info"/g, 'ddgksf2013"');
            } catch(error) {
                console.log('zhihu answer' + error);
            }
            break;
            
        // 热榜去广告
        case /topstory\/hot-lists/.test($request.url):
            try {
                let obj = JSON.parse(body);
                obj.data.data = obj.data.data.filter(item => !item.promotion);
                body = JSON.stringify(obj);
            } catch(error) {
                console.log('zhihu hot-lists' + error);
            }
            break;
            
        // 搜索预置词
        case /search\/preset_words/.test($request.url):
            try {
                let obj = JSON.parse(body);
                if (obj.preset_words?.words) {
                    obj.preset_words.words.forEach(word => {
                        word.begin_ts = 3000000000;
                        word.end_ts = 3000006400;
                    });
                }
                if (obj.preset_words?.force_words) {
                    obj.preset_words.force_words.forEach(word => {
                        word.begin_ts = 3000000000;
                        word.end_ts = 3000006400;
                    });
                }
                body = JSON.stringify(obj);
            } catch(error) {
                console.log('zhihu preset_words' + error);
            }
            break;
            
        // 搜索热搜
        case /search\/hot_search/.test($request.url):
            try {
                let obj = JSON.parse(body);
                if (obj.realtime) {
                    obj.realtime = [];
                }
                body = JSON.stringify(obj);
            } catch(error) {
                console.log('zhihu hot_search' + error);
            }
            break;
            
        // 个人页面
        case /people\/self/.test($request.url):
            try {
                let obj = JSON.parse(body);
                obj.vip_info.is_vip = true;
                obj.vip_info.vip_icon = {
                    url: "https://picx.zhimg.com/v2-aa8a1823abfc46f14136f01899b1368e.jpg?source=88ceefae",
                    night_mode_url: "https://picx.zhimg.com/v2-aa8a1823abfc46f14136f01899b1368e.jpg?source=88ceefae"
                };
                obj.vip_info.entrance = {
                    icon: {
                        url: "https://picx.zhimg.com/v2-aa8a1823abfc46f14136f01899b1368e.jpg?source=88ceefae",
                        night_mode_url: "https://picx.zhimg.com/v2-aa8a1823abfc46f14136f01899b1368e.jpg?source=88ceefae"
                    },
                    title: "盐选会员",
                    expires_day: "2099-12-24",
                    sub_title: null,
                    button_text: "续费",
                    jump_url: "zhihu://vip/purchase",
                    button_jump_url: "zhihu://vip/purchase"
                };
                body = JSON.stringify(obj);
            } catch(error) {
                console.log('zhihu people' + error);
            }
            break;
            
        default:
            // 其他通用处理
            try {
                let obj = JSON.parse(body);
                const url = $request.url;
                
                // 云端配置处理
                if (url.includes('m-cloud.zhihu.com') || url.includes('appcloud2.zhihu.com')) {
                    if (obj.config) {
                        if (obj.config.homepage_feed_tab) delete obj.config.homepage_feed_tab.ad;
                        if (obj.config.feed) delete obj.config.feed.ad;
                        if (obj.config.answer) delete obj.config.answer.ad;
                        if (obj.config.video) {
                            obj.config.video.enable_ad = false;
                            obj.config.video.enable_pre_ad = false;
                        }
                        if (obj.config.zhihu) {
                            if (obj.config.zhihu.splash) obj.config.zhihu.splash = {};
                            if (obj.config.zhihu.ad) obj.config.zhihu.ad = {};
                        }
                    }
                }
                
                body = JSON.stringify(obj);
            } catch(e) {
                // 静默处理
            }
            break;
    }
    
    $done({ body });
} else {
    $done({});
}