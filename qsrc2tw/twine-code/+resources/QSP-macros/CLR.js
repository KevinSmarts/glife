setup.CLR = function(){
    var passage = $('.passage');
    var marker = $('#CLR_marker');
    
    if (marker.length) {
        // Create a flag to start removing nodes
        var remove = true;

        // Iterate over all child nodes within the #passage element
        passage.contents().each(function() {
            if (this === marker[0]) {
                // Stop removing after the CLS_marker is found and removed
                remove = false;
                this.remove();
            } else if (remove) {
                // Remove all nodes (including text nodes) before the CLS_marker
                this.remove();
            }
        });
    }
};