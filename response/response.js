module.exports = function(RED) {
    "use strict";
  
    function response(n) {
      RED.nodes.createNode(this, n);
      var node = this;
      node.endsession = n.endsession;
      this.on("input", function (msg) {
        if (node.endsession == true) {
          if (msg.req.isAlexaSkill() && node.endsession == true) {
            msg.req.shouldEndSession(true);
          }
          if (msg.req.isGoogleAction() && node.endsession == true) {
              msg.req.$googleAction.endSession();
          }  
        }
          msg.vaRequestComplete();
      });
    }
    RED.nodes.registerType("voiceapp-response", response);
  }
  