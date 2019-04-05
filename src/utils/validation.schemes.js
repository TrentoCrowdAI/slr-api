
//scheme of paper, has 13 attributes
const paper = {
    "type": "object",
    "properties": {
        "authors": {
            "type": "string",
            "isNotEmpty": true
        },
        "title": {
            "type": "string",
            "isNotEmpty": true
        },
        "year": {
            "type": "string",
            "isNotEmpty": true
        },
        "date": {
            "type": "string",
            "isNotEmpty": true
        },
        "source_title": {
            "type": "string",
            "isNotEmpty": true
        },
        "link": {
            "type": "string",
            "isNotEmpty": true
        },
        "abstract": {
            "type": "string",
            "isNotEmpty": true
        },
        "document_type": {
            "type": "string",
            "isNotEmpty": true
        },
        "source": {
            "type": "string",
            "isNotEmpty": true
        },
        "eid": {
            "type": "string",
            "isNotEmpty": true
        },
        "abstract_structured": {
            "type": "string",

        },
        "filter_oa_include": {
            "type": "string",

        },
        "filter_study_include": {
            "type": "string",

        },
        "notes": {
            "type": "string",

        }
    },
    "required": ["authors", "title", "year", "date","source_title", "link", "abstract", "document_type", "source", "eid", "abstract_structured", "filter_oa_include", "filter_study_include", "notes"]
};

//is the same with paper object
const projectPaper = paper;

//scheme of project, has 2 attributes
const project = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "isNotEmpty": true
        },
        "description": {
            "type": "string",
            "isNotEmpty": true
        }
    },
    "required": ["name", "description"]
};





module.exports = {
    paper,
    project,
    projectPaper
};
