import React from './react/index';
import styles from './style.less';
import Header from './Header';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            text: '原始文本',
            headerText: '标题1'
        }
    }
    componentDidMount() {
        console.log('APP的componentDidMount====================================================',);
    }
    componentWillReceiveProps(nextProps) {
    }
    handleClick() {
        console.clear();
        this.setState({
            text: '点击事件里新设置的值',
            headerText: '新的header'
        })
    }
    render() {
        const { fatherText = '888' } = this.props || {};
        const { text = '默认值' } = this.state;
        return (
            <div style={{ border: '1px solid yellow' }} className={'container ' + styles.newStyle}>
                <Header text={this.state.headerText} />
                <p>
                    props = {fatherText}
                </p>
                <p>
                    state = {text}
                </p>
                <p><a onClick={this.handleClick.bind(this)}>点击我</a></p>
            </div>
        )
    }
}

export default App;