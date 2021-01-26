const render = (vnode, container, curContext) => {
    console.log('=render=', { vnode, renderDom: (vnode && vnode.renderDom), container, curContext });
    if (container && vnode) {

        if (vnode.renderDom) {
            const renderer = vnode.render();
            console.log('当前节点已存在，比较已有节点和虚拟节点：', vnode.renderDom, renderer, vnode);
            const targetDom = diffNode(vnode.renderDom, renderer);
            console.log('本次render比较结束=', targetDom, container);
            container.appendChild(targetDom);
            return;
        }
        let dom = renderDom(vnode, container);
        if (container) {
            const childs = container.childNodes;
            let ret;
            if (curContext == 123) {
                return container.replaceChild(dom, childs[0]);
            }
            ret = container.appendChild(dom);
            return ret;
        }
    }
}

const renderDom = (vnode, container) => {
    if (typeof vnode.tag == 'function') {
        const func = vnode.tag;
        const instance = new func(vnode.attrs);
        const innerNode = instance.render();
        const targetDom = render(innerNode, container, instance);
        instance.renderDom = targetDom;
        targetDom._component = instance;
        console.log('=instance=111', instance, innerNode, targetDom);
        instance.componentDidMount && instance.componentDidMount();
        return targetDom;
    }
    let dom;
    if (typeof vnode == 'string') {
        dom = document.createTextNode(vnode);
        // console.log('创建文本节点',);
        // dom.renderDom = dom;
        // dom._component = component;
        container.appendChild(dom);
        return dom;
    }
    if (vnode.tag) {
        dom = document.createElement(vnode.tag);
        // console.log('创建基本节点',);
    }
    if (vnode.attrs) {
        setDomAttrs(dom, vnode.attrs);
    }
    if (vnode.children) {
        vnode.children.map(i => renderDom(i, dom, dom));
    }
    return container.appendChild(dom);

}

const diffNode = (dom, vnode) => {
    console.log('=diffNode=diffNode', dom, vnode);
    let out = dom;
    if (typeof vnode == 'string') {
        if (dom) {
            dom.textContent = vnode;
        } else {
            out = document.createTextNode(vnode);
            if (dom && dom.parentNode) {
                dom.parentNode.replaceChild(out, dom);
            }
        }
        return out;
    }
    if (typeof vnode.tag == 'function') {
        return diffComponent(dom, vnode);
    }
    if (!out) {
        out = document.createElement(vnode.tag);
        console.log('创建dom', out, vnode);
        setDomAttrs(out, vnode.attrs);
    }
    // 如果是普通节点
    // 第一次进入vnode = App 对象， out=当前已存在的dom
    if ((vnode.children && vnode.children.length) || (out.childNodes && out.childNodes.length)) {
        diffChildren(out, vnode.children);
    }

    console.log('321=out, vnode=', out, vnode);
    diffAttributes(out, vnode);

    return out;
}

function diffComponent(dom, vnode) {
    console.log('=diffComponent=', dom, vnode, dom._component, vnode._component);
    // if(dom){
    //     setDomAttrs(dom, vnode.attrs);
    // }
    const component = dom._component;
    console.log('=component=678', component, component.constructor == vnode.tag);
    if (component.constructor == vnode.tag) {
        console.log('组件没有变化', component, vnode);
        // setDomAttrs(component, vnode.attrs);
        component.props = vnode.attrs;

        const renderer = component.render();
        console.log('=renderer=', component.renderDom, renderer);
        component.renderDom = diffNode(component.renderDom, renderer);
        
        dom = component.renderDom;
    } else {
        setDomAttrs(component.renderDom, vnode.attrs);
        dom = component.renderDom;
        const renderer = component.render();
        console.log('=renderer=', component, component.renderDom, renderer);
        let base = diffNode(component.renderDom, renderer);
        component.renderDom = base;
    }

    return dom;
}

export function renderComponent(component) {
    const renderer = component.render();
    console.log('=renderer=', component.renderDom, renderer);
    component.renderDom = diffNode(component.renderDom, renderer);
}

function diffAttributes(dom, vnode) {

    const old = {};    // 当前DOM的属性
    const attrs = vnode.attrs;     // 虚拟DOM的属性

    for (let i = 0; i < dom.attributes.length; i++) {
        const attr = dom.attributes[i];
        old[attr.name] = attr.value;
    }

    // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
    for (let name in old) {

        if (!(name in attrs)) {
            setDomAttrs(dom, name, undefined);
        }

    }

    // 更新新的属性值
    for (let name in attrs) {

        if (old[name] !== attrs[name]) {
            setDomAttrs(dom, name, attrs[name]);
        }

    }

}

function isSameNodeType(dom, vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
        return dom.nodeType === 3;
    }

    if (typeof vnode.tag === 'string') {
        return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
    }

    return dom && dom._component && dom._component.constructor === vnode.tag;
}

function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    console.log('=444=', dom, vchildren, domChildren);
    const children = [];

    const keyed = {};

    if (domChildren.length > 0) {
        for (let i = 0; i < domChildren.length; i++) {
            const child = domChildren[i];
            const key = child.key;
            if (key) {
                keyedLen++;
                keyed[key] = child;
            } else {
                children.push(child);
            }
        }
    }
    // console.log('=555=keyed, children=', keyed, children);

    if (vchildren && vchildren.length > 0) {

        let min = 0;
        let childrenLen = children.length;

        for (let i = 0; i < vchildren.length; i++) {

            const vchild = vchildren[i];
            const key = vchild.key;
            let child;

            if (key) {

                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }

            } else if (min < childrenLen) {

                for (let j = min; j < childrenLen; j++) {

                    let c = children[j];

                    if (c && isSameNodeType(c, vchild)) {

                        child = c;
                        children[j] = undefined;

                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;

                    }

                }

            }
            console.log('=444=555=child=', child, vchild, children);
            child = diffNode(child, vchild);
            const f = domChildren[i];
            // console.log('=555=child', child, f);
            if (child && child !== dom && child !== f) {
                if (!f) {
                    // console.log('=插入dom=2', dom, child);
                    dom.appendChild(child);
                } else if (child === f.nextSibling) {
                    // console.log('=移除dom=2', dom, child);
                    removeNode(f);
                } else {
                    // console.log('=替换dom=2', dom, child);
                    dom.insertBefore(child, f);
                }
            }

        }
    }

}

const setDomAttrs = (dom, attrs) => {
    console.log('=dom, attrs=', dom, attrs);
    if (!attrs) return;
    Object.keys(attrs).map(i => {
        const value = attrs[i] || '';
        if (i == 'style') {
            if (typeof value == 'string') {
                dom.style.cssText = value;
            } else if (typeof value == 'object') {
                Object.keys(value).map(j => {
                    dom && (dom.style[j] = value[j]);
                })
            }
        }
        else if (i.startsWith('on')) {
            dom[i.toLocaleLowerCase()] = value;
        } else {
            dom[i] = value;
        }
    })
}

export default {
    render
}