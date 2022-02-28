module.exports = function(RED) {
    "use strict";
    const mustache = require("mustache");
  
    function card(n) {
      RED.nodes.createNode(this, n);
      var node = this;
      node.cardType = n.cardType;
      node.cardTitle = n.cardTitle;
      node.text = n.text;
      node.cardImage = n.cardImage;
      this.on("input", function (msg, send, done) {
        if (msg.req) {
          var renderedText = mustache.render(node.text, msg);
          var renderedTitle = mustache.render(node.cardTitle, msg);
          if(node.cardtype === "Image") {
            var renderedImage = mustache.render(node.cardImage, msg);
            msg.req.showImageCard(renderedTitle, renderedText, renderedImage);
          } else {
              msg.req.showSimpleCard(renderedTitle, renderedText);
          }
        }
        send(msg);
      });
    }
    RED.nodes.registerType("voiceapp-card", card);
  }
  