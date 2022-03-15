module.exports = function(RED) {
    "use strict";
    const mustache = require("mustache");
  
    function speak(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.text = n.text;
        node.suggestions = n.suggestions;

        this.on("input", function (msg, send, done) {
          if(node.suggestions) {
            msg.suggestions = node.suggestions.split(', ');
          }
          if (msg.req) {
            var renderedMsg = mustache.render(node.text, msg);
            msg.req.ask(renderedMsg);
            if (msg.req.isGoogleAction()) {
                if (node.suggestions) {  
                    msg.req.$googleAction.showSuggestions(msg.suggestions);   
                }
            }
          }
          send(msg);
        });
      }
      RED.nodes.registerType("voiceapp-speak", speak);
    }
      
