# <img src="https://raw.githubusercontent.com/Marcotrombino/Bridge/master/logo.png">Bridge
A simple lightweight Javascript library (<i>less than 2KB</i>) for <b>two-way data binding</b>.
<br>Just include at the end of the body:
```html
<script type="text/javascript" src="bridge.min.js"></script>
```
## Model-UI sync
Bridge allows you to <b>synchronize</b> your DOM with your model. <br>
Any data-related changes affecting the model are <i>immediately propagated</i> to your DOM and vice versa.
```html
<input type="text" data-bind="name">    <!-- if you type "John" -->
Hi, <span data-bind="name"></span>      <!-- Hi, John -->
```
### Model
You can access to the model through the object ```Bridge```(or ```$``` shortcut, if it's available):
<br><b>Get</b>
```js
Bridge.name   // John
```
<b>Set</b>
```js
Bridge.name = "Albert";   // every DOM's element with data-bind="name" will be updated
```
<br>Let's see the whole example:
```html
<body>
  <input type="text" data-bind="name">    <!-- Albert -->
  Hi, <span data-bind="name"></span>      <!-- Hi, Albert -->

  <script type="text/javascript" src="bridge.min.js"></script>  <!-- Bridge library -->
  <script type="text/javascript">
    Bridge.name = "Albert";   
  </script>
</body>
```
