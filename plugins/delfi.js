import { PluginHelper } from "../core/pluginHelper.js";
export const delfiPlugin = {
    name: 'delfi-comments-api',
    urls: [
        "https://api.delfi.lt/comment/v1/query/*"
    ],
    listener: function(details) {
        const code = function (filter, responseData) {
            let decoded = JSON.parse(responseData);
            let comments = [...decoded?.data?.getCommentsByConfig?.articleEntity?.comments];

            if (comments !== null && typeof comments.forEach !== "undefined") {
                comments.forEach(function (comment, key) {
                    if (comment.author !== null && PluginHelper.isBlocked('delfi', comment.author.id) === true) {
                        delete decoded?.data?.getCommentsByConfig?.articleEntity?.comments[key];
                        return;
                    }
                    let oldReplies = comment?.replies;
                    if(oldReplies !== null && typeof oldReplies.forEach !== "undefined") {
                        let replies = [];
                        oldReplies.forEach(function (reply, replyKey) {
                            if (reply.author !== null && PluginHelper.isBlocked('delfi', reply.author.id) === false) {
                                replies.push(reply)
                            }
                        }, this);
                        decoded.data.getCommentsByConfig.articleEntity.comments[key].replies = replies;

                    }
                }, this);
                decoded.data.getCommentsByConfig.articleEntity.comments = decoded?.data?.getCommentsByConfig?.articleEntity?.comments.filter(item => item);

            }
            let encoded = JSON.stringify(decoded);
            filter.write(new TextEncoder().encode(encoded));
        }
        PluginHelper.listener(details, code)

    }
};