// 'use strict';

/*
 * This code is managing the actions in the app, UI actions included
 */

var tmpArray = [];

window.onload = function() {
  function updateOrientation() {
    switch(window.orientation)
    {
      case -90:
      case 90:
        document.body.classList.add('landscape');
        break;
      default:
        document.body.classList.remove('landscape');
        break;
    }
  }
  window.addEventListener(
    'orientationchange',
    updateOrientation
  );

  // Check if we are on Dekstop o hacerlo por CSS Media Query
  updateOrientation();

  // Cache DOM elements
  var scrollablePanel = document.getElementById('scrollable');
  var newSampleButton = document.getElementById('new-sample');
  var backgroundPanel = document.getElementById('background');
  var maxScroll = scrollablePanel.scrollHeight - window.innerHeight;
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;


  function updateBlur() {
    var blurValue = scrollablePanel.scrollTop * 10 / maxScroll;
    backgroundPanel.setAttribute("style","background-color:rgba(57,138,255," + blurValue/10 + ")");
  }
  scrollablePanel.addEventListener(
    'scroll',
    updateBlur
  );



  var form = document.getElementById('form');
  var inputs = document.getElementById('form').querySelectorAll('input');

  function cleanInputs() {
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
  }

  function renderLastValue(object) {
    document.getElementById('lr-sys').textContent = object.systolic;
    document.getElementById('lr-dias').textContent = object.diastolic;
    document.getElementById('lr-rpm').textContent = object.heart;
    document.getElementById('lr-date').textContent = object.date.toString();
  }

  function renderList(array) {
    var container = document.getElementById('last-samples-container');
    container.innerHTML = '';

    array.sort(function(a, b) {
      return  b.date - a.date;
    });

    console.log(JSON.stringify(array));

    for (var i = 1; i < array.length; i++) {
      var values = array[i];
      var info = values.systolic + '/' + values.diastolic + '/' + values.heart ;
      var li = document.createElement('li');
      li.innerHTML =  '<span class="ls-value">' + info + '</span>' +
                      '<span class="ls-date">' + values.date.toString() + '</span>';

      container.appendChild(li);
    }
    // document.getElementById('last-samples-container').innerHTML = JSON.stringify(array);
  }


  function sendValues() {
    var values = {};
    for (var i = 0; i < inputs.length; i++) {
      values[inputs[i].name] = inputs[i].value;
    }

    values.date = new Date();
    renderLastValue(values);
    tmpArray.push(values);
    renderList(tmpArray);
    console.log(JSON.stringify(values));
  }

  form.addEventListener(
    'input',
    function() {
      var enable = true;
      for (var i = 0; i < inputs.length && enable; i++) {
        console.log(inputs[i].value);
        if (!inputs[i].value || inputs[i].value.length === 0) {
          enable = false;
        }
      }

      if (enable) {
        form.classList.add('ready');
      } else {
        form.classList.remove('ready');
      }
    }
  );

  newSampleButton.addEventListener(
    'click',
    function() {
      form.classList.remove('hidden');
    }
  );

  var sendSampleButton = document.getElementById('send-sample-button');
  sendSampleButton.addEventListener(
    'click',
    function() {
      form.classList.add('hidden');
      form.classList.remove('ready');
      sendValues();
      cleanInputs();
    }
  );

  var chartButton = document.getElementById('chart');
  chartButton.addEventListener(
    'click',
    function() {
      alert('chart');
    }
  );

  var updateButton = document.getElementById('update');
  updateButton.addEventListener(
    'click',
    function() {
      alert('update');
    }
  );

  renderList([]);
};
