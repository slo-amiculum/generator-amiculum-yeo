<% if(jsPreprocessor === 'none'){ %>
'use strict';

// Constructor
var Button = function() {
  this.name = 'Button';
  console.log('Button');
};

module.exports = Button;
<% } else{ %>  
'use strict';

export default class Button {
  constructor() {
    this.name = 'button';
    console.log('Button');
  }
}

<% } %>
