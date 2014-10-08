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
        $("#VDImages").removeClass('center-content').addClass('complete-zone').html(template(response.path));
        $('#uploadForm').resetForm();
    };

    this.onUploadError = function() {
     $('#uploadForm').resetForm();
    };
    this.onUploadSubmit = function() {

    };
    this.isFileSelectedForUpload = function() {
        var timerId = setInterval(function() {
            if ($('#archiveFolder').val() !== '') {
                clearInterval(timerId);
                that.onUpload();

            }
        }, 500);
    };
    this.init = function() {
        $("#archiveFolder").click(this.isFileSelectedForUpload);
        
         $('.page-scroll').bind('click',this.scrollPage);


        // Register event listeners
        $("#inputFormSubmit").click(this.onScreenShot);
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