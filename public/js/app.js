/**
 * Screen Difference 
 * 
*/

 
	                                                                                      
var ScreenDiff =  new function(){
    var that=this;
    this.init = function(){
    $("#archiveFolder").click(function(){
     
        var timerId = setInterval(function() {
	if($('#archiveFolder').val() !== '') {
            clearInterval(timerId);
 
            $('#uploadForm').submit();
        }
    }, 500);
    })
    
 
    $('#uploadForm').submit(function() {
      
 
        $(this).ajaxSubmit({                                                                                                                 
 
           
 
            success: function(response) {
            
                   $('#uploadForm').resetForm();
		//TODO: We will fill this in later
            }
	});
        // Have to stop the form from submitting and causing                                                                                                       
	// a page refresh - don't forget this   
        return false;
         });
    
        // Register event listeners
			$("#inputFormSubmit").click(this.getURL);
    };
    this.getURL = function(){
        var url = $.trim($("#inputFormGetURL").val());
        if(url){
        var options={
            method:"GET",
            data: {"url":url},
            url:"screenshot"
        };
         $("#htmlScreenshot")
         .addClass("drop-zone progress-zone").removeClass("complete-zone failed-zone invalid-zone").find("img").attr("src","");
        that.synch(options);
        }
        else{
            $("#htmlScreenshot").addClass("drop-zone invalid-zone").removeClass("complete-zone failed-zone progress-zone").find("img").attr("src","")
        }
      
    };
    this.synch = function(options)
    {
        return $.ajax({
            url:options.url,
            method:options.method,
             data:options.data,
            success:function(response){
                var imagePath=response.substring(response.indexOf("/result"));
                $("#htmlScreenshot")
                .removeClass("drop-zone progress-zone invalid-zone").addClass("complete-zone").find("img").attr("src",imagePath);
            },
            error:function(){
             $("#htmlScreenshot").addClass("drop-zone failed-zone").removeClass("progress-zone invalid-zone").find("img").attr("src","");
        }
        });
    };
};

$(document).ready(function(){

    ScreenDiff.init();
});

