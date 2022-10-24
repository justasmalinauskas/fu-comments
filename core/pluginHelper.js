import { bannedUsersStorage } from "../core/bannedUsersStorage.js";


export const PluginHelper = {
    listener(details, code) {
        const decoder = new TextDecoder("utf-8");
        let filter = browser.webRequest.filterResponseData(details.requestId);
        const data = [];
        filter.ondata = (event) => {
            data.push(decoder.decode(event.data, {stream: true}));
        };

        /*let responseData = new ArrayBuffer(0);
        filter.ondata = event => {
            let tmpBuffer = new Uint8Array(responseData.byteLength + event.data.byteLength);
            tmpBuffer.set(new Uint8Array(responseData), 0);
            tmpBuffer.set(new Uint8Array(event.data), responseData.byteLength);
            responseData = tmpBuffer.buffer;
        };*/

        filter.onstop = async () => {
            try {
                data.push(decoder.decode());
                let responseData = data.join("");
                code(filter, responseData);
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
        return bannedUsersStorage.get(site, id);
    },
    JSONlistener(details, code) {
        const decoder = new TextDecoder("utf-8");
        let filter = browser.webRequest.filterResponseData(details.requestId);
        const data = [];
        filter.ondata = (event) => {
            data.push(event.data);
        };

        /*let responseData = new ArrayBuffer(0);
        filter.ondata = event => {
            let tmpBuffer = new Uint8Array(responseData.byteLength + event.data.byteLength);
            tmpBuffer.set(new Uint8Array(responseData), 0);
            tmpBuffer.set(new Uint8Array(event.data), responseData.byteLength);
            responseData = tmpBuffer.buffer;
        };*/

        filter.onstop = event => {
            console.log([
                event,
                data.length
            ]);
            if(data.length === 0) {
                filter.disconnect();
                return ;
            }
            let str = "", decoder = new TextDecoder("utf-8");
            let arrayLength = data.length;
            for(let i = 0 ; i < arrayLength; i++) {
                str += decoder.decode(data[i], {stream:true});
            }
            str += decoder.decode(); // end-of-queue
            try {
                const responseData = JSON.parse(str);
                code(filter, responseData);
                filter.close();

            } catch (e) {
                console.error(e);
                filter.disconnect();
                //filter.write(responseData);
            }
        };
    }
}