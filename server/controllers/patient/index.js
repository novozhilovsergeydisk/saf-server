'use strict';

const dto = require('../../lib/DTO/index.js');
const {tmpl} = require('../../lib/Renderer/index.js');

class Patient {
    constructor(res) {
    }

    section() {
        console.log('Форма авторизации');

        return 'section';
    }

    quest_edit_patients() {
        console.log('Ваши измерения и лекарства');

        return 'quest_edit_patients';
    }

    docquest() {
        console.log('Тепловая карта');

        return 'docquest';
    }

    profile() {
        console.log('Профиль пользователя');

        return 'profile';
    }

    after_pat_quest() {
        console.log('Ваша анкета сохранена');

        return 'after_pat_quest';
    }

    auth() {
        console.log('auth');

        return 'auth';
    }
}

module.exports = Patient;