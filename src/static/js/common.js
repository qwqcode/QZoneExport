// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

/**
 * String.format
 * //两种调用方式
 * var template1="我是{0}，今年{1}了";
 * var template2="我是{name}，今年{age}了";
 * var result1=template1.format("loogn",22);
 * var result2=template2.format({name:"loogn",age:22});
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/**
 * 配置项
 */
const CONFIG = {
    DEBUG: false,
    PAGE_SIZE: 30,
    SLEEP_TIME: 500,
};

/**
 * QQ空间Rest API配置
 */
const QZone_URLS = {

    /** 日志列表URL */
    BLOGS_LIST_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/get_abs",

    /** 日志详情URL */
    BLOGS_INFO_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/blognew/blog_output_data",

    /** 私密日志列表URL */
    DIARY_LIST_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/privateblog/privateblog_get_titlelist",

    /** 私密日志详情URL */
    DIARY_INFO_URL: "https://user.qzone.qq.com/proxy/domain/b.qzone.qq.com/cgi-bin/privateblog/privateblog_output_data",

    /** QQ好友列表URL */
    FRIENDS_LIST_URL: "https://h5.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/tfriend/friend_show_qqfriends.cgi",

    /** QQ好友QQ空间个人档资料 */
    QZONE_USER_INFO_URL: "https://h5.qzone.qq.com/proxy/domain/base.qzone.qq.com/cgi-bin/user/cgi_userinfo_get_all",

    /** QQ好友添加时间 */
    USER_ADD_TIME_URL: "https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/friendship/cgi_friendship",

    /** 好友亲密度 */
    INTIMACY_URL: "https://user.qzone.qq.com/proxy/domain/r.qzone.qq.com/cgi-bin/main_page_cgi",

    /** 说说列表URL */
    MESSAGES_LIST_URL: "https://user.qzone.qq.com/proxy/domain/taotao.qq.com/cgi-bin/emotion_cgi_msglist_v6",

    /** 留言板列表URL */
    BOARD_LIST_URL: 'https://user.qzone.qq.com/proxy/domain/m.qzone.qq.com/cgi-bin/new/get_msgb',

    /** 相册列表URL */
    PHOTOS_LIST_URL: 'https://h5.qzone.qq.com/proxy/domain/photo.qzone.qq.com/fcgi-bin/fcg_list_album_v3',

    /** QQ群列表 */
    GROUPS_LIST_URL: 'https://qun.qq.com/cgi-bin/qun_mgr/get_group_list',

    /** QQ群群友列表 */
    GROUPS_MEMBERS_LIST_URL: 'https://qun.qq.com/cgi-bin/qun_mgr/search_group_members'
};

const FOLDER_ROOT = '/QQ空间备份/';
var QZone = {
    ZIP_NAME: 'QQ空间备份.zip',
    Common: {
        uin: null,
        token: null,
        gtk: null,
        Zip: null,
        Filer: null
    },
    // QQ群模块
    Groups: {
        ROOT: FOLDER_ROOT + '群组',
        IMAGES_ROOT: FOLDER_ROOT + '群组/images',
        Data: [],
        Images: []
    },
    // QQ好友模块
    Friends: {
        ROOT: FOLDER_ROOT + '好友',
        IMAGES_ROOT: FOLDER_ROOT + '好友/images',
        Data: [],
        Images: []
    },
    // 日志模块
    Blogs: {
        ROOT: FOLDER_ROOT + '日志',
        IMAGES_ROOT: FOLDER_ROOT + '日志/images',
        Data: [],
        Images: []
    },
    // 日记模块
    Diaries: {
        ROOT: FOLDER_ROOT + '日记',
        IMAGES_ROOT: FOLDER_ROOT + '日记/images',
        Data: [],
        Images: []
    },
    // 相册模块
    Photos: {
        ROOT: FOLDER_ROOT + '相册',
        IMAGES_ROOT: FOLDER_ROOT + '相册/images',
        Data: [],
        Images: []
    },
    // 说说模块
    Messages: {
        ROOT: FOLDER_ROOT + '说说',
        IMAGES_ROOT: FOLDER_ROOT + '说说/images',
        Data: [],
        Images: []
    },
    // 留言板模块
    Boards: {
        ROOT: FOLDER_ROOT + '留言板',
        IMAGES_ROOT: FOLDER_ROOT + '留言板/images',
        Data: [],
        Images: []
    }
};

var API = {};
/**
 * 工具类
 */
API.Utils = {

    /**
     * 写入内容到文件
     * @param {string} content 内容
     * @param {string} filepath FileSystem路径
     * @param {funcation} doneFun 
     * @param {funcation} failFun 
     */
    writeFile: function (content, filepath, doneFun, failFun) {
        QZone.Common.Filer.write(filepath, { data: content, type: "text/plain" }, (fileEntry) => {
            doneFun(fileEntry);
        }, (err) => {
            failFun(err);
        });
    },

    /**
     * 
     * @param {string} url 图片URL
     * @param {string} path FileSystem文件路径
     * @param {funcation} doneFun 
     * @param {funcation} failFun 
     */
    writeImage: function (url, path, doneFun, failFun) {
        if (CONFIG.DEBUG) {
            console.info(url);
        }
        API.Utils.send(url, 10000, 'arraybuffer', (xhr) => {
            var arrayBuffer = xhr.response;
            var byteArray = new Uint8Array(arrayBuffer);
            QZone.Common.Filer.write(path, { data: byteArray.buffer }, (fileEntry) => {
                doneFun(fileEntry);
            }, (err) => {
                failFun(err)
            });
        }, (e) => {
            console.error(e);
            failFun(e);
        });
    },

    /**
     * 压缩
     * @param {string} root 文件或文件夹路径
     * @param {function} doneFun 
     * @param {function} failFun 
     */
    Zip: function (root, doneFun, failFun) {
        let zipOneFile = function (entry) {
            let newName = encodeURIComponent(entry.name);
            let fullPath = entry.fullPath.replace(entry.name, newName);
            QZone.Common.Filer.open(fullPath, (f) => {
                let reader = new FileReader();
                reader.onload = function (event) {
                    QZone.Common.Zip.file(entry.fullPath, event.target.result, { binary: true });
                }
                reader.readAsArrayBuffer(f);
            }, (error) => {
                failFun(error)
            });
        };

        (function (path) {
            let cl = arguments.callee;
            QZone.Common.Filer.ls(path, (entries) => {
                var i = 0;
                for (i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.isDirectory) {
                        QZone.Common.Zip.folder(entry.fullPath);
                        cl(path + entry.name + '/');
                    } else {
                        zipOneFile(entry);
                    }
                }
                doneFun();
            }, () => {
                failFun(error)
            });
        })(root);
    },

    send: function (url, timeout, responseType, doneFun, failFun) {
        var request = new XMLHttpRequest();
        try {
            var time = false;//是否超时
            var timer = setTimeout(function () {
                time = true;
                request.abort();//请求中止
            }, timeout);
            request.open("GET", url, true);
            if (responseType) {
                request.responseType = "arraybuffer";
            }
            request.onreadystatechange = function () {
                if (request.readyState !== 4) {
                    return;//忽略未完成的请求
                }
                if (time) {
                    return;//忽略中止请求
                }
                clearTimeout(timer);//取消等待的超时
                if (request.status === 200) {
                    doneFun(request);
                } else {
                    failFun(request);
                }
            }
            request.send();
        } catch (e) {
            failFun(request);
        }
    },

    /**
     * GET 请求
     * @param {*} url 
     * @param {*} doneFun 
     * @param {*} failFun 
     */
    get: function (url, doneFun, failFun) {
        $.ajax({
            url: url
        })
            .done(function (data, textStatus, jqXHR) {
                if (CONFIG.DEBUG) {
                    console.info(data);
                }
                if (doneFun) {
                    doneFun(data, textStatus, jqXHR);
                } else {
                    return data;
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (CONFIG.DEBUG) {
                    console.error(errorThrown);
                }
                if (failFun) {
                    failFun([], textStatus, errorThrown);
                } else {
                    return [];
                }
            });
    },

    /**
     * POST 请求
     * @param {string} url 
     * @param {object} params 
     * @param {function} doneFun 
     * @param {function} failFun 
     */
    post: function (url, params, doneFun, failFun) {
        $.ajax({
            url: url,
            method: 'POST',
            data: params
        })
            .done(function (data, textStatus, jqXHR) {
                if (CONFIG.DEBUG) {
                    console.info(data);
                }
                if (doneFun) {
                    doneFun(data, textStatus, jqXHR);
                } else {
                    return data;
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (CONFIG.DEBUG) {
                    console.error(errorThrown);
                }
                if (failFun) {
                    failFun([], textStatus, errorThrown);
                } else {
                    return [];
                }
            });
    },

    /**
     * 获取URL参数值
     * @param {string} name 
     */
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },

    /**
     * 获取URL参数值
     * @param {string} url 
     * @param {string} name 
     */
    getUrlParam: function (url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    },

    /**
     * 获取URL参数值
     * @param {string} url 
     */
    toParams: function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },

    /**
     * 通过参数构建URL
     * @param {string} url 
     * @param {object} params 
     */
    toUrl: function (url, params) {
        let paramsArr = [];
        if (params) {
            Object.keys(params).forEach(item => {
                paramsArr.push(item + '=' + params[item]);
            })
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArr.join('&');
            } else {
                url += '&' + paramsArr.join('&');
            }

        }
        return url;
    },

    /**
     * 获得一个Cookie值
     * @param {string} name 
     */
    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    },

    /**
     * 从 HTML 页面找到 token 保存起来
     */
    getQzoneToken: function () {
        $("script").each(function (index) {
            var t = $(this).text();
            t = t.replace(/\ /g, "");
            if (t.indexOf('window.g_qzonetoken') !== -1) {
                var qzonetokenM = /return"(\w*?)";/g;
                var qzonetoken = qzonetokenM.exec(t);
                if (qzonetoken != null && qzonetoken != '') {
                    QZone.Common.token = qzonetoken[1];
                    return false;
                }
            }
        });
        return QZone.Common.token;
    },

    /**
     * 获取QQ号
     */
    getUin: function () {
        var url = window.location.href;
        var UinM = /\/user\.qzone\.qq\.com\/([\d]+)/;
        var r = UinM.exec(url);
        if (r != null) {
            QZone.Common.uin = r[1];
        }
        return QZone.Common.uin;
    },

    /**
     * 生成 g_tk
     * @param {string} url
     */
    gen_gtk: function (url) {
        var skey;
        url = url || window.location.href;
        if (url.indexOf("qzone.qq.com") > 0) {
            skey = this.getCookie("p_skey");
        } else {
            if (url.indexOf("qq.com") > 0) {
                skey = this.getCookie("skey") || this.getCookie("rv2");
            }
        }
        var hash = 5381;
        for (var i = 0, len = skey.length; i < len; ++i) {
            hash += (hash << 5) + skey.charAt(i).charCodeAt();
        }
        return hash & 2147483647;
    },

    /**
     * @param {integer} ms 毫秒
     */
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    /**
     * 生成一个UUID
     */
    guid: function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    /**
     * 去掉标题里不太方便的字符
     *
     * @param {原名} name
     */
    filenameValidate: function (name) {
        name = name.replace(/:/g, "-");
        name = name.replace(/[\\\/\*\"<>|]/g, "_");
        return name;
    },

    /**
     * 按照长度给指定的数字前面补0
     * @param {int} num 
     * @param {int} length 
     */
    prefixNumber: function (num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
};

/**
 * 日志模块API
 */
API.Blogs = {

    decode: function (b) {
        return b && b.replace(/(%2C|%25|%7D)/g, function (b) {
            return unescape(b);
        })
    },

    parseMentionFormat: function (contet, type) {
        if (!contet || 0 > contet.indexOf("@"))
            return contet;
        contet = contet.replace(/%3A/g, ":").replace(/%2C/g, ",");
        return contet = contet.replace(/@\{uin:([^\}]*),nick:([^\}]*?)(?:,who:([^\}]*))?\}/g, function (str, uin, name) {
            var result = "@" + API.Blogs.decode(name);
            switch (type) {
                case 'HTML':
                    result = "<a href='https://user.qzone.qq.com/'" + uin + " target='_blank'>@" + API.Blogs.decode(name) + "</a>";
                    break;
                case 'MD':
                    result = '[@' + name + '](https://user.qzone.qq.com/' + uin + ')';
                    break;
            }
            return result;
        })
    },

    getBlogMediaTypeTitle: function (e) {
        var t = {
            0: "日志中包含图片",
            13: "日志中包含视频"
        };
        for (var i in t) {
            if (this.getEffectBit(e, i)) {
                return t[i];
            }
        }
        return null;
    },

    getBlogLabel: function (e) {
        var t = [["8", "审核不通过"], ["22", "审核中"], ["4", "顶"], ["21", "荐"], ["3", "转"], ["28", "转"], ["35", "转"], ["36", "转"]];
        var i = function (e) {
            for (var i = 0; i < t.length; i++) {
                if (t[i][0] == e) {
                    return t[i][1];
                }
            }
        };
        var a = "";
        for (var o = 0; o < t.length; o++) {
            var n = t[o][0];
            if (n == 22) {
                continue;
            }
            if (this.getEffectBit(e, n)) {
                a += '<span class="' + (n == 3 || n == 28 || n == 35 || n == 36 ? "c_tx3" : "c_tx4") + '" rel="blog-detail-link" blogid="' + e.blogId + '"' + ">[" + t[o][1] + "]</span>";
                if (n == 8) {
                    break;
                }
            }
        }
        return a;
    },

    getEffectBit: function (e, t) {
        if (t < 0 || t > 63) {
            throw new Error("nBit param error")
        }
        if (t < 32) {
            return e.effect1 & 1 << t
        } else if (t < 64) {
            return e.effect2 & 1 << t
        }
    },

    /**
     * 获取日志列表
     *
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getBlogs: function (uin, page, doneFun, failFun) {
        let params = {
            "hostUin": uin,
            "uin": uin,
            "blogType": "0",
            "cateName": "",
            "cateHex": "",
            "statYear": "2019",
            "reqInfo": "7",
            "pos": page * CONFIG.PAGE_SIZE,
            "num": CONFIG.PAGE_SIZE,
            "sortType": "0",
            "source": "0",
            "rand": Math.random(),
            "ref": "qzone",
            "g_tk": API.Utils.gen_gtk(),
            "verbose": "1",
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.BLOGS_LIST_URL, params), doneFun, failFun || doneFun);
    },

    /**
     * 获取日志详情
     *
     * @param {string} uin QQ号
     * @param {integer} blogid 日志ID
     */
    getInfo: function (uin, blogid, doneFun, failFun) {
        let params = {
            "uin": uin,
            "blogid": blogid,
            "styledm": "qzonestyle.gtimg.cn",
            "imgdm": "qzs.qq.com",
            "bdm": "b.qzone.qq.com",
            "mode": "2",
            "numperpage": "15",
            "timestamp": Math.floor(Date.now() / 1000),
            "dprefix": "",
            "inCharset": "gb2312",
            "outCharset": "gb2312",
            "ref": "qzone",
            "page": "1",
            "refererurl": "https://qzs.qq.com/qzone/app/blog/v6/bloglist.html#nojump=1&page=1&catalog=list"
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.BLOGS_INFO_URL, params), doneFun, failFun || doneFun);
    }

};

/**
 * 日记模块API
 */
API.Diaries = {

    /**
     * 获取私密日志列表
     *
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getDiaries: function (uin, page, doneFun, failFun) {
        let params = {
            "uin": uin,
            "vuin": uin,
            "pos": page * CONFIG.PAGE_SIZE,
            "numperpage": CONFIG.PAGE_SIZE,
            "pwd2sig": "",
            "r": Math.random(),
            "fupdate": "1",
            "iNotice": "0",
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "format": "jsonp",
            "ref": "qzone",
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.DIARY_LIST_URL, params), doneFun, failFun || doneFun);
    },

    /**
    * 获取私密日志详情
    *
    * @param {string} uin QQ号
    * @param {integer} blogid 日志ID
    */
    getInfo: function (uin, blogid, doneFun, failFun) {
        let params = {
            "uin": uin,
            "blogid": blogid,
            "pwd2sig": "",
            "styledm": "qzonestyle.gtimg.cn",
            "imgdm": "qzs.qq.com",
            "bdm": "b.qzone.qq.com",
            "rs": Math.random(),
            "private": "1",
            "ref": "qzone",
            "refererurl": "https://qzs.qq.com/qzone/app/blog/v6/bloglist.html#nojump=1&catalog=private&page=1"
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.DIARY_INFO_URL, params), doneFun, failFun || doneFun);
    }
};

/**
 * QQ好友模块API
 */
API.Friends = {

    /**
     * 获取QQ好友列表
     * @param {string} uin QQ号
     */
    getFriends: function (uin, doneFun, failFun) {
        let params = {
            "uin": uin,
            "follow_flag": "1",
            "groupface_flag": "0",
            "fupdate": "1",
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.FRIENDS_LIST_URL, params), doneFun, failFun || doneFun);
    },

    /**
     * 获取QQ好友详情
     */
    getQzoneUserInfo: function (uin, doneFun, failFun) {
        let params = {
            "uin": uin,
            "vuin": QZone.Common.uin,
            "fupdate": "1",
            "rd": Math.random(),
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.QZONE_USER_INFO_URL, params), doneFun, failFun || doneFun);
    },

    /**
     * 获取QQ好友添加时间
     * @param {string} uin 好友QQ号
     */
    getFriendshipTime: function (uin, doneFun, failFun) {
        let params = {
            "activeuin": QZone.Common.uin,
            "passiveuin": uin,
            "situation": "1",
            "isCalendar": "1",
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.USER_ADD_TIME_URL, params), doneFun, failFun || doneFun);
    },

    /**
     * 获取好友亲密度
     * @param {string} uin 搜索的QQ号
     */
    getIntimacy: function (uin, doneFun, failFun) {
        let params = {
            "uin": uin,
            "param": "15",
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.INTIMACY_URL, params), doneFun, failFun);
    }
};

/**
 * 说说模块API
 */
API.Messages = {

    /**
     * 获取说说列表
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getMessages: function (uin, page, doneFun, failFun) {
        let params = {
            "uin": uin,
            "ftype": "0",
            "sort": "0",
            "pos": page * CONFIG.PAGE_SIZE,
            "num": CONFIG.PAGE_SIZE,
            "replynum": "100",
            "g_tk": API.Utils.gen_gtk(),
            "callback": "_preloadCallback",
            "code_version": "1",
            "format": "jsonp",
            "need_private_comment": "1",
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.MESSAGES_LIST_URL, params), doneFun, failFun || doneFun);
    }
};

/**
 * 留言板模块API
 */
API.Boards = {

    /**
     * 获取留言板列表
     * @param {string} uin QQ号
     * @param {integer} page 第几页
     */
    getBoards: function (uin, page, doneFun, failFun) {
        let params = {
            "uin": uin,
            "hostUin": uin,
            "start": page * CONFIG.PAGE_SIZE,
            "s": Math.random(),
            "format": "jsonp",
            "num": CONFIG.PAGE_SIZE,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "g_tk": API.Utils.gen_gtk(),
            "qzonetoken": QZone.Common.token
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.BOARD_LIST_URL, params), doneFun, failFun || doneFun);
    }
};

/**
 * 相册模块API
 */
API.Photos = {

    /**
     * 获取相册列表
     * @param {string} uin QQ号
     */
    getPhotos: function (uin, doneFun, failFun) {
        let params = {
            "g_tk": API.Utils.gen_gtk(),
            "callback": "shine0_Callback",
            "t": String(Math.random().toFixed(16)).slice(-9).replace(/^0/, '9'),
            "hostUin": uin,
            "uin": uin,
            "appid": "4",
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "source": "qzone",
            "plat": "qzone",
            "format": "jsonp",
            "notice": "0",
            "filter": "1",
            "handset": "4",
            "pageNumModeSort": "40",
            "pageNumModeClass": "15",
            "needUserInfo": "1",
            "idcNum": "4",
            "callbackFun": "shine0",
            "_": Date.now()
        };
        return API.Utils.get(API.Utils.toUrl(QZone_URLS.PHOTOS_LIST_URL, params), doneFun, failFun || doneFun);
    },

    /**
     * 获取相片外链(无权限也可以访问)
     */
    getExternalUrl: function (oldurl) {
        let reg = /http\w?:\/\/.*?\/psb\?\/(.*?)\/(.*?)\/\w\/(.*?)$/gi
        let result;
        let newurl;
        if ((result = reg.exec(oldurl)) !== null) {
            newurl = "//r.photo.store.qq.com/psb?/" + result[1] + "/" + result[2] + "/r/" + result[3] + "_yake_qzoneimgout.png";
            return newurl;
        } else {
            return null;
        }
    }

};

/**
 * QQ群模块API
 */
API.Groups = {

    /**
     * 获取QQ群列表
     * @param {string} uin QQ号
     */
    getGroups: function (doneFun, failFun) {
        let params = {
            "bkn": API.Utils.gen_gtk()
        };
        return API.Utils.post(QZone_URLS.GROUPS_LIST_URL, params, doneFun, failFun || doneFun);
    },

    /**
     * 获取QQ群有列表
     * @param {string} gc 群号
     */
    getMembers: function (gc, start, end, doneFun, failFun) {
        let params = {
            "gc": gc, //群号
            "st": start,
            "end": end,
            "sort": '0',
            "bkn": API.Utils.gen_gtk()
        };
        return API.Utils.post(QZone_URLS.GROUPS_MEMBERS_LIST_URL, params, doneFun, failFun || doneFun);
    }

};

/**
 * 测试模块，不成熟或不能使用的API
 */
API.Test = {

    /**
     * 获得一个Cookie值
     * @param {string} name 
     */
    getCookie: function (url, name) {
        return chrome.cookies.get({
            url: url,
            name: name
        }, function (cookie) {
            console.info(cookie);
        });
    },

    /**
     * 获取某网站的所有Cookies
     * @param {string} name
     */
    getAllCookie: function (url) {
        chrome.cookies.getAll({ url }, cookies => {
            console.info(cookies);
        });
    }
}