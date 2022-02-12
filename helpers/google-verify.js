const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);


async function googleVerify(token = "") {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID
    });

    const { given_name, family_name, email } = ticket.getPayload();

    return {
        given_name,
        family_name,
        email
    }

}

module.exports = {
    googleVerify
}