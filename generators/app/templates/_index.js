<% if(jsPreprocessor === 'none'){ %>require('./src/_styles/main.scss');
require('./src/_scripts/main.js');
<% } else{ %>import './src/_styles/main.scss';
import './src/_scripts/main.js';
<% } %>
