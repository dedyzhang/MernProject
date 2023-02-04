const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = 'Name Must be between 2 and 30 Character';
    }
    if(Validator.isEmpty(data.name)) {
        errors.name = 'name Field is Required';
    }
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
    if(Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password Field is Required';
    }
    if(!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Password Must Match';
    }
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}