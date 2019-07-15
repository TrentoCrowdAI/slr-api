
const sendMail = require(__base + 'utils/email/sender');
//the config file
const config = require(__base + 'config');

/**
 * function to send email to the recipient to notify him the sharing of project
 * @param recipient_email
 * @param {Object} sender user object
 * @param {Object} project object
 */
async function shareProjectMail(recipient_email ,sender , project) {

    //subject of email
    let subject = sender.data.name +" shared the project "+project.data.name + " with you";

    //body of email
    let htmlText = "" +
        "<div>" +
        "   <div class=\"picture\">" +
        "       <img src=\""+sender.data.picture+"\"/>" +
        "   </div>" +
        "   <div class=\"title\">" +
        "       <h2>@"+sender.data.name+" has shared the project: "+project.data.name+" with you</h2>" +
        "   </div>" +
        "   <div class=\"link\">" +
        "       <a href=\""+config.home_url+"projects/"+project.id+"\">View the project</a>" +
        "   </div>" +
        "</div>";

    //send email
    await sendMail(recipient_email, subject, htmlText);


}

module.exports = shareProjectMail;