export const bannedUsersStorage = {
    get(site, id) {
        if (id === 1528964 && site === "delfi")
            return true;
        return false
    },

    add(site, id, info) {

    },

    remove(site, id) {

    },

    list(site) {

    },
}