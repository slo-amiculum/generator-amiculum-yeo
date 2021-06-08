<% if(jsPreprocessor === 'none'){ %>
require('./src/_styles/_fonts.scss');
require('./src/_styles/_var.scss');
require('./src/_styles/_styles.scss');
require('./src/_styles/main.scss');
require('./src/_scripts/main.js');
<% } else{ %>
import './src/_styles/_fonts.scss';
import './src/_styles/_var.scss';
import './src/_styles/_styles.scss';
import './src/_styles/main.scss';
import './src/_scripts/main.js';
<% } %>
