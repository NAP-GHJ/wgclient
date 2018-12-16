'use strict';

module.exports = {
    JSONToUrlEncode
};

/**
 * json < = > urlcode
 * @param json // { id: 1, xxx: 'xxx' }
 * @constructor
 * @example
 * const json = {
            id: 11,
            name: 222
        };
 const jtu = new JSONToUrlEncode(json);
 const encode = jtu.urlEncode(); // id%3D11%26name%3D222
 const str = jtu.urlStr(); // id=11&name=222
 */
function JSONToUrlEncode(json) {
    if (json) {
        this.json = json;
        this.keys = this.getKeys();
        this.setStr();
    }
}
JSONToUrlEncode.prototype.urlEncode = function () {
    return encodeURIComponent(this.str);
};
JSONToUrlEncode.prototype.urlStr = function () {
    return this.str;
};

JSONToUrlEncode.prototype.getKeys = function () {
    return Object.keys(this.json);
};
JSONToUrlEncode.prototype.getParame = function (key) {
    const parame = this.json[key];
    if (typeof parame === 'string' && parame.constructor === String) {
        return `${key}=${this.json[key]}`;
    } else {
        return `${key}=${JSON.stringify( this.json[key])}`;
    }
};
JSONToUrlEncode.prototype.getParames = function () {
    let str = '';
    for(const [i, k] of this.keys.entries()) {
        str += `${this.getParame(k)}${i === this.keys.length - 1 ? '' : '&'}`;
    }
    return str;
};
JSONToUrlEncode.prototype.setStr = function () {
    this.str = this.getParames();
};
