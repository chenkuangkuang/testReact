import ReactDom from '../react-dom/index';


// 创建虚拟dom，也就是把jsx转换为object
const createElement = (tag, attrs = [], ...children) => {
    const res = {
        tag,
        attrs,
        children
    };
    return res;
}

class Component {
    constructor(props = {}) {
        this.isReactComponent = this.renderDom;

        this.state = {};
        this.props = props;
    }

    setState(newStateObj) {
        this.state = {
            ...this.state,
            ...newStateObj
        }
        ReactDom.render(this, document.getElementById("root"), 123);
    }
}

export default {
    createElement,
    Component
}