"use strict";
import riot from 'riot';
import viewCreator from '../lean-view';

class Hub {
    constructor(emitter){
        this._view = null;
        this._busy = false;
        this._routes = {};
        this._defaultRoute = null;
        this._location = null;
        this._emitter = emitter;
    }

    startup(){
        this._parseRoute();
        riot.route.base('/');
        riot.route(this._doRoute.bind(this));
        Util.nextTick(()=>{
            riot.route.start();
            riot.route.exec();
        });
        return this;
    }

    _routeParser(path){
        let req = {};
        let [uri, queryString] = path.split('?');
        let prefix = null;
        if(this.location){
            prefix = Util.compareUrl(this.location, uri);
        }
        let uriParts = uri.split('/');
        req.params = {};
        req.paramList = [];
        if(uri.match(/_(\w+)/g)){
            req.paramList = uriParts.filter(p => p.match(/_(\w+)/g)).map(o => o.slice(1));
        }

        req.query = {};
        if(queryString){
            queryString.split('&').map(i=>req.query[i.split('=')[0]] = i.split('=')[1]);
        }

        if(this.location){
            //check state changed or not
            if(this.location === '/' + uri){
                //sync state
                this.trigger('sync-state-query', req.query)
                return null;
            }
        }

        req.hints = [];
        if(uriParts.length){
            req.hints = uriParts.map((i, index) => {
                if(index === 0){
                    return i;
                }
                return Util.combineUriParts(uriParts, index, i);
            });
        }
        if(prefix){
            req.hints = req.hints.filter(hint => hint.length > prefix.length);
            if(!req.hints.length){
                return null;
            }
        }        
        return req;
    } 

    _parseRoute(){
        riot.route.parser(this._routeParser.bind(this));
        return this;     
    }

    search(param, value){
        this.trigger('state-search', {param, value})
        return this;
    }

    registerRoute ({path, name, resolve, redirectTo, ...rest}, container){
        this.view.init(container.tags[name], name);
        this.routes[path] = {
            resolve,
            redirectTo,
            tag: container.tags[name],
            ...rest
        };
        return this;
    }

    recursiveHints(hints, context, req, addons){
        let me = this;
        let {isFounded, isBreak} = addons;
        if(!hints.length || isBreak){
            this.busy = false;
            this.trigger('busy-resolve');
            return;
        }
        let path = hints[0];
        let request = {};
        let {route, params, $state, $location} = this._getMetaDataFromRouteMap(path);
        console.warn(route);
        if(!route){
            return me.recursiveHints(hints.slice(1), context, req, addons);
        }
        let tag = route.tag;
        addons.isFounded = true;
        request.params = params;
        request.query = req.query;
        request.body = Util.omit(route, "resolve", "redirectTo", "tag") || {};
        let ctx = {
            request
        };
        if(context){
            Object.assign(context.request, {params: ctx.request.params, query: ctx.request.query, body: ctx.request.body || {}});
            ctx = context
        }
        if((!tag.hasOwnProperty('show') || tag.show) 
            && Util.completePart(path) === this.location){
            return me.recursiveHints(hints.slice(1), ctx, req, addons);
        }
        this.trigger('state-change', {$state, $location, ctx});
        let p = {
            hints,
            req,
            addons,
            route,
            tag,
            $state,
            $location
        }
        if(route.redirectTo){
            isBreak = true;
            return riot.route(route.redirectTo);
        }
        if(route.resolve){
            return route.resolve.apply(tag, [(data) => {this.recursiveDone(data, ctx, p)}, ctx]);
        }
        this.recursiveDone(null, ctx, p);
    }

    recursiveDone(data, ctx, {hints, req, addons, route, tag, $state, $location}){
        let me = this;
        if(ctx && data){
            !ctx.body && (ctx.body = {});
            Object.assign(ctx.body, data);
        }
        let RAFId = requestAnimationFrame(() => {
            me.trigger('history-pending',
                me._getMetaDataFromRouteMap(me.location).route, 
                $state,
                $location,
                ctx,
                me._executeMiddlewares(
                    tag, 
                    tag.$mws,
                    ctx, 
                    () => {
                        me.recursivePendingDone(data, ctx, {hints, req, addons, route, tag, $state, $location})
                    }
                ),
            );
            cancelAnimationFrame(RAFId); 
            RAFId = undefined;
        });
    }

    recursivePendingDone(data, ctx, {hints, req, addons, route, tag, $state, $location}){
        let me = this;
        let from = me._getMetaDataFromRouteMap(me.location).route;
        let to = route;
        let RAFId = requestAnimationFrame(() => {
            cancelAnimationFrame(RAFId);
            RAFId = undefined;
            me.trigger('history-resolve', 
                from, 
                to, 
                ctx, 
                hints, 
                () => {
                    me.trigger('history-success',
                        from, 
                        to
                    );
                    me.location = $location;
                    me.recursiveHints(hints.slice(1), ctx, req, addons);
                }
            )
        })
    }

    _doRoute(req){
        if(!req){
            return;
        }
        let addons = {
            isFounded: false,
            isBreak: false
        }
        this.busy = true;
        this.trigger('busy-pending');
        this.recursiveHints(req.hints, null, req, addons);
        if(!addons.isFounded){
            try{
                let url = this.defaultRoute.path;
                let paramsParts = url.match(/_[a-zA-Z0-9:]+/g);
                this.busy = false;
                this.trigger('busy-resolve');
                if(paramsParts && paramsParts.length){
                    paramsParts.map(part=>{
                        let key = part.slice(2);
                        let value = this.defaultRoute.defaultRoute.params
                            && this.defaultRoute.defaultRoute.params[key]
                            || "";
                        url = url.replace(new RegExp('_:' + key + '+'), '_' + value);
                    });
                }
                riot.route(url);
            }catch(e){
                this.busy = false;
                this.trigger('busy-resolve');
                console.warn(e);
                console.info('404')
            }
        }
    }

    /**
     * Exchange control flow to hub from riot router
     */
    go(url){
        riot.route(url);
        return this; 
    }

    _getMetaDataFromRouteMap(routeKey){
        routeKey = routeKey && routeKey.startsWith('/') ? routeKey : '/' + routeKey;
        let keys = Object.keys(this.routes);
        for(let i=0, len=keys.length; i<len; i++){
            let k = keys[i];
            let route = this.routes[k];
            if(Util.toPattern(k) === Util.toPattern(routeKey)){
                let paramKeys = (Util.extractParams(k) || []).map(i=>i.slice(2));
                let paramValues = (Util.extractParams(routeKey) || []).map(i=>i.slice(1));
                return {
                    route,
                    $state: k,
                    $location: routeKey,
                    params: Util.composeObject(paramKeys, paramValues)
                };
            }
        }
        return {
            tag: null,
            params: null
        };
    }

    _executeMiddlewares(component, mws, ctx, done){
        let me = this;
        return function nextFn(){
            if(!mws || !mws.length){
                return done();
            }
            mws[0].call(component, () => me._executeMiddlewares(component, mws.slice(1), ctx, done)(), ctx);
        }
    }

    get view(){
        return this._view;
    }

    set view(val){
        this._view = val;
    }

    get busy(){
        return this._busy;
    }

    set busy(val){
        this._busy = val;
    }

    get routes(){
        return this._routes;
    }

    set routes(val){
        this._routes = val
    }

    get defaultRoute(){
        return this._defaultRoute;
    }

    set defaultRoute(val){
        this._defaultRoute = val;
    }

    get location(){
        return this._location;
    }

    set location(val){
        this._location = val
    }

    trigger(...args){
        return this._emitter.trigger.apply(this._emitter, args);
    }

    on(...args){
        return this._emitter.on.apply(this._emitter, args);
    }

    off(...args){
        return this._emitter.off.apply(this._emitter, args);
    }

    one(...args){
        return this._emitter.one.apply(this._emitter, args);
    }
}

class Util {
    static completePart(uri){
        return uri.startsWith('/') ? uri : ('/' + uri);
    }
    
    static omit(o, ...params){
        var res = {};
        for(var p in o){
            if(params.indexOf(p) < 0){
                res[p] = o[p]
            }
        }
        return res;
    }

    static compareUrl(u1, u2){
        var r = [];
        var arr1 = u1.split('/');
        var arr2 = u2.split('/');
        for(var i = 0, len = arr1.length; i<len; i++){
            if(arr1[i] === arr2[i]){
                r.push(arr1[i]);
            }else{
                break;
            }
        }
        return r.join('/')
    }

    static combineUriParts(parts, i, combined){
        if(!parts.length || i<=0){
            return combined;
        }
        let uri = parts[i-1] + '/' + combined;
        return Util.combineUriParts(parts, --i, uri);
    }

    static composeObject(ks, vs){
        var o = {};
        if(!Array.isArray(ks) || !Array.isArray(vs) || ks.length != vs.length){
            return o;
        }
        ks.forEach((k, index)=>{
            o[k] = vs[index]
        });
        return o;
    }

    static extractParams(path){ 
        return path.match(/_[a-zA-Z0-9:]+/g)
    }

    static toPattern(route){
        return route.replace(/_[a-zA-Z0-9:]+/g, "*");   
    }

    static nextTick(fn){
        return setTimeout(fn, 0);
    }

}

var hub = new Hub(riot.observable());

hub.view = viewCreator(hub);

export default { hub: hub, router: (history) => ({
    defaultRoute: null,

    prefixPath: '',

    routesMap: null,

    _registerRoute: function({path, name, resolve, redirectTo, ...rest}, container){
        let me = this;
        if(!me.routesMap){
            me.routesMap = {};
        }
        me.routesMap[path] = {
            name,
            resolve,
            tag: container.tags[name]};
        hub.registerRoute({path: me.prefixPath + path, name, resolve, redirectTo, ...rest}, container);
        return this;
    },

    prefix: function(prefix){
        this.prefixPath = prefix;
        return this;
    },

    $use: function(fn){
        !this.$mws && (this.$mws = []);
        this.$mws.push(fn);
    },

    $routeConfig: function(routes){
        if(!this.prefixPath && this.parent && this.parent.routesMap){
            this.prefixPath = (this.parent.prefixPath || '') + getPrefix(this);
        }
        routes.forEach(route=>{
            if(route.defaultRoute){
                hub.defaultRoute = route;
            }
            this._registerRoute(route, this);
        });
        function getPrefix(tag){
            let returnPath = '';
            Object.keys(tag.parent.routesMap).forEach(path=>{
                let route = tag.parent.routesMap[path];
                if(route.name === getTagName(tag)){
                    returnPath = path
                }
            });
            return returnPath;
        }
        function getTagName(tag){
            return tag.root.localName;
        }
    }
})};