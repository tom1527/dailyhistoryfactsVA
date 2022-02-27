 module.exports = function(RED) {
  "use strict";
// Initialisation for Intent nodes.
  const {App, ExpressJS} = require("jovo-framework");
  const {GoogleAssistant} = require("jovo-platform-googleassistantconv");
  const {Alexa} = require("jovo-platform-alexa");
  const express = require("express");

  const skills = {};

  function intent(n) {
    RED.nodes.createNode(this, n);
    this.skillConfig = RED.nodes.getNode(n.skillConfig);

    if (RED.settings.httpNodeRoot !== false) {
      var node = this;
      node.intents = n.intents;
      const intents = node.intents.split(', ');

      for (const intent in intents) {
        setupVAHttpHandler(node, intents[intent]);
      }
    }
    else {
      this.warn(RED._("common.errors.http-root-not-enabled"));
    }
  }

  RED.nodes.registerType("voiceapp-intent", intent);

  /**
   * Register node with controller.
   * @param node
   * @param route
   */
  function setupVAHttpHandler(node, route) {
    var skillConfig = node.skillConfig;

    // Set up Express route listener if not already done...
    if (!skills.hasOwnProperty(skillConfig.id)) {
      initialiseRouteListener(skillConfig);
    }

    const handler = {};
    
    const intentHandler =  function () {
      const jovo = this;
      return new Promise((resolve, reject) => {
        const msgid = RED.util.generateId();
        
        node.send({
          _msgid: msgid,
          req: jovo,
          vaRequestComplete: resolve,
          vaRequestFail: reject,
        }, false);
      });
    }

    handler[route + "State"] = {};

    handler[route + "State"]["ON_PERMISSION"] = intentHandler;
    handler[route + "State"]["ON_SCENE"] = intentHandler;
    

    handler[route] = intentHandler;

    skills[skillConfig.id].app.setHandler(handler);
  }
  
  /**
   * One-time initialisation, called on first intent node in skill.
   */
  function initialiseRouteListener(skillConfig) {
    // Initialize Jovo App
    const app = new App();

    app.use(
      new GoogleAssistant(),
      new Alexa(),
    );

    //const url = '/assistant/' + skillConfig.id;
    const url = '/webhook';

    RED.httpNode.post(url, express.json(), async (req, res) => {
      await app.handle(new ExpressJS(req, res))
    });

    skills[skillConfig.id] = {
      app: app
    };
  }
}
