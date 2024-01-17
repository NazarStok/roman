jQuery(document).ready(function($){
    var modal = document.getElementById("destini-widget-modal");
    var btn = document.querySelectorAll('.buynow');
    var span = document.getElementsByClassName("close")[0];
    var body = document.getElementsByTagName("BODY")[0];

        btn.forEach( function(elem) {
        elem.addEventListener('click', function (){
            modal.style.display = "block"; 
            // modal.style.backgroundColor = "rgba(0, 0, 0, 0.3)"; 
            var overlay = document.createElement('div');
            overlay.classList.add("modal-overlay");
            $(body).prepend(overlay);
            body.appendChild(modal);
        })
    });
    span.onclick = function() {
        modal.style.display = "none";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.0)"; 
        $('.modal-overlay').remove();
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.0)"; 
            $('.modal-overlay').remove();
        }
    }

    $('.buynow').click(function() {
        var containerId = $(this).attr('data-destini-container');
        var associationId = $(this).attr('data-destini-association');
        destini.init(containerId);
        destini.loadWidget(associationId);
    });

});
