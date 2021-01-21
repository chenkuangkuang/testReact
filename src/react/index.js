import ReactDom from '../react-dom/index';


// 创建虚拟dom，也就是把jsx转换为object
const createElement = (tag, attrs, ...children) => {
    const res = {
        tag,
        attrs,
        children
    };
    // console.log('createElement=', res);
    return res;
}

class Component {
    constructor(props = {}) {
        this.isReactComponent = this.renderDom;

        this.state = {};
        this.props = props;
    }

    setState(newStateObj) {
        // console.log('=this.state=', this.state, newStateObj);
        this.state = {
            ...this.state,
            ...newStateObj
        }
        console.log('=this.state=111', { ...this });
        // const newDom = this.render();
        // console.log('=newDom=', newDom);
        ReactDom.render(this, document.getElementById("root"), 123);
    }
}

// function Component(props) {
//     console.log('Component=props=', props);
//     this.props = props;
//     this.setState = function(newStateObj){
//         console.log('=this.state=', this.state, newStateObj);
//         this.state = {
//             ...this.state,
//             ...newStateObj
//         }
//         console.log('=this.state=111', {...this});
//         // const newDom = this.render();
//         // console.log('=newDom=', newDom);
//         ReactDom.render(this, document.getElementById("root"));
//     }
// }

export default {
    createElement,
    Component
}