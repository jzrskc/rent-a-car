// Browser Run function, but when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  var parent = document.querySelector('.splitview');
  var topPanel = parent.querySelector('.top');
  var handle = parent.querySelector('.handle');
  var skewHack = 0;
  var delta = 0;

  // If the parent has .skewed class, set the skewHack var.
  if (parent.className.indexOf('skewed') != -1) {
      skewHack = 1000;
  }

  parent.addEventListener('mousemove', function(event) {
    // Get the delta between the mouse position and center point.
    delta = (event.clientX - window.innerWidth / 2) * 0.5;

    // Move the handle. X-os - Zuta crta
    handle.style.left = event.clientX + delta + 'px';

    // Adjust the top panel width. Prijelaz
    topPanel.style.width = event.clientX + skewHack + delta + 'px';
  });
});
