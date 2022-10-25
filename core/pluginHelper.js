import {bannedUsersStorage} from "../core/bannedUsersStorage.js";


export const PluginHelper = {
    listener(details, code) {
        const decoder = new TextDecoder("utf-8");
        let filter = browser.webRequest.filterResponseData(details.requestId);
        const data = [];
        filter.ondata = (event) => {
            data.push(event.data);
        };
        filter.onstop = async () => {
            if (data.length === 0) {
                filter.disconnect();
                return;
            }
            let str = "", decoder = new TextDecoder("utf-8");
            let arrayLength = data.length;
            for (let i = 0; i < arrayLength; i++) {
                str += decoder.decode(data[i], {stream: true});
            }
            str += decoder.decode(); // end-of-queue
            try {
                await code(filter, str);
                filter.close();

            } catch (e) {
                console.error(e);
                filter.disconnect();
                //filter.write(responseData);
            }
        };
        return {};
    },

    isBlocked(site, id) {
        return bannedUsersStorage.get(site, id).then((item) => {
            return (item !== null);
        });

    },
    isIterable(input) {
        if (input === null || input === undefined) {
            return false
        }

        return typeof input[Symbol.iterator] === 'function'
    }
}