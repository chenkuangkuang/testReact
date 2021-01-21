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
        if(vnode.renderDom){
            dom = vnode.renderDom
        }else{
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
            console.log('=111=', 111, dom);
            render(vnode.renderDom, )
            // vnode.renderDom.parentNode.replaceChild(vnode.renderDom, dom);
            return;
        }else{
            // vnode.renderDom = dom;
        }
        let num = index++;
        // console.log('=num=111', num);
        vnode.xxx = num;
        console.log('=container=111================', container, dom, dom.parentNode);
        if(container){
            const childs = container.childNodes;
            // if(dom.parentNode){
            //     container.replaceChild(dom, container.childNodes[0]);
            // }else{
                container.appendChild(dom);
                return dom;
            // }
        }
    }
}

const setDomAttrs = (dom, attrs)=>{
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
        }else{
            dom[i] = value;
        }
    })
}

export default {
    render
}