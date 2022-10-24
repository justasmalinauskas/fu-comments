export const pluginRunner = {

    plugins: [],

    addPlugin(plugin) {
        this.plugins.push(plugin)
    },


    run() {
        this.plugins.forEach(function (plugin, key) {
            browser.webRequest.onBeforeRequest.addListener(
                plugin.listener,
                {
                    urls: plugin.urls
                },
                ["blocking"]
            );
        });
    }
};