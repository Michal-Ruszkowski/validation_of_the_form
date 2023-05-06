(() => {
    const inputs = [...document.querySelectorAll('.inputContainer__input')]
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateElement(input)
        })
        input.addEventListener('keyup', () => {
            validateElement(input)
        })
        input.addEventListener('change', () => {
            validateElement(input)
        })
    })

    const validateElement = input => {
        const errorContainer = document.getElementById(input.dataset.errorcontainer)
        const field = fields[input.type]

        if (field.regex) {
            validateString(input, errorContainer, field.errorText, field.regex)
        } else if (field.validate) {
            field.validate(input, errorContainer)
        }
    }

    const validateString = (input, errorContainer, errorText, re) => {

        let result;
        if (re !== "") {
            result = re.test(String(input.value).toLowerCase())
        }

        if (!input.value.length) {
            addError(input, errorContainer, 'This field is required')
        } else if (result !== undefined) {
            if (!result) {
                addError(input, errorContainer, errorText)
            } else {
                removeError(input, errorContainer)
            }
        }
    }

    const validateCheckbox = (input, errorContainer) => {
        if (input.checked) {
            removeError(input, errorContainer)
        } else {
            addError(input, errorContainer, 'This field is required')
        }
    }

    const validateDate = (input, errorContainer) => {
        if (!input.value.length) {
            addError(input, errorContainer, 'This field is required')
        } else {
            const birthDate = new Date(input.value)
            const today = new Date()
            const yearDifference = today.getFullYear() - birthDate.getFullYear()
            const monthDifference = today.getMonth() - birthDate.getMonth()
            const dayDifference = today.getDate() - birthDate.getDate()

            if (yearDifference > 18 || yearDifference === 18 && (monthDifference > 0 || monthDifference === 0 && dayDifference >= 0)) {
                removeError(input, errorContainer)
            } else {
                addError(input, errorContainer, 'Age requirement: 18+')
            }
        }
    }

    const addError = (input, errorContainer, text) => {
        input.classList.add('error')
        errorContainer.innerText = text
    }

    const removeError = (input, errorContainer) => {
        input.classList.remove('error')
        errorContainer.innerText = ""
    }

    const fields = {
        text: {
            regex: /^([A-Za-z]{3,}\s*)+$/,
            errorText: "The name you entered is invalid"
        },
        email: {
            regex: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            errorText: "The email address you entered is invalid"
        },
        date: {
            validate: validateDate,
            errorText: "Age requirement: 18+"
        },
        tel: {
            regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/im,
            errorText: "The phone number you entered is invalid"
        },
        checkbox: {
            validate: validateCheckbox,
            errorText: "This field is required"
        }
    }

    const inputDate = document.getElementById("birthday")
    inputDate.addEventListener("focusin", () => {
        inputDate.type = "date"
    })

    const button = document.querySelector(".button")
    button.addEventListener("click", (e) => validateForm(e))

    const validateForm = e => {
        e.preventDefault();

        let isValid = true
        inputs.forEach(input => {
            validateElement(input)
            if (input.classList.contains("error")) {
                isValid = false
            }
        })
        if (isValid) {
            const form = document.querySelector('.form')
            const typ = document.querySelector('.typ')

            // form.submit();
            form.classList.add('hidden')
            typ.classList.remove('hidden')
        }
    }
})();