import React from './react/index';
import styles from './style.less';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        }
    }
    componentDidMount(){
    }

    render() {
        return (
            <div title='header'>
            <h1>我是标题:{this.props.text}</h1>
            </div>
        )
    }
}

export default Header;