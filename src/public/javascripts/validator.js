function Validator(formSelector) {
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
    var validatorRules = {

        noSpace: function (value) {
            return /^\s*$/.test(value) ? "Không nhập khoảng trống" : undefined;
        },
        nospace: function (value) {
            return /\s/.test(value) ? "Không nhập khoảng trống" : undefined;
        },
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        select: function(value){
            return value>0 ? undefined : 'Vui lòng nhập trường này'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email hợp lệ'
        },

        phonenumber: function (value) {
            var regex = /^[0-9]{10,11}$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập số điện thoại hợp lệ';
        },

        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`;
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`;
            }
        },
        password: function (value) {
            var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z]).{6,}$/;
            return regex.test(value) ? undefined : 'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm chữ thường, chữ hoa, ký tự đặc biệt và số'
        },

        matchpassword: function (passwordSelector) {
            return function (value) {
                var passwordValue = document.querySelector(passwordSelector).value;
                return value === passwordValue ? undefined : 'Mật khẩu nhập lại không khớp';
            }
        },
        integer: function (value) {
            return !isNaN(value) ? undefined : 'Nhập sai định dạng số';
        },

        imageRequired: function () {
            const fileInput = document.querySelector('input[type=file]');
            if (fileInput && fileInput.files.length > 0) {
                return undefined; // người dùng đã chọn ảnh
            }
            return 'Vui lòng chọn ảnh';
        }
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
                    validatorRules
                }

                var ruleFunc = validatorRules[rule];
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
                var formGroup = getParent(e.target, '.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        // Hàm clear message lỗi
        function handleClearError(e) {
            var formGroup = getParent(e.target, '.form-group');
            if (formGroup) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
        // console.log(formRules);
    }

    function handleMatch() {
        var matchpw = formElement.querySelectorAll('.match');
        if (matchpw[0].value === matchpw[1].value) return true;
        else {
            var formGroup = getParent(matchpw[1], '.form-group');
            if (formGroup) {
                formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                formMessage.innerText = "Mật khẩu mới không khớp";
            }
            return false;
        }
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
        if (isValid && formElement.classList.contains('pass')) {
            isValid = handleMatch();
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