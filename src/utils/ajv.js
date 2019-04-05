//the packaged for input validation
const Ajv = require('ajv');
const ajv = new Ajv();
//keyword for empty string
ajv.addKeyword('isNotEmpty', {
    type: 'string',
    validate: function (schema, data) {
        return typeof data === 'string' && data.trim() !== ''
    },
    errors: false
});

module.exports = ajv;