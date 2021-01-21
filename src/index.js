import React from './react/index';
import ReactDom from './react-dom/index';

import App from './App.js';

ReactDom.render(<App fatherText={'123456'} />,  document.getElementById("root"));
