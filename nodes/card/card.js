module.exports = function(RED) {
    "use strict";
    const mustache = require("mustache");
  
    function card(n) {
      RED.nodes.createNode(this, n);
      var node = this;
      node.cardTitle = n.cardTitle;
      node.text = n.text;
      node.cardImage = n.cardImage;
      node.cardButtonTitle = n.cardButtonTitle;
      node.cardButtonUrl = n.cardButtonUrl;

      this.on("input", function (msg, send, done) {

        var cardPropeties = {};
        if(node.text) {
          var text = mustache.render(node.text, msg);
          cardPropeties = (text);
        } else {
          var text = "";
        }

        if(node.cardTitle) {
          var title = mustache.render(node.cardTitle, msg);
          cardPropeties += title;
        } else {
          var title = "";
        }

        if(node.cardImage) {
          var image = mustache.render(node.cardImage, msg);
          cardPropeties += image;
        } else {
          var image = "";
        }

        if(node.cardButtonUrl) {
          var buttonTitle = mustache.render(node.cardButtonTitle, msg);
          var buttonUrl = mustache.render(node.cardButtonUrl, msg);
          cardPropeties += button;
        } else {
          var button = "";
        }

        if(msg.req.isAlexaSkill()) {
          if(image) {
            msg.req.showImageCard(title, text, image);
          } else {
            msg.req.showSimpleCard(title, text);
          }
        }

        if(msg.req.isGoogleAction()) {
          msg.req.$googleAction.addBasicCard({
            ...(title) && {title: title},
            ...(text)  && {text: text},
            ...(image) && {image: {url: image, alt: "image"}},
            ...(buttonUrl) && {button: {name: buttonTitle, open: {url: buttonUrl}}},
          });
        }

        send(msg);
      });
    }
    RED.nodes.registerType("voiceapp-card", card);
  }
  