/**
 * Screen Difference
 *
 */
var ScreenDiff = new function() {
    var that = this;
    this.onScreenShotSuccess = function(response) {
       
        $("#htmlScreenshot")
            .removeClass("drop-zone progress-zone invalid-zone").addClass("complete-zone").find("img").attr("src", response);
    };
    this.onScreenShotError = function(response) {
        $("#htmlScreenshot").addClass("drop-zone failed-zone").removeClass("progress-zone invalid-zone").find("img").attr("src", "");
    };
    this.onScreenShotSubmit = function() {
        $("#htmlScreenshot")
            .addClass("drop-zone progress-zone").removeClass("complete-zone failed-zone invalid-zone").find("img").attr("src", "");
    };
    this.onScreenShotInvalidSubmission = function() {
        $("#htmlScreenshot").addClass("drop-zone invalid-zone").removeClass("complete-zone failed-zone progress-zone").find("img").attr("src", "")
    };
    this.onUploadSuccess = function(response) {
        
    
      
        var template = Handlebars.compile($("#VDimages-template").html());
        $("#uploadedImagePreview").html(template(response.path));
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