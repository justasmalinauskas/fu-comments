import { PluginHelper } from "../core/pluginHelper.js";

export const delfiGraphQlPlugin = {
    name: 'delfi-comments-graphql-api',
    site: 'delfi',
    urls: [
        "https://api.delfi.lt/comment/v1/graphql*"
    ],
    listener: function(details) {
        const code = async function (filter, responseData) {
            let decoded = JSON.parse(responseData);
            if(!PluginHelper.isIterable(decoded?.data?.getCommentsByArticleId?.comments)) {
                filter.write(new TextEncoder().encode(decoded));
                return;
            }
            let comments = [...decoded.data.getCommentsByArticleId.comments];
            for await (const [key, comment] of comments.entries()) {
                if (comment.author !== null &&  await PluginHelper.isBlocked(delfiGraphQlPlugin.site, comment.author.id) === true) {
                    delete decoded.data.getCommentsByArticleId.comments[key];
                    continue;
                }
                let oldReplies = comment?.replies;
                if(PluginHelper.isIterable(oldReplies)) {
                    let replies = [];
                    for (const reply of oldReplies) {
                        if (reply.author !== null &&  await PluginHelper.isBlocked(delfiGraphQlPlugin.site, reply.author.id) === false) {
                            replies.push(reply)
                        }
                    }
                    decoded.data.getCommentsByArticleId.comments[key].replies = replies;
                }
            }
            decoded.data.getCommentsByArticleId.comments = decoded.data.getCommentsByArticleId.comments.filter(item => item);
            let encoded = JSON.stringify(decoded);
            filter.write(new TextEncoder().encode(encoded));
        }
        PluginHelper.listener(details, code)
    }
};
