document.addEventListener('DOMContentLoaded', function() {
    // تحديد العناصر
    const loginScreen = document.getElementById('login-screen');
    const mainScreen = document.getElementById('main-screen');
    const voteSection = document.getElementById('vote-section');
    const candidatesSection = document.getElementById('candidates-section');
    const rulesSection = document.getElementById('rules-section');
    const fundingSection = document.getElementById('funding-section');
    const confirmationScreen = document.getElementById('confirmation-screen');
    const loginForm = document.getElementById('login-form');
    const captchaText = document.getElementById('captcha-text');
    const captchaInput = document.getElementById('captcha');
    const refreshCaptchaButton = document.getElementById('refresh-captcha');
    const voteForm = document.getElementById('vote-form');
    const governorateSelect = document.getElementById('governorate');
    const districtSelect = document.getElementById('district');
    const candidateSelect = document.getElementById('candidate');
    const confirmCheckbox = document.getElementById('confirm');
    const faceAuthButton = document.getElementById('face-auth');
    const fundingForm = document.getElementById('funding-form');
    const fundingGovernorateSelect = document.getElementById('funding-governorate');
    const fundingDistrictSelect = document.getElementById('funding-district');
    const backToMainButtons = document.querySelectorAll('#back-to-main, #back-to-main-from-confirmation, #back-to-main-funding');

    // المتغيرات الخاصة بالحالة
    let currentCaptcha = generateCaptcha();
    let hasVoted = false;
    let loginAttempts = 0;
    const maxAttempts = 3;
    let isLockedOut = false;

    // بيانات الدوائر والمرشحين
    const districts = {
        'amman': ['اللواء 1', 'اللواء 2'],
        'zarqa': ['اللواء 3', 'اللواء 4'],
        'irbid': ['اللواء 5', 'اللواء 6'],
        'mafraq': ['اللواء 7', 'اللواء 8'],
        'karak': ['اللواء 9', 'اللواء 10'],
        'aqaba': ['اللواء 11', 'اللواء 12'],
        'madaba': ['اللواء 13', 'اللواء 14']
    };

    const candidates = {
        'اللواء 1': ['مرشح 1', 'مرشح 2'],
        'اللواء 2': ['مرشح 3'],
        'اللواء 3': ['مرشح 4'],
        'اللواء 4': ['مرشح 5'],
        'اللواء 5': ['مرشح 6'],
        'اللواء 6': ['مرشح 7'],
        'اللواء 7': ['مرشح 8'],
        'اللواء 8': ['مرشح 9'],
        'اللواء 9': ['مرشح 10'],
        'اللواء 10': ['مرشح 11'],
        'اللواء 11': ['مرشح 12'],
        'اللواء 12': ['مرشح 13'],
        'اللواء 13': ['مرشح 14'],
        'اللواء 14': ['مرشح 15']
    };

    // إظهار القسم المحدد
    function showSection(section) {
        [voteSection, candidatesSection, rulesSection, fundingSection, confirmationScreen]
            .forEach(s => s.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    // إظهار محتوى الشاشة الرئيسية
    function showMainContent() {
        loginScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        document.getElementById('vote-tab').classList.toggle('hidden', hasVoted);
    }

    // إنشاء كود التحقق
    function generateCaptcha() {
        const captcha = Math.floor(Math.random() * 9000) + 1000;
        captchaText.textContent = captcha;
        return captcha;
    }

    // التحقق من بصمة الوجه
    function confirmFaceAuth(successCallback) {
        alert('جارٍ التحقق من بصمة الوجه...');
        setTimeout(function() {
            const success = Math.random() > 0.2;
            if (success) {
                alert('تم التحقق من بصمة الوجه بنجاح.');
                successCallback();
            } else {
                alert('فشل التحقق من بصمة الوجه. يرجى المحاولة مرة أخرى.');
            }
        }, 2000);
    }

    // عرض نافذة القفل بعد المحاولات الفاشلة
    function showLockoutPopup() {
        alert('لقد أدخلت بيانات غير صحيحة ثلاث مرات. يرجى الانتظار 30 ثانية قبل المحاولة مرة أخرى أو التواصل مع الدعم الفني أو دائرة الأحوال المدنية والجوازات.');
    }

    // معالجة تقديم نموذج تسجيل الدخول
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (isLockedOut) {
            alert('الرجاء الانتظار حتى تنتهي فترة القفل قبل المحاولة مرة أخرى.');
            return;
        }

        const nationalId = document.getElementById('national-id').value;
        const password = document.getElementById('password').value;
        const captcha = captchaInput.value;

        if (nationalId === '2024' && password === '0000' && captcha === currentCaptcha.toString()) {
            showMainContent();
            loginAttempts = 0; // إعادة تعيين عدد المحاولات بعد تسجيل الدخول الناجح
        } else {
            loginAttempts++;
            if (loginAttempts >= maxAttempts) {
                isLockedOut = true;
                showLockoutPopup();
                setTimeout(() => {
                    isLockedOut = false;
                    loginAttempts = 0;
                }, 30000); // 30 ثانية
            } else {
                alert('الرقم الوطني أو كلمة السر أو التحقق غير صحيح');
                currentCaptcha = generateCaptcha();
            }
        }
    });

    // تحديث كود التحقق عند النقر على زر التحديث
    refreshCaptchaButton.addEventListener('click', function() {
        currentCaptcha = generateCaptcha();
    });

    // التعامل مع علامات التبويب المختلفة
    document.getElementById('vote-tab').addEventListener('click', function(event) {
        event.preventDefault();
        if (hasVoted) {
            alert('لقد قمت بالتصويت بالفعل ولا يمكنك التصويت مرة أخرى.');
        } else {
            showSection(voteSection);
        }
    });

    document.getElementById('candidates-tab').addEventListener('click', function(event) {
        event.preventDefault();
        showSection(candidatesSection);
    });

    document.getElementById('rules-tab').addEventListener('click', function(event) {
        event.preventDefault();
        showSection(rulesSection);
    });

    document.getElementById('funding-tab').addEventListener('click', function(event) {
        event.preventDefault();
        showSection(fundingSection);
    });

    // العودة إلى الشاشة الرئيسية من أي قسم
    backToMainButtons.forEach(button => button.addEventListener('click', function() {
        showMainContent();
    }));

    // معالجة تقديم نموذج التصويت
    voteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (confirmCheckbox.checked) {
            confirmFaceAuth(function() {
                if (!hasVoted) {
                    hasVoted = true;
                    showSection(confirmationScreen);
                } else {
                    alert('لقد قمت بالتصويت بالفعل ولا يمكنك التصويت مرة أخرى.');
                }
            });
        } else {
            alert('يرجى تأكيد صحة المعلومات.');
        }
    });

    // التحقق من بصمة الوجه عند النقر على زر التحقق
    faceAuthButton.addEventListener('click', function() {
        confirmFaceAuth(function() {
            if (!hasVoted) {
                hasVoted = true;
                showSection(confirmationScreen);
            } else {
                alert('لقد قمت بالتصويت بالفعل ولا يمكنك التصويت مرة أخرى.');
            }
        });
    });

    // تحديث قائمة اللواء عند تغيير المحافظة في نموذج التصويت
    governorateSelect.addEventListener('change', function() {
        const governorate = this.value;
        const districtsOptions = districts[governorate] || [];
        districtSelect.innerHTML = '<option value="">اختر لواء</option>';
        districtsOptions.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
        candidateSelect.innerHTML = '<option value="">اختر مرشح</option>';
    });

    // تحديث قائمة المرشحين عند تغيير اللواء في نموذج التصويت
    districtSelect.addEventListener('change', function() {
        const district = this.value;
        const candidatesOptions = candidates[district] || [];
        candidateSelect.innerHTML = '<option value="">اختر مرشح</option>';
        candidatesOptions.forEach(candidate => {
            const option = document.createElement('option');
            option.value = candidate;
            option.textContent = candidate;
            candidateSelect.appendChild(option);
        });
    });

    // تحديث قائمة اللواء عند تغيير المحافظة في نموذج التمويل
    fundingGovernorateSelect.addEventListener('change', function() {
        const governorate = this.value;
        const districtsOptions = districts[governorate] || [];
        fundingDistrictSelect.innerHTML = '<option value="">اختر لواء</option>';
        districtsOptions.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            fundingDistrictSelect.appendChild(option);
        });
    });

    // معالجة تقديم نموذج التمويل
    fundingForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('تم تقديم الطلب سيتم ارسال لك رقم الدفع');
    });
});
