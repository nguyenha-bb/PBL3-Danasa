function ValidNews(formSelector) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var formRules = {};

    // Quy ước tạo rule
    // - Nếu có lỗi thì return 'error message'
    // - Nếu không có lỗi thì return 'undefined'
    var validNewsRules = {

        noSpace: function (value) {
            return /^\s*$/.test(value) ? "Không nhập khoảng trống" : undefined;
        },
        nospace: function (value) {
            return /\s/.test(value) ? "Không nhập khoảng trống" : undefined;
        },

        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
    }

    // var ruleName = 'required';

    // Lấy ra form element trong DOM theo formSelector
    var formElement = document.querySelector(formSelector);

    // Chỉ xử lý khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');
            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':');
                var ruleInfo;

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    validNewsRules
                }

                var ruleFunc = validNewsRules[rule];
                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }

            }
            // Lắng nghe sự kiện để validate(blue, change)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        // Hàm thực hiện validate
        function handleValidate(e) {
            var rules = formRules[e.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(e.target.value);
                if (errorMessage) break;
            }

            if (errorMessage) {
                var formGroup = getParent(e.target, '.form-group-news');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message-news');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        // Hàm clear message lỗi
        function handleClearError(e) {
            var formGroup = getParent(e.target, '.form-group-news');
            if (formGroup) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message-news');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
        // console.log(formRules);
    }
    var _this = this;
    // Xử lý hàm vi submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false;
            }
        }
        // Khi không có lỗi thì submit form
        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                // gọi lại hàm onSubmit và trả về kèm giá trị của form
                _this.onSubmit();
            } else {
                formElement.submit();
            }
        }
    }
    
}