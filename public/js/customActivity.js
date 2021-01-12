define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';
    const redirect_uri = 'https://zalo-call-back.herokuapp.com/v46.0/marketing-cloud/zalo/callbackGetAccessToken';
    const base_callback_url = 'https://oauth.zaloapp.com/v3/oa/permission?redirect_uri=' + redirect_uri + '&app_id=';
    var callback_url = 'https://oauth.zaloapp.com/v3/oa/permission?redirect_uri=' + redirect_uri + '&app_id=';
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        {"label": "Setup Zalo OA Channel", "key": "step1"}
    ];
    var currentStep = steps[0].key;
    var eventDefinitionKey;
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        // Disable the next button if a value isn't selected
        $('#select1').change(function () {
            var message = getMessage();
            connection.trigger('updateButton', {button: 'next', enabled: Boolean(message)});

            $('#message').html(message);
        });

        // Toggle step 4 active/inactive
        // If inactive, wizard hides it and skips over it during navigation
        $('#toggleLastStep').click(function () {
            lastStepEnabled = !lastStepEnabled; // toggle status
            steps[3].active = !steps[3].active; // toggle active

            connection.trigger('updateSteps', steps);
        });
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        let oa_id;
        let access_token;
        let message;
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === 'config') {
                    oa_id = val.oa_id;
                    access_token = val.access_token;
                    message = val.message;
                    callback_url = base_callback_url + oa_id;
                    $('#get_access_token').attr('href', callback_url);
                }
            });
        });

        if (oa_id && access_token && message) {
            $('#oa_id').val(oa_id);
            $('#access_token').val(access_token);
            $('#message').val(message);
        } else {
            connection.trigger('updateButton', {button: 'next', enabled: false});
        }
        showStep(null, 1);
    }

    $('#oa_id').on('input', function () {
        let oa_id = $('#oa_id').val();
        callback_url = base_callback_url + oa_id;
        $('#get_access_token').attr('href', callback_url);
    });

    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        // console.log(tokens);
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        // console.log(endpoints);
    }

    function onClickedNext() {
        save();
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: true
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
        }
    }

    connection.trigger('requestTriggerEventDefinition');
    connection.on('requestedTriggerEventDefinition',
        function (eventDefinitionModel) {
            if (eventDefinitionModel) {
                eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            }
        });

    function save() {
        var access_token = $('#access_token').val();
        var oa_id = $('#oa_id').val();
        var message = $('#message').val();

        if (access_token && oa_id && message) {
            payload.name = 'Zalo Message';

            var hasInArguments = Boolean(
                payload['arguments'] &&
                payload['arguments'].execute &&
                payload['arguments'].execute.inArguments &&
                payload['arguments'].execute.inArguments.length > 0
            );

            let inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
            let checkConfig = false;
            let checkData = false;
            $.each(inArguments, function (index, inArgument) {
                $.each(inArgument, function (key, val) {
                    if (key === 'config') {
                        val.oa_id = oa_id;
                        val.access_token = access_token;
                        val.message = message;
                        checkConfig = true;
                    }

                    if (key === 'data') {
                        val.LastName = "{{Event." + eventDefinitionKey + ".LastName}}";
                        val.FirstName = "{{Event." + eventDefinitionKey + ".FirstName}}";
                        val.phone = "{{Event." + eventDefinitionKey + ".phone}}";
                        val.zalo_id = "{{Event." + eventDefinitionKey + ".zalo_id}}";
                        checkData = true;
                    }
                });
            });

            if (checkConfig === false) {
                payload['arguments'].execute.inArguments.push({
                    "config": {
                        "oa_id": oa_id,
                        "access_token": access_token,
                        "message": message
                    }
                });
            }

            if (checkData === false) {
                payload['arguments'].execute.inArguments.push({
                    "data": {
                        "LastName": "{{Event." + eventDefinitionKey + ".LastName}}",
                        "FirstName": "{{Event." + eventDefinitionKey + ".FirstName}}",
                        "phone": "{{Event." + eventDefinitionKey + ".phone}}",
                        "zalo_id": "{{Event." + eventDefinitionKey + ".zalo_id}}"
                    }
                });
            }

            payload['arguments'].execute.inArguments = inArguments;

            payload['metaData'].isConfigured = true;

            connection.trigger('updateActivity', payload);
        }

    }

});