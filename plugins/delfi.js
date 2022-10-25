import { PluginHelper } from "../core/pluginHelper.js";
export const delfiPlugin = {
    name: 'delfi-comments-api',
    site: 'delfi',
    urls: [
        "https://api.delfi.lt/comment/v1/query/*"
    ],
    listener: function(details) {
        const code = async function (filter, responseData) {
            let decoded = JSON.parse(responseData);
            if(!PluginHelper.isIterable(decoded?.data?.getCommentsByConfig?.articleEntity?.comments)) {
                let encoded = JSON.stringify(decoded);
                filter.write(new TextEncoder().encode(encoded));
                return;
            }
            let comments = [...decoded?.data?.getCommentsByConfig?.articleEntity?.comments];
            for await (const [key, comment] of comments.entries()) {
                if (comment.author !== null &&  await PluginHelper.isBlocked(delfiPlugin.site, comment.author.id) === true) {
                    delete decoded?.data?.getCommentsByConfig?.articleEntity?.comments[key];
                    continue;
                }
                let oldReplies = comment?.replies;
                if(PluginHelper.isIterable(oldReplies)) {
                    let replies = [];
                    for (const reply of oldReplies) {
                        if (reply.author !== null &&  await PluginHelper.isBlocked(delfiPlugin.site, reply.author.id) === false) {
                            replies.push(reply)
                        }
                    }
                    decoded.data.getCommentsByConfig.articleEntity.comments[key].replies = replies;
                }

            }

            decoded.data.getCommentsByConfig.articleEntity.comments = decoded?.data?.getCommentsByConfig?.articleEntity?.comments.filter(item => item);

            let encoded = JSON.stringify(decoded);
            filter.write(new TextEncoder().encode(encoded));
        }
        PluginHelper.listener(details, code)

    }
};