import {bannedUsersStorage} from "../core/bannedUsersStorage.js";

const fetchSettingsButton = document.querySelector('#fetchSettings');
const currentSettingsDiv = document.querySelector('#currentSettings');
const addSiteInput = document.querySelector('#addSite');
const addIdInput = document.querySelector('#addId');
const addSettingsButton = document.querySelector('#addSettings');


fetchSettingsButton.addEventListener('click', (event) => {
    try {
        const items = bannedUsersStorage.getAll();
        items.then(function (data) {
            currentSettingsDiv.textContent = JSON.stringify(data, undefined, 2);
        })
    } catch (e) {
        console.error(e)
    }
});
const isEmpty = str => !str.trim().length;

addSettingsButton.addEventListener('click', (event) => {
    try {
        if(isEmpty(addSiteInput.value) || isEmpty(addIdInput.value)) {
            alert("Site and id can not be empty");
            return;
        }
        bannedUsersStorage.add(addSiteInput.value, addIdInput.value).then(r => async function () {
            const items = bannedUsersStorage.getAll();
            items.then(function (data) {
                currentSettingsDiv.textContent = JSON.stringify(data, undefined, 2);
            })
        });

    } catch (e) {
        console.error(e)
    }
});