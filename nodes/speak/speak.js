module.exports = function(RED) {
    "use strict";
    const mustache = require("mustache");
  
    function speak(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.text = n.text;
        node.suggestions = n.suggestions;
        const suggestions = node.suggestions.split(', ');
        this.on("input", function (msg, send, done) {
          if (msg.req) {
            var renderedMsg = mustache.render(node.text, msg);
            msg.req.ask(renderedMsg);
            if (msg.req.isGoogleAction()) {
                if (node.suggestions.length) {  
                    msg.req.$googleAction.showSuggestions(suggestions);   
                }
            }
          }
          send(msg);
        });
      }
      RED.nodes.registerType("voiceapp-speak", speak);
    }
      
