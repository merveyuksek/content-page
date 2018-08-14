var id;

$(function () {

    $.ajax({
        url: "https://study.icerik.com/v1/q/contentdetail",
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA'
        },
        success: function (data) {
            loadPage(data);
            id = data.id;
        },
        error: function (){
            $('#contentErrModal').modal("show");
        }
    });

    function loadPage(data) {
        loadContent(data);
        loadKeywords(data);
        loadContentDetails(data);
        loadInfoText(data);
        loadContentTitle(data);
    }

    function loadContent(data) {
        $('#content-description').text(data.content_description);
        $('#content').text(data.content);
    }

    function loadKeywords(data) {
        var keywords = data.content_keywords;
        var keywordList = keywords.split(",");
        for (var i = 0; i < keywordList.length; i++) {
            $("#keyword").append("<span>" + keywordList[i] + "</span>");
        }
    }

    function loadContentDetails(data) {
        $('#product_title').text(data.product_title);
        $('#interest_title').text(data.interest_title);
        $('#userlevel_title').text(data.userlevel_title);
        $('#language_title').text(data.language_title);
        if (data.visual) {
            $('#visual').text("Kullanılacak");
        } else {
            $('#visual').text("Kullanılmayacak");
        }
        $('#limit_word').text(data.limit_word_lower + "-" + data.limit_word_upper);
        $('#price_publisher').text("₺" + data.price_publisher);
    }

    function loadInfoText(data) {
        $('#status_str').text(data.status_str);
    }

    function loadContentTitle(data) {
        var currentTimeInSeconds = new Date().getTime() / 1000;
        var deadlineData = Number(data.deadline_content);
        var deadlineInSeconds = currentTimeInSeconds + deadlineData;
        var deadlineDate = new Date(deadlineInSeconds * 1000);
        var date = deadlineDate.getDate();
        var month = deadlineDate.getMonth();
        var year = deadlineDate.getFullYear();
        var hour = deadlineDate.getHours();
        var min = deadlineDate.getMinutes();

        function prependZero(number) {
            if (number <= 10) {
                return "0" + number
            } else {
                return number
            }
        }
        date = prependZero(date);
        month= prependZero(month);
        hour = prependZero(hour);
        min = prependZero(min);


        $('.content_title').text(data.content_title);
        $('.deadline_content').text(date + "." + month + "." + year + " / " + hour + ":" + min);
    }

});

function rateContent() {
    var rate = $("#rating :radio:checked").val();
    var body = {
        "id": id,
        "score": rate
    };

    if(rate < 3 || rate === undefined){
        $('#ratingModal').modal('hide');
        $("#message-text").text("Bu içeriğin 3 yıldız altında olduğunu düşünüyorsannız lütfen revize verin, sizin için içeriği daha iyi hale getireceğiz.");
        $('#messageModal').modal('show');
    } else {
        $('body').css({'pointer-events': 'none'});
        $("#rate-save-btn").text("Kaydediliyor...");
        $('#ratingModalModal').find('input, button').attr('disabled', 'disabled');
        $.ajax({
            url: "https://study.icerik.com/v1/q/approvecontent",
            type: "POST",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA'
            },
            success: function (response) {
                $('body').css({'pointer-events': 'auto'});
                $('#ratingModal').modal('hide');
                $("#message-text").text(response.message);
                $('#messageModal').modal('show');
                $('#approve-btn').attr('disabled','disabled').text("Onaylandı");
                $('#rating-stars input').attr('disabled','disabled');
            },
            error: function (response) {
                $('body').css({'pointer-events': 'auto'});
                $('#ratingModal').modal('hide');
                $("#message-text").text(response.responseJSON.message[0]);
                $('#messageModal').modal('show');
            }
        });
    }
}

function reviseContent() {
    var message = $('#message').val();
    var body = {
        "id": id,
        "message": message
    };

    if (message.trim().length <=0) {
        $('#revision-err-msg').show();
    } else {
        $('body').css({'pointer-events': 'none'});
        $("#msg-save-btn").text("Kaydediliyor...");
        $('#revisionModal').find('input, textarea, button').attr('disabled', 'disabled');
        $.ajax({
            url: "https://study.icerik.com/v1/q/revisioncontent",
            type: "POST",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': 'NcCaHwHfus5pXDcJlZT73bq53MKC9AGw4DUjCwdW51hXlSIDxNDB38B4QZuOnoCA'
            },
            success: function (response) {
                $('body').css({'pointer-events': 'auto'});
                $("#msg-save-btn").text("Kaydet");
                $('#revisionModal').find('input, textarea, button').removeAttr('disabled');
                $('#revisionModal').modal('hide');
                $("#message-text").text(response.message);
                $('#messageModal').modal('show');
            },
            error: function (response) {
                $('body').css({'pointer-events': 'auto'});
                $('#revisionModal').modal('hide');
                $("#message-text").text(response.responseJSON.message[0]);
                $('#messageModal').modal('show');
            }
        });
    }
}

function hideErrorMsg() {
    $('#revision-err-msg').hide();
}


