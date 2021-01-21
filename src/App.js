import React from './react/index';
import styles from './style.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        // console.log('=props=', props);
        this.props = props;
        this.state = {
            text: '原始文本'
        }
    }
    componentDidMount(){
        // console.log('我是componentDidMount',this.setState);
        console.log('====================================================', );
        this.setState({
            text: 'componentDidMount里新设置的值'
        })
    }
    render() {
        // console.log('=this.props=', this.props);
        const { fatherText = '888' } = this.props || {};
        const { text = '默认值' } = this.state;
        // console.log('=app render=', this.props, this.state);
        return (
            <div style={{ border: '1px solid yellow' }} className={'container ' + styles.newStyle}>
            <p>
            props = {fatherText}
            </p>
            <p>
            state = {text}
            </p>
            </div>
        )
    }
}

export default App;