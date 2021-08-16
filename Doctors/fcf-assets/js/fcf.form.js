var optionsJV = {
    rules: {
        "Name": {
            "required": true,
            "maxLength": 60
        },
        "Email": {
            "required": true,
            "maxLength": 100,
            "email": true
        },
        "Phone": {
            "required": false,
            "maxLength": 30
        },
        "Message": {
            "required": true,
            "maxLength": 3000
        }
    },
    colorWrong: '#dc3545',
    focusWrongField: true,
    submitHandler: function(cform, values, ajax) {
        var button_value = getButtonValue('fcf-button');
        disableButton('fcf-button', lang.server);
        ajax({
            url: cform.getAttribute('action'),
            method: 'POST',
            data: values,
            async: true,
            callback: function(response) {
                var done = false;
                if(response.indexOf('Fail:') == 0) {
                    // configration problem
                    showFailMessage(response, lang.server);
                    enableButon('fcf-button', button_value);
                    done = true;
                }

                if(response.indexOf('Error:') == 0) {
                    // validation problem
                    showErrorMessage(response, lang.server);
                    enableButon('fcf-button', button_value);
                    done = true;
                }

                if(response.indexOf('Success') == 0) {
                    showSuccessMessage(response);
                    done = true;
                }

                if(response.indexOf('URL:') == 0) {
                    doRedirect(response);
                    done = true;
                }

                if(response.indexOf('Debug:') == 0) {
                    showDebugMessage(response, lang.server);
                    enableButon('fcf-button', button_value);
                    done = true;
                }

                if(done == false) {
                    showErrorMessage('Error:'+lang.server.tryLater, lang.server);
                    enableButon('fcf-button', button_value);
                }

            }
        });
    
    },
};

document.addEventListener('DOMContentLoaded', function(event) {
    new JustValidate('.fcf-form-class', lang.client, optionsJV);
});

function getButtonValue(id) {
    return document.getElementById(id).innerText;
}

function disableButton(id, lang) {
    document.getElementById(id).innerText = lang.pleaseWait;
    document.getElementById(id).disabled = true;
}

function enableButon(id, val) {
    document.getElementById(id).innerText = val;
    document.getElementById(id).disabled = false;
}

function showFailMessage(message, lang) {
    var display = '<strong>'+lang.configError+'</strong><br>';
    display += message.substring(5);
    document.getElementById('fcf-status').innerHTML = display;
}

function showErrorMessage(message, lang) {
    var display = '<strong>'+lang.errorMessage+':</strong><br>';
    display += message.substring(6);
    document.getElementById('fcf-status').innerHTML = display;
}

function showDebugMessage(message, lang) {
    var display = '<strong>'+lang.debugOutput+'</strong><br>';
    display += message.substring(6);
    document.getElementById('fcf-status').innerHTML = display;
}

function showSuccessMessage(message) {
    var message = '<br><br>' + message.substring(8);
    var content = document.getElementById('fcf-thank-you').innerHTML;
    document.getElementById('fcf-thank-you').innerHTML = content + message;
    document.getElementById('fcf-status').innerHTML = '';
    document.getElementById('fcf-form').style.display = 'none';
    document.getElementById('fcf-thank-you').style.display = 'block';
}

function doRedirect(response) {
    var url = response.substring(4);
    window.location.href = url;
}