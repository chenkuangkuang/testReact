在组件的点击事件里使用setState，进入以下步骤：

1.进入原始类Component里面的setState，执行ReactDom.render(this, document.getElementById("root"));

2.在render函数里判断if (vnode.renderDom) 为真，表示当前虚拟dom的真实节点已存在，进入diffNode

3.在diffNode里，进入第四个判断，进入diffChildren，比较真实dom和虚拟dom的子节点

4.在diffChildren里，进入第二个判断，if (vchildren && vchildren.length > 0) ，vchildren循环，并进入if (min < childrenLen)

5.在vchildren的第一次循环里，child= <div title=​"header">​…​</div>​， vchild={attrs: {…}, children: Array(0), tag: ƒ}（即新的虚拟dom，attrs: {text: "新的header"}），进入diff函数，比较child和vchild

6.在diffNode里，vnode（也就是上一行的vchild）的tag == function，进入diffComponent

7.在diffComponent函数里，赋值 component = dom._component （真实dom的_component指向对应的实例对象）,并进入判断 component.constructor == vnode.tag，表示组件本身没有变化（类型没变，不需要卸载）,取vnode.attrs 赋值给component.props，再执行component.render，得到新的虚拟dom赋值给renderer，再进入diffNode，比较实例对象的真实dom（component.renderDom）和新生成的 renderer

8.在diffNode里，dom=<div title=​"header">​…​</div>， vnode = {tag: "div", attrs: {…}, children: Array(1)}，进入第四个判断，进入diffChildren

9.在diffChildren函数里，这次比较的是div.header和{tag: "h1", attrs: null, children: Array(2)}，进入vchildren循环，child=<h1></h1>,vchild = {tag: "h1", attrs: null, children: Array(2)}，再进入diffNode

10.在diffNode里，进入第四个判断，又进入diffChildren，再进入循环，child=新的header，vchild=新的header，进入diff，

11.在diff里，进入第一个判断的第一个判断，dom.textContent = vnode