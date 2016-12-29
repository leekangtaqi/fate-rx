import Cookies from '../framework/cookie';
import originConfig from '../../server/config/environment/shared';

const bootstrap = async (app, {origin}) => {
    let {env, store} = app;
    let config = originConfig[env];
    let dispatch = store.dispatch;
    
    console.warn(`[origin] = ${origin}`);
    console.warn(`[system] = domain list`);
    console.warn(config.apiUri);
    console.warn(`[system] = domain `);
    let domain = config.apiUri[origin]
    console.warn(domain);
    Object.assign($, $.ajax.base(`${domain}`));
    
    $.setErrorInterceptor((e, chain) => {
        let response = e.response;
        if(!response){
            console.error("[action Failed]")
            console.error(e);
            return;
        }
        if(response && response.status === 401) {
            
        }
    })

    $.addResponseInterceptor(response => {
        return response;
    })

}
export default bootstrap;