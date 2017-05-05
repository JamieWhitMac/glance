$(function() {
    // Get data
    $("#databutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getpositiondata",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            }
        });
    });
});