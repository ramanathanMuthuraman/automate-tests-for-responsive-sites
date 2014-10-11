/**
 * Screen Difference
 *
 */
var ScreenDiff = new function() {
    var that = this;
    this.scrollPage=function(event){
        
          var $anchor = $(event.currentTarget);
        var scrollTop = $anchor.data('href')||$anchor.attr('href');
        if(scrollTop){
        $('html, body').stop().animate({
            scrollTop: $(scrollTop).offset().top
        }, 1500);
        }
        event.preventDefault();
    };
    this.onScreenShotSuccess = function(response) {
        var template = Handlebars.compile($("#htmlScreenshot-template").html());
       
        $("#htmlScreenshot")
            .removeClass("drop-zone progress-zone invalid-zone").addClass("complete-zone").html(template(response));
    };
    this.onScreenShotError = function(response) {
        $("#htmlScreenshot").addClass("drop-zone failed-zone").removeClass("progress-zone invalid-zone").html("Error");
    };
    this.onScreenShotSubmit = function() {
        $("#htmlScreenshot")
            .addClass("drop-zone progress-zone").removeClass("complete-zone failed-zone invalid-zone").html("");
    };
    this.onScreenShotInvalidSubmission = function() {
        $("#htmlScreenshot").addClass("drop-zone invalid-zone").removeClass("complete-zone failed-zone progress-zone").html("invalid URL")
    };
    this.onUploadSuccess = function(response) {
       
        var template = Handlebars.compile($("#VDimages-template").html());
        $("#VDImages").removeClass('center-content progress-zone').addClass('complete-zone').html(template(response));
     
    };

    this.onUploadError = function() {
        $("#VDImages").removeClass('center-content progress-zone').html("Error");
    };
    this.onUploadSubmit = function() {
         $("#VDImages")
            .addClass("drop-zone progress-zone").removeClass("complete-zone failed-zone invalid-zone").html("");
    };
    this.findDiff = function(){
        $(".VD_image").each(function(i,val){
                var VD_image_path = $(val).attr("src");
                var screenshot_image_path = VD_image_path.replace("/VD/","/screenshot/")
                 resemble(screenshot_image_path).compareTo(VD_image_path).onComplete(function(data){
                   $("#diffImage").removeClass("center-content").addClass("complete-zone").html('<img src="'+data.getImageDataUrl()+'" />');
                        console.log(data.misMatchPercentage,data.isSameDimensions);
	/*
	{
	  misMatchPercentage : 100, // %
	  isSameDimensions: true, // or false
	  getImageDataUrl: function(){}
	}
	*/
            });                     
        });
        
    };
    this.isFileSelectedForUpload = function() {
       
        var timerId = setInterval(function() {
            var current_file_selected=$('#archiveFolder').val();
            /*check for invalid input, empty string or selecting the same file*/
            if (current_file_selected !== '' &&  current_file_selected !== that.prev_file_selected) {
                clearInterval(timerId);
                that.onUpload();
                that.prev_file_selected = current_file_selected;

            }
        }, 500);
    };
    this.init = function() {
          // Register event listeners
        $("#archiveFolder").click(this.isFileSelectedForUpload);
        
         $('.page-scroll').bind('click',this.scrollPage);
        //prevent form submission through ways like enter key press etc.
        $("#inputForm").submit(function (e) {e.preventDefault();});
        $("#inputFormSubmit").click(this.onScreenShot);
        $("#differentiate").click(this.findDiff);
        
    };
    this.onUpload = function() {
        var options = {
            method: "POST",
            form: "#uploadForm",
            url: "extract",
            beforeSubmit: that.onUploadSubmit,
            success: that.onUploadSuccess,
            error: that.onUploadError
        };
        that.synch(options);
    };
    this.onScreenShot = function() {
        var url = $.trim($("#inputFormGetURL").val());
        if (url) {
            var options = {
                method: "GET",
                form: "#inputForm",
                data: {
                    "url": url
                },
                url: "screenshot",
                beforeSubmit: that.onScreenShotSubmit,
                success: that.onScreenShotSuccess,
                error: that.onScreenShotError
            };

            that.synch(options);
        } else {
            that.onScreenShotInvalidSubmission();

        }

    };
    this.synch = function(options) {
        $(options.form).ajaxSubmit({
            url: options.url,
            type: options.method,
            data: options.data,
            beforeSubmit: function() {
                options.beforeSubmit();
            },
            success: function(response) {
                options.success(response);
            },
            error: function() {
                options.error();
            }
        });
    };
};

$(document).ready(function() {

    ScreenDiff.init();
});