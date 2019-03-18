
//scheme of paper, has 13 attributes
const paper = {
    "type": "object",
    "properties": {
        "Authors": {
            "type": "string"
        },
        "Title": {
            "type": "string"
        },
        "Year": {
            "type": "string"
        },
        "Source title": {
            "type": "string"
        },
        "Link": {
            "type": "string"
        },
        "Abstract": {
            "type": "string"
        },
        "Document Type": {
            "type": "string"
        },
        "Source": {
            "type": "string"
        },
        "EID": {
            "type": "string"
        },
        "abstract_structured": {
            "type": "string"
        },
        "filter_OA_include": {
            "type": "string"
        },
        "filter_study_include": {
            "type": "string"
        },
        "notes": {
            "type": "string"
        }
    },
    "required": ["Authors", "Title", "Year", "Source title", "Link", "Abstract", "Document Type", "Source", "EID", "abstract_structured", "filter_OA_include", "filter_study_include", "notes"]
};

//is the same with paper object
const projectPaper = paper;

//scheme of project, has 2 attributes
const project = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "description": {
            "type": "string"
        }
    },
    "required": ["name", "description"]
};





module.exports = {
    paper,
    project,
    projectPaper
};
