$(document).ready(function() {
  var $footer = $('#footer');  
  var $leaf = $('#leaf').click(function() {
    if ($footer.is(':visible')) { hideFooter(); }
    else { showFooter(); }
  });
  function hideFooter() {
     $footer.slideUp();
     $leaf.animate({bottom: '0px'}, 'normal');
  }
  function showFooter() {
     $footer.slideDown()
     $leaf.animate({bottom: '30px'}, 'normal');
  }
  $(document).keydown(function(e) {
     if (e.keyCode == 27) { 
       $('#error, #info').hide();
       if ($footer.is(':visible')) { hideFooter(); }
     }
  });
});