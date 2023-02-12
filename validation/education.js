const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : "";
    data.degree = !isEmpty(data.degree) ? data.degree : "";
    data.from = !isEmpty(data.from) ? data.from : "";
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

    if(Validator.isEmpty(data.school)) {
        errors.school = 'school is required';
    }
    if(Validator.isEmpty(data.degree)) {
        errors.degree = 'degree is required';
    }
    if(Validator.isEmpty(data.from)) {
        errors.from = 'School From Date is required';
    }
    if(Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'School fieldofstudy Date is required';
    }
    
    

    return {
        errors,
        isValid: isEmpty(errors)
    }
}