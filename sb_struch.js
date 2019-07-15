//table searches where will storage the  copy of paper as local cache from search operation
searches = { //non è cambiata
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
projects = { //non è cambiata
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
project_papers = { //cambiato
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
    project_id: 5, //is the foreign key associated with project table

    //>>>>>>>>>>>>>>>>>>>>>>>>>>><
    field: "screened", //la tab nel quale dovrà comparire la paper (per esempio: backlog, manual o screened)
                       //sarà utile per fetchare facilmente le diverse liste di papers che l'utente richiede
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<>

}

//table users
let users = { //non è cambiata
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
let filters = { //cambiato
    id,
    date_created,
    date_last_modified,
    date_deleted,
    data: {
        name,
        predicate,
        inclusion_description,
        exclusion_description,
    },

    //>>>>>>>>>>>>>>>>>>>>>>>>>>><
    project_id, //project_id fuori e non in data{}
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<>

}



//table filters,  where will storage the votes belong to the projectPaper
let votes = { //cambiato
    id,
    date_created,
    date_last_modified,
    date_deleted,

    //>>>>>>>>>>>>>>>>>>>>>>>>>>><
    data: { /*questo oggetto data te lo passo io con React*/
        answer: 1, //    1 means positive answer, 0 means negative answer, -1 mean undecided
        metadata: {//per ogni voto ci dobbiamo salvare anche il testo evidenziato e se necessario il filtro correlato e i tag
            //pensavo di fare così
            type: "multi-predicate", //indica il tipo di screening
            highlights: [
                            {
                                text : {/* JSON con testo evidenziato che passo io da React*/}, 
                                filter_id: 0}, //di filtro, sarà vuoto in caso di "single-predicate"
                        ],
                        //se highlights è single-predicate conterrà solo un elemento e nessu filter_id, altrimenti è un array
                        //con un elemento per ciascu filtro
            tags: [], //array di tag che l'utente associa al progetto
        }
    },
    //id fuori da data{}
    user_id,
    project_paper_id,
    project_id, //potrà essere utile se vogliamo prendere tutti i voti che ci sono in un progetto
                //oppure dato user_id e project_id possiamo vedere facilmente quante paper ha votato
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<>

}

//>>>>>>>>>>>>>>>>>>>>>>>>>>><
//nuovo tabella
let screenings = { //tabella degli screening che potremo usare per tirare fuori facilmente i progetti che un utente deve screennare
    //quando il backend riceve un insieme di N screeners per un progetto aggiungerà N righe a questa tabella, una per screener
    id,
    date_created,
    date_last_modified,
    date_deleted,
    
    //chiavi esterne
    project_id,
    user_id,

    data: {
        tags: [], //list di tag che un utente usa nello screening di un progetto
                  //a dire la verità è ancora indeciso se salvare i tag qui o nella tabella del progetto
                  //per adesso direi di ignorare i tag e aspettare che Jorge decida
    }
}

/*
ENDPOINTS

per GET screened e backlog non facciamo più degli endpoint specifici ma usiamo GET /papers ->
    /papers?project_id=&orderBy=&sort=&start=&count=
    a questa chiamata aggiungiamo un nuovo campo chiamato type, diventando quindi:
    /papers?project_id=&orderBy=&sort=&start=&count=&type=
    - type = undefined  --> torna papers del progetto
    - type = 'backlog'  --> solo quelle nel backlog
    - type = 'screened' --> solo quelle screened
    - type = 'manual'   --> solo quelle che hanno almeno un voto manuale ma non hanno ancora tutti i voti

per l'endpoint /screening/automated il POST va bene ma dobbiamo anche aggiungere:
    - GET /screening/automated?project_id= --> questa call restituirà lo status(in percentuale) da usare per il polling.
    qualcosa del tipo {status_percentage: 89}

dobbiamo fare l'endpoint /screening/manual con:
    - POST /screening/manual --> esempio payload: {project_id: 1, screeners: [1,2,3], type: "single-predicate"}
    (per ottenere tutte le paper che sono attualmente in manual usiamo GET /papers?type=manual)

dobbiamo fare un enpoint per tornare all'utente la lista di progetti che deve screennare, io pensavo a qualcosa del tipo:
    - GET /screenings               --> lista di progetti che l'utente deve screennare (prende la lista usando la nuova tabella 'screenings' 
                                        joinata con i dati del progetto, dovrebbe essere più efficiete che cercare in 
                                        ogni array di dati lo screneer id dei progetti)
    - GET /screenings?screening_id= --> il backend guarda la lista di papers che l'utente ha già screenato per il progetto
                                        associato allo screening_id e poi prende la prima che l'utente deve
                                        ancora screennare e la restituisce. In pratica chiamando questo endpoint all'utente diamo
                                        una paper del progetto che deve screennare
    - POST /screenings               --> voto e dati dato dall'utente ad una paper
                                        esempio payload: {screening_id, project_paper_id, data: {/** qui ci va il data della tabella votes\*\/}}
    
    nel frontend, il flow di queste ultime chiamate dovrebbe essere il seguente:
     1 - l'utente accede alla lista dei suoi screening e quindi faccio GET /screenings
     2 - l'utente clicca su un progetto della lista quindi...

     3 - io faccio GET /screenings?screening_id= così gli faccio vedere una paper del progetto che deve votare
     4 - l'utente fa il suo voto e quindi io faccio POST /screenings per passare i dati del suo voto
     5 - dopo aver ricevuto 201 (o 204) dal backend torno al punto 3 per fargli vedere la prossima paper che deve votare
*/
//<<<<<<<<<<<<<<<<<<<<<<<<<<<>