// Main javascript entry point
// Should handle bootstrapping/starting application
<% if(jsPreprocessor === 'none'){ %>'use strict';
var Button = require('../_modules/atoms/button/button');
$(function() {
  new Button(); // Activate Link modules logic
});
<% } else{ %>'use strict';
import Button from '../_modules/atoms/button/button';
$(() => {
  new Button();
});
<% } %>
