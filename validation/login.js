const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if(Validator.isEmpty(data.email)) {
        errors.email = 'email Field is Required';
    }
    if(!Validator.isEmail(data.email)) {
        errors.email = 'email is Invalid';
    }
    if(!Validator.isLength(data.password, {min: 6, max: 30})){
        errors.password = 'Password Must be At least 6 Character';
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password Field is Required';
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}