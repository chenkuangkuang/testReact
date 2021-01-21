let index = 1;
const render = (vnode, container, curContext) => {
    console.log('=render=', {vnode, renderDom: vnode.renderDom, container, curContext});
    if (container) {
        // console.log('=即将render=');
        if(typeof vnode == 'string'){
            dom = document.createTextNode(vnode)
            dom.renderDom = dom;
            container.appendChild(dom);
            return;
        }
        if(typeof vnode.tag == 'function'){
            const func = vnode.tag;
            const instance = new func(vnode.attrs);
            const innerNode = instance.render();
            const targetDom = render(innerNode, container, instance);
            instance.renderDom = targetDom;
            console.log('=instance=111', instance, innerNode, targetDom);
            instance.componentDidMount && instance.componentDidMount();
            return targetDom;
        }
        let dom;
        if(vnode.tag){
            dom = document.createElement(vnode.tag);
        }
        if(vnode.attrs){
            setDomAttrs(dom, vnode.attrs);
        }
        if(vnode.children){
            vnode.children.map(i=>render(i, dom, dom));
        }
        console.log('=vnode=111', vnode, vnode.renderDom, Object.keys(vnode));
        if(vnode.renderDom){
            const renderer = vnode.render();
            console.log('=111=', 111, renderer, vnode.renderDom, vnode.renderDom.parentNode);
            render(renderer, vnode.renderDom.parentNode, 123)
            return;
        }else{
            // vnode.renderDom = dom;
        }
        console.log('%c container=================', 'color:green;font-size:20px');
        console.log('=container=', container, container.childNodes, dom, (dom && dom.parentNode), vnode);
        if(container){
            const childs = container.childNodes;
            let ret;
            if(curContext == 123){
                return container.replaceChild(dom, childs[0]);
            }
            // if(childs.length){
            //     ret = container.replaceChild(dom, childs[0]);
            // }else{
                ret = container.appendChild(dom);
            // }
            return ret;
        }
    }
}

const setDomAttrs = (dom, attrs)=>{
    console.log('=dom, attrs=', dom, attrs);
    Object.keys(attrs).map(i=>{
        const value = attrs[i] || '';
        if(i == 'style'){
            if(typeof value == 'string'){
                dom.style.cssText = value;
            }else if(typeof value == 'object'){
                Object.keys(value).map(j=>{
                    dom && (dom.style[j] = value[j]);
                })
            }
        }
        else if(i.startsWith('on')){
            dom[i.toLocaleLowerCase()] = value;
        }else{
            dom[i] = value;
        }
    })
}

export default {
    render
}