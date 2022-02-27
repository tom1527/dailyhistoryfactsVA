module.exports = function(RED) {
    "use strict";
  
    function vaConfig(n) {
      RED.nodes.createNode(this, n);
      this.skillname = n.skillname;
      this.skillId = n.skillId;
    }
  
    RED.nodes.registerType("voiceapp-config", vaConfig);
  
}
  