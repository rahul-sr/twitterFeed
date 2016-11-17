//tabs handler
(function(){
  twitter.tabs = {
    settings:{
      target:'.mod-tabs'
    },
    init:function(){
      this.chooseTab();
    },
    chooseTab : function(){
   
      $('.tabs-nav').each(function(){
        // For each set of tabs, we want to keep track of
        // which tab is active and its associated content
        var $active, $content, $links = $(this).find('a');

        // If the location.hash matches one of the links, use that as the active tab.
        // If no match is found, use the first link as the initial active tab.
        $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);

        $active.addClass('selected');

        $content = $($active[0].hash);

        // Hide the remaining content
        $links.not($active).each(function () {
          $(this.hash).hide();
        });

        // Bind the click event handler
        $(this).on('click', 'a', function(e){

          // Bind click event load more for each tab
          //twitter.loadmorelists.loadMoreMultiLists($(this));
          // Make the old tab inactive.
          $active.removeClass('selected');
          $content.hide();
          //$content.fadeOut(500);
         
          // Update the variables with the new link and content
          $active = $(this);
          $content = $(this.hash);

          // Make the tab active.
          $active.addClass('selected');
          //$content.show();
          $content.fadeIn(500);
      
          // Prevent the anchor's default click action
          e.preventDefault();
        });
      });
    }
  }
}(twitter));