/** Bridge lightweight library for two-way data binding
 * @version: 1.0.1
 * @date: 2016-12-15
 * UPDATE AND DOCS AT: https://github.com/Marcotrombino/Bridge
 * @copyright (C) 2016 Marco Trombino
 * @author: Marco Trombino
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses.
 */
  if(typeof Bridge == 'undefined' || !Bridge) {
    var Bridge = (function() {
      // Bridge reference
        var $ = {};
      // Bridge scope
        $.scope = {};

        /****************** UTILITIES ******************/

        // Parsing methods
        var parseTo = {
          number: function(data) {return Number(data);},
          int: function(data) {return parseInt(data);},
          float: function(data) {return parseFloat(data);},
          string: function(data) {return String(data);}
        };

        /***********************************************/

        // data binding on particular DOM elements events
        var DOMEvents = {
          input: {key: "value", events: ["input", "onkeydown"]},
          textarea: {key: "value", events: ["input", "onkeydown"]}
        };

        /**
        *  Sync DOM element value with model based on HTMLElement
        *  @method DOMSetter
        *  @param {HTMLElement} el : DOM element with "data-bind" attribute
        *  @param {String} newVal : New scope variable value
        */
        var DOMSetter = function(el, newVal) {
          var scopeVar = el.dataset.bind;
          switch(el.nodeName.toLowerCase()) {
            case "input":
            case "textarea":
              el.value = newVal;
              break;
            case "img":
              el.src = newVal;
            default:
              el.innerHTML = newVal;
          }
        };

        // Bridge watchers: "data-" attribute to watch
          var watcher = {};

          /**
          *  Sync DOM and Model through "data-bind" attribute
          *  @method watcher.bind
          *  @param {HTMLElement} el : DOM element with "data-bind" attribute
          *  @param {String} bindVar : Scope variable name
          */
          watcher.bind = function(el, scopeVar) {
            // if scope variable is not defined
            if(!$.hasOwnProperty(scopeVar)) {
              // define scope variable
              $.scope[scopeVar] = {
                watcher: "bind",       // type of watcher
                value: undefined,      // variable value
                nodes: []              // binded DOM nodes
              };

              // create scope variable API
              Object.defineProperty($, scopeVar, {
                // define scope variable getter
                get: function() {
                  return $.scope[scopeVar].value;        // GET scope variable value
                },

                // define scope variable setter
                set: function(newVal) {
                  $.scope[scopeVar].value = newVal;      // SET scope variable value
                  /* --- SET DOM nodes ---*/
                  var nodes = $.scope[scopeVar].nodes;
                  var iterations = nodes.length;
                  for(var i=0; i<iterations; ++i)
                    DOMSetter(nodes[i], newVal);
                }
              });
            } // scope variable is not defined

            // Push DOM element into scope
            $.scope[scopeVar].nodes.push(el);

            // Sync DOM and Model on DOM element's events
            if(DOMEvents.hasOwnProperty(el.nodeName.toLowerCase())) {
              var tagName = DOMEvents[el.nodeName.toLowerCase()];
              var events = tagName.events;
              var key = tagName.key;
              for(var i=0; i<events.length; ++i) {
                el.addEventListener(events[i], function() {
                  $.scope[scopeVar].value = el[key];
                  var nodes = $.scope[scopeVar].nodes;
                  var iterations = nodes.length;
                  for(var i=0; i<iterations; ++i)
                    DOMSetter(nodes[i], el[key]);
                });
              }
            }
          };

      // Implements two-way binding
        var binder = function(watcher) {
          Object.keys(watcher).forEach(function (watchAttr) {
            var DOM = document.querySelectorAll("[data-" + watchAttr + "]");
            DOM.forEach(function(el) {
              var scopeVar = el.dataset[watchAttr];
              // Call watcher method
              watcher[watchAttr](el, scopeVar);
            });
          });
        };

      binder(watcher);
      return $;
    }());
    // check "$" namespace availability
    if(typeof $ == 'undefined') var $ = Bridge;
  } else console.error("'Bridge' namespace's not available.");
