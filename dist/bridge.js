/** Bridge lightweight library for two-way data binding
 * @version: 1.0.0
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

  var Bridge = (function() {
    // Bridge reference
      var $ = {};
    // Bridge scope
      $.scope = {};
    // Parsing methods
      var parseTo = {
        number: function(data) {return Number(data);},
        int: function(data) {return parseInt(data);},
        float: function(data) {return parseFloat(data);},
        string: function(data) {return String(data);}
      };

    // Implements two-way binding
      var binder = function() {
        var DOM = document.querySelectorAll("[data-bind]");
        DOM.forEach(function(el) {
          var bindVar = el.dataset.bind;
          if(!$.hasOwnProperty(bindVar)) {
            $.scope[bindVar] = {
              type: undefined,
              nodes: []
            };
            Object.defineProperty($, bindVar, {
              get: function() {
                return binderGetter(el);
              },
              set: function(newVal) {
                $.scope[bindVar].type = typeof newVal;
                var nodes = $.scope[bindVar].nodes;
                var iterations = nodes.length;
                for(var i=0; i<iterations; ++i)
                  binderSetter(nodes[i], newVal)
              }
            });
          }

          // Push node into scope
          $.scope[bindVar].nodes.push(el);

          // Binder Events
          if(binderEvents.hasOwnProperty(el.nodeName.toLowerCase())) {
            var tagName = binderEvents[el.nodeName.toLowerCase()];
            var events = tagName.events;
            var key = tagName.key;
            for(var i=0; i<events.length; ++i) {
              el[events[i]] = function() {
                var nodes = $.scope[bindVar].nodes;
                var iterations = nodes.length;
                for(var i=0; i<iterations; ++i)
                  binderSetter(nodes[i], el[key])
              };
            }
          }

        });
      };

      // Events to attach on HTML events
      var binderEvents = {
        input: {
          key: "value",   // HTML value to change
          events: ["oninput", "onkeydown"]  // events to attach
        },
        textarea: {
          key: "value",
          events: ["oninput", "onkeydown"]  // events to attach
        }
      };

      // Get bind data from HTML elements
      var binderGetter = function(el) {
        var bindVar = el.dataset.bind;
        switch(el.nodeName.toLowerCase()) {
          case "input":
          case "textarea":
            return parseTo[$.scope[bindVar].type](el.value);
            break;
          case "img":
            return el.src;
            break;
          default:
            return parseTo[$.scope[bindVar].type](el.innerHTML);
        }
      };

      // Set bind data into HTML elements
      var binderSetter = function(el, newVal) {
        var bindVar = el.dataset.bind;
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

    binder();
    return $;
  }());
