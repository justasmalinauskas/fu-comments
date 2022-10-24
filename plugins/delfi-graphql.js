import { PluginHelper } from "../core/pluginHelper.js";

export const delfiGraphQlPlugin = {
    name: 'delfi-comments-graphql-api',
    urls: [
        "https://api.delfi.lt/comment/v1/graphql*"
    ],
    listener: function(details) {
        const code = function (filter, decoded) {
            let comments = [...decoded?.data?.getCommentsByArticleId?.comments];
            console.log(comments);
            if (comments !== null && typeof comments.forEach !== "undefined") {
                comments.forEach(function (comment, key) {
                    if (comment.author !== null && PluginHelper.isBlocked('delfi', comment.author.id) === true) {
                        delete decoded?.data?.getCommentsByArticleId?.comments[key];
                        return;
                    }
                    let oldReplies = comment?.replies;
                    if(oldReplies !== null && typeof oldReplies.forEach !== "undefined") {
                        let replies = [];
                        oldReplies.forEach(function (reply) {
                            if (reply.author !== null && PluginHelper.isBlocked('delfi', reply.author.id) === false) {
                                replies.push(reply)
                            }
                        }, this);
                        decoded.data.getCommentsByArticleId.comments[key].replies = replies;

                    }
                }, this);
                decoded.data.getCommentsByArticleId.comments = decoded?.data?.getCommentsByArticleId?.comments.filter(item => item);

            }
            let encoded = JSON.stringify(decoded);
            filter.write(new TextEncoder().encode(encoded));
        }
        PluginHelper.JSONlistener(details, code)
    }
};
