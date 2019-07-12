//table searches where will storage the  copy of paper as local cache from search operation
searches = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data:
        {
            authors,
            title,
            year,
            date,
            type,
            source_title,
            link,
            abstract,
            document_type,
            source,
            eid,
            abstract_structured,
            filter_oa_include,
            filter_study_include,
            notes,
            manual,
            doi,
            metadata: {
                automatedSearch: { //where will save the confidence value per papers searched by automated search
                    value: 0.50, //average value of confidence
                    filters: [
                        {
                            filters_id1: filter_value1 //tuple of filter id and its confidence value
                        },
                        {
                            filters_id2: filter_value2 //tuple of filter id and its confidence value
                        }
                    ]
                }
            }
        }
}

//table projects
projects = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data:
        {
            name,
            description,
            user_id: [], //where will save the user_id for collaborator management
            screeners_id: [], //where will save the user_id for screener management
        }
}

//table projectPapers, where will storage the papers belong to the project
project_papers = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data:
        {
            authors,
            title,
            year,
            date,
            type,
            source_title,
            link,
            abstract,
            document_type,
            source,
            eid,
            abstract_structured,
            filter_oa_include,
            filter_study_include,
            notes,
            manual,
            doi,
            metadata: {

                automatedSearch: { //if the paper comes from automated search
                    value: 0.50, //average value of confidence
                    filters: [
                        {
                            filters_id1: filter_value1 //tuple of filter id and its confidence value
                        },
                        {
                            filters_id2: filter_value2 //tuple of filter id and its confidence value
                        }
                    ]
                }
                ,
                automatedScreening: { //if the paper is evaluated by automated screening service
                    value: 0.50, //average value of confidence
                    filters: [
                        {
                            filters_id1: filter_value1 //tuple of filter id and its confidence value
                        },
                        {
                            filters_id2: filter_value2 //tuple of filter id and its confidence value
                        }
                    ]
                },
                screening: { //if the paper is already screened by automated screening or manual screening
                    result: 0, //1 means true, 0 means false
                    source: "automated screening" //provenance of result
                }
            }
        },
    project_id: 5 //is the foreign key associated with project table
}

//table users
let users = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data: {
        email, //user email
        name, // user name
        picture, // user avatar
    }

}

//table filters,  where will storage the filters belong to the project
let filters = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data: {
        project_id,
        name,
        predicate,
        inclusion_description,
        exclusion_description,
    }

}



//table filters,  where will storage the votes belong to the projectPaper
let votes = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data: {
        user_id,
        project_paper_id,
        answer: 1 //    1 means positive answer, 0 means negative answer
    }

}




