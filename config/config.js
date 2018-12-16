/**
 * Created by porco on 01/03/2017.
 */

/**
 * 开发各自维护
 * @type {{USER_CENTER: {SERVER: {PATH: string, PORT: number}}, SERVER: {ID: string, DOMAIN: string, PATH: string, PORT: number}, CLIENT: {DOMAIN: string, PATH: string, PORT: number}, MONGODB: {PATH: string, PORT: number, USERNAME: string, PASSWORD: string, DATABASE: string, AUTHENTICATIONDATABASE: string}}}
 */
const development =  {
    SERVER: {
        // DOMAIN: 'http://114.212.189.146:14000',
        // DOMAIN: 'http://127.0.0.1:3000',
        DOMAIN: 'http://221.228.66.83:14000',
        PORT: 7070,
    },

    CLIENT: {
        DOMAIN: 'http://127.0.0.1:3330',
        // DOMAIN: 'http://serverhashd.s1.natapp.cc',
        PATH: '127.0.0.1',
        PORT: 3330,
    }
};
/**
 * 禁止修改
 * @type {{USER_CENTER: {SERVER: {PATH: string, PORT: number}}, SERVER: {ID: string, DOMAIN: string, PATH: string, PORT: number}, CLIENT: {DOMAIN: string, PATH: string, PORT: number}, MONGODB: {PATH: string, PORT: number, USERNAME: string, PASSWORD: string, DATABASE: string, AUTHENTICATIONDATABASE: string}}}
 */
const production = {
    SERVER: {
        DOMAIN: 'http://114.212.189.146:14000',
    },
    CLIENT: {
        DOMAIN: 'http://127.0.0.1:3330',
    }
};
let CONFIG = process.env.NODE_ENV === 'development' ? development :
    process.env.NODE_ENV === 'production' ? production : development;

export default CONFIG;
