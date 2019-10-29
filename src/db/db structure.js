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
                            id: 1,
                            filterValue: 0.75
                        },
                        {
                            id: 2,
                            filterValue: 0.25
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
            tags, //will save the tags inserted by screeners during the vote
            manual_screening_type //will appear once the project will start being manually screened 
                                  //as multi-predicate or single-predicate
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
                screened: "manual", //can be manual/automated/screened, it's used to retireve the different papers for the
                                    //different tabs
                automatedSearch: { //if the paper comes from automated search
                    value: 0.50, //average value of confidence
                    filters: [
                        {
                            id: 1,
                            filterValue: 0.75
                        },
                        {
                            id: 2,
                            filterValue: 0.25
                        }
                    ]
                },
                automatedScreening: { //if the paper is evaluated by automated screening service
                    value: 0.50, //average value of confidence
                    filters: [
                        {
                            id: 1,
                            filterValue: 0.75
                        },
                        {
                            id: 2,
                            filterValue: 0.25
                        }
                    ]
                },
                screening: { //if the paper is already screened by automated screening or manual screening
                    result: "0", //1 means in, 0 means out
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
    project_id,
    data: {
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
    user_id,
    project_paper_id,
    project_id,
    data: {
        answer: "1", //    1 means positive answer, 0 means negative answer, 2 means undecided
        metadata: {
            tags: [], //array of string assigned to the paper voted
            type, //can be single-predicate or multi-predicate
            highlights: [] //array of highlights information
        }
    }

}

let screenings = {
    id,
    date_created,
    date_last_modified,
    date_deleted,
    project_id,
    user_id,
    data: {
        tags: [], //all the tags the user used for the papers in the screeening
        manual_screening_type //can be 'single-predicate' or 'multi-predicate'
    }
}



