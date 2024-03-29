define(function () {
    function init() {
        $('#test').click(function () {
            console.log('is a init2.');
        });
    }
    return {
        init
    };
});
