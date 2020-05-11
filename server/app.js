var express = require('express');
var app = express();
var sql = require("mssql");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');
const nodemailer = require("nodemailer");
var twitch = require('twitch-api-v5');
twitch.clientID = 'g4lsbrd0lf4bkytfng5gafkuc93ash';
//var bcrypt = require('bcryptjs');
var configSecretKey = require('./config.js');

const baseUrlFrontEnd = 'http://localhost:4200';

app.use(cookieParser(configSecretKey.secret));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// config for your database
var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'TheGamers'
};

sql.connect(config, function (err) {
    if (err) {
        console.log("ERRORE:" + err);
    }
});

app.get("/api/getUsers", function (req, res) {
    var request = new sql.Request();
    request.query('SELECT * FROM Users', function (error, results, fields) {
        if (error) {
            return res.status(500).send({ auth: false, message: "errore del sistema: " + error });
        }
        if (results) {
            if (results.length > 0) {
                return res.status(200).send({ users: results, message: 'Lista utenti...', });
            }
            else {
                return res.status(401).send({ auth: false, message: 'Utente non autorizzato.', });
            }
        }
    });
});

app.get("/api/getUsersBanned", function (req, res) {
    var request = new sql.Request();
    request.query('SELECT * FROM UsersBanned', function (error, results, fields) {
        if (error) {
            return res.status(500).send({ auth: false, message: "errore del sistema: " + error });
        }
        if (results) {
            console.log(results.length);
            if (results.length > 0) {
                return res.status(200).send({ usersBanned: results, message: 'Lista utenti...' });
            }
            else {
                return res.status(200).send({ usersBanned: false, message: 'Lista utenti vuota' });
            }
        }
    });
});

app.get("/api/getProfileUsers", function (req, res) {
    var requestProfile = new sql.Request();
    requestProfile.query('SELECT * FROM Profile', function (errorProfile, resultsProfile, fields) {
        if (errorProfile) {
            return res.status(500).send({ auth: false, message: "errore del sistema: " + errorProfile });
        }
        if (resultsProfile != undefined && resultsProfile.length > 0) {
            return res.status(200).send({ auth: true, profileUsers: resultsProfile, message: "TUtto apposto." });
        }
    });
});

app.post("/api/getProfileUserByUsername", function (req, res) {
    var requestUser = new sql.Request();
    var requestProfile = new sql.Request();
    requestUser.input('username', sql.VarChar, req.body.username);
    requestUser.query('SELECT ID FROM Users WHERE Username = @username', function (errorUser, resultsUser, fields) {
        if (errorUser) {
            return res.status(500).send({ message: "errore del sistema" });
        }
        if (resultsUser != undefined && resultsUser.length > 0) {
            var IDUser = resultsUser[0].ID;
            requestProfile.input('ID_User', sql.VarChar, IDUser);
            requestProfile.query('SELECT CanaleYoutube,CanaleTwitch,ProfiloInstagram,PaginaFacebook,ProfiloSteam,ID_User FROM Profile WHERE ID_User = @ID_User', function (errorProfile, resultsProfile, fields) {
                if (errorProfile) {
                    return res.status(500).send({ message: "errore del sistema" });
                }
                if (resultsProfile != undefined && resultsProfile.length > 0) {
                    return res.status(200).send({ profileUser: resultsProfile, message: 'Tutto apposto' });
                }
                else {
                    return res.status(200).send({ profileUser: undefined, message: 'Erroreee' });
                }
            });
        }
        else {
            res.status(404).send({ message: 'Cè qualcosa che non va' })
        }
    });
});

app.post("/api/getProfileUserById", function (req, res) {
    var requestProfile = new sql.Request();
    requestProfile.input('id', sql.VarChar, req.body.id);
    requestProfile.query('SELECT CanaleYoutube, CanaleTwitch, ProfiloInstagram, PaginaFacebook, ProfiloSteam, Nome FROM Profile WHERE ID = @id', function (errorProfile, resultsProfile, fields) {
        if (errorProfile) {
            return res.status(500).send({ message: "errore del sistema" });
        }
        if (resultsProfile != undefined && resultsProfile.length > 0) {
            return res.status(200).send({ profileUser: resultsProfile, message: 'Tutto apposto' });
        }
        else {
            return res.status(500).send({ profileUser: undefined, message: 'Erroreee' });
        }
    });
});

app.post("/api/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var requestUser = new sql.Request();
    var requestPassword = new sql.Request();
    var requestRuolo = new sql.Request();
    console.log("Login...");
    requestUser.input('username', sql.VarChar, username);
    requestPassword.input('username', sql.VarChar, username);
    requestPassword.input('password', sql.VarChar, password);
    requestUser.query('SELECT ID FROM Users WHERE Username = @username', function (error, resultsUser, fields) {
        if (error) throw error;
        if (resultsUser) {
            requestPassword.query('SELECT ID_Ruolo FROM Users WHERE Username = @username AND Password = @password', function (error, resultsPassword, fields) {
                if (resultsPassword.length > 0) {
                    requestRuolo.input('idRuolo', sql.Int, resultsPassword[0].ID_Ruolo);
                    requestRuolo.query('SELECT TipoRuolo FROM Roles WHERE ID = @idRuolo', function (errorRuolo, resultsRuolo, fields) {
                        if (errorRuolo) throw errorRuolo;
                        if (resultsRuolo) {
                            if (resultsRuolo.length > 0) {
                                return res.status(200).send({ auth: true, ruolo: resultsRuolo[0], message: 'Login confermato.' });
                            }
                            else {
                                return res.status(401).send({ auth: false, message: 'Utente non autorizzato.', });
                            }
                        }
                        else {
                            return res.status(401).send({ auth: false, message: 'Utente non autorizzato.', });
                        }
                    });
                }
                else {
                    return res.status(200).send({ auth: false, passwordError: true, message: 'Utente non autorizzato.', });
                }
            });
        }
    });
});

app.post("/api/register", function (req, res) {
    var token = req.body.token.key;
    var username = req.body.username;
    var password = req.body.password;
    var nickname = req.body.nickname;
    var email = req.body.email;
    var today = new Date();
    var requestInsertUser = new sql.Request();
    var requestInsertToken = new sql.Request();
    var requestInsertUserProfile = new sql.Request();
    var requestUser = new sql.Request();
    today.setUTCHours(today.getHours());
    requestUser.input('username', sql.VarChar, username);
    requestInsertUser.input('username', sql.VarChar, username);
    requestInsertUser.input('password', sql.VarChar, password);
    requestInsertUser.input('email', sql.VarChar, email);
    requestInsertUser.input('nickname', sql.VarChar, nickname);
    requestInsertUser.input('dataRegistrazione', sql.DateTime, today);
    requestInsertUserProfile.input('canaleYoutube', req.body.youtubeChannel);
    requestInsertUserProfile.input('canaleTwitch', req.body.twitchChannel);
    requestInsertUserProfile.input('profiloInstagram', req.body.profileInstagram);
    requestInsertUserProfile.input('paginaFacebook', req.body.pageFacebook);
    requestInsertUserProfile.input('profiloSteam', req.body.profileSteam);
    requestInsertToken.input('username', sql.VarChar, username);
    requestInsertToken.input('token', token);
    requestInsertToken.input('dataScadenza', sql.DateTime, today);
    requestUser.query('SELECT * FROM Users WHERE Username = @username', function (error, results, fields) {
        var values = JSON.stringify(results);
        if (error) {
            return res.status(500).send({ auth: false, message: 'Error Search username: ' + error });
        }
        if (values.length > 2) {
            return res.status(200).send({ auth: false, message: 'Sei già registrato stronzo, prova un altro username.', alreadyRegistered: true, nicknameUser: username });
        }
        if (results || values.length <= 2) {
            requestInsertUser.query("INSERT INTO Users (Username, Password, Email, Nickname, DataRegistrazione, ID_Ruolo) VALUES (@username, @password, @email, @nickname, @dataRegistrazione, 3) SELECT ID AS LastIDUser FROM Users WHERE ID = @@Identity", function (errorUsers, resultsInsertU, fields) {
                var lastIDUserInserted = JSON.stringify(resultsInsertU[0].LastIDUser);
                if (errorUsers) {
                    return res.status(500).send({ auth: false, message: 'Error users: ' + errorUsers });
                }
                if (lastIDUserInserted != undefined || lastIDUserInserted != '') {
                    requestInsertUserProfile.input('ID_User', lastIDUserInserted);
                    requestInsertUserProfile.query("INSERT INTO Profile (CanaleYoutube,CanaleTwitch,ProfiloInstagram,PaginaFacebook,ProfiloSteam,ID_User) VALUES (@canaleYoutube,@canaleTwitch,@profiloInstagram,@paginaFacebook,@profiloSteam,@ID_User) SELECT ID AS LastIDProfile FROM Profile WHERE ID = @@Identity", function (errorProfile, resultsInsertP, fields) {
                        console.log(resultsInsertP);
                        var lastIDProfileInserted = JSON.stringify(resultsInsertP[0].LastIDProfile);
                        if (errorProfile) {
                            return res.status(500).send({ auth: false, message: 'Error Insert Profile: ' + errorProfile });
                        }
                        if (lastIDProfileInserted != undefined || lastIDProfileInserted != '') {
                            requestInsertToken.query("INSERT INTO Security (Token, DataScadenza, Username) VALUES (@token, @dataScadenza, @username) SELECT ID AS LastIDSecurity FROM Security WHERE ID = @@Identity", function (errorSecurity, resultsInsertS, fields) {
                                var lastIDSecurityInserted = JSON.stringify(resultsInsertS[0].LastIDSecurity);
                                if (errorSecurity) {
                                    return res.status(500).send({ auth: false, message: 'Error security: ' + errorSecurity, });
                                }
                                if (lastIDSecurityInserted != undefined || lastIDSecurityInserted != '') {
                                    return res.status(200).send({ auth: true, message: 'Registrazione confermata.', token: { key: token, dataScadenza: today } });
                                }
                                else {
                                    return res.status(500).send({ auth: false, message: 'Error security: ' + errorSecurity });
                                }
                            });
                        }
                        else {
                            return res.status(500).send({ auth: false, message: 'Error security: ' + errorSecurity });
                        }
                    });

                }
            });
        }
    });
});

app.post("/api/getToken", function (req, res) {
    var token = req.body.token;
    var dataScadenza = req.body.dataScadenza;
    var user = req.body.username;
    var requestFromUsername = new sql.Request();
    requestFromUsername.input('token', sql.VarChar, token);
    requestFromUsername.input('username', sql.VarChar, user);
    requestFromUsername.query('SELECT * FROM Security WHERE Token = @token AND Username = @username', function (error, results, fields) {
        var valuesToken = JSON.stringify(results);
        if (results != undefined && results.length > 0) {
            return res.status(200).send({ tokenFound: true, token: results });
        }
        else {
            return res.status(403).send({ tokenFound: false, message: "Cè qualcosa che non va - " + error })
        }
    });
});

app.post("/api/createToken", function (req, res) {
    var user = { 'username': req.body.username, 'password': req.body.password };
    var today = new Date();
    today.setUTCHours(today.getHours() + 1);
    var token = {
        key: createToken(user),
        dataScadenza: today
    };
    return res.status(200).send({ token: token });
})

app.post("/api/setToken", function (req, res) {
    var token = req.body.token.key;
    var username = req.body.user;
    var data = req.body.token.dataScadenza;
    var dataScadenza = new Date(data);
    var request = new sql.Request();
    request.input('token', sql.VarChar, token);
    request.input('dataScadenza', sql.DateTime, dataScadenza);
    request.input('username', sql.VarChar, username);
    request.query('INSERT INTO Security (Token, DataScadenza, Username) VALUES (@token, @datascadenza, @username)', function (error, results, fields) {
        if (error) {
            return res.status(500).send({ auth: false, message: 'Errore nella scrittura del token.' });
        }
        return res.status(200).send({ auth: true, message: 'Token salvato.', });
    });
});

app.post("/api/deleteToken", function (req, res) {
    console.log("deletetoken: " + JSON.stringify(req.body));
    var username = req.body.username;
    var request = new sql.Request();
    console.log(username);
    request.input('username', sql.VarChar, username);
    request.query('DELETE FROM Security WHERE Username = @username', function (error, results, fields) {
        if (error) {
            return res.status(401).send({ done: false, message: 'Errore nell eliminazione del token.' });
        }
        return res.status(200).send({ done: true, message: 'Token Eliminati.', });
    });
});

app.get("/api/getAllPosts", function (req, res) {
    var request = new sql.Request();
    request.query('SELECT * FROM Posts', function (error, results, fields) {
        if (results.length > 0) {
            return res.status(200).send({ posts: results, message: 'TUtto apposto' });
        }
        else {
            return res.status(404).send({ message: 'Cè qualcosa che non va' })
        }
    });
});

app.post("/api/getPost", function (req, res) {
    var idPost = req.body.id;
    var request = new sql.Request();
    request.input('id', sql.VarChar, idPost);
    request.query('SELECT * FROM Posts WHERE ID = @id', function (error, results, fields) {
        if (results.length > 0) {
            return res.status(200).send({ post: results[0], message: 'TUtto apposto' });
        }
        else {
            return res.status(404).send({ message: 'Cè qualcosa che non va' })
        }
    });
});

app.post("/api/savePost", function (req, res) {
    console.log(req.body);
    var currentPost = {
        id: req.body.id,
        titolo: req.body.titolo,
        contenuto: req.body.contenuto,
        DataPubblicazione: req.body.DataPubblicazione,
        DataUltimaModifica: req.body.DataUltimaModifica,
        ID_User: req.body.ID_User,
        URL_Image: '',
        UsernameAuthor: req.body.autore
    }
    console.log(currentPost);
    var request = new sql.Request();
    request.input('idPost', sql.Int, currentPost.id);
    request.input('titolo', sql.VarChar, currentPost.titolo);
    request.input('contenuto', sql.VarChar, currentPost.contenuto);
    request.input('dataPubblicazione', sql.Date, currentPost.DataPubblicazione);
    request.input('dataUltimaModifica', sql.Date, currentPost.DataUltimaModifica);
    request.input('idUser', sql.Int, currentPost.ID_User);
    request.input('url_image', sql.VarChar, currentPost.URL_Image);
    var queryString = 'UPDATE Posts SET Titolo = @titolo, Contenuto = @contenuto, DataUltimaModifica = @dataUltimaModifica WHERE ID = @idPost AND ID_User = @idUser';
    request.query(queryString, function (error, results, fields) {
        if (fields > 0) {
            return res.status(200).send({ done: true, message: 'TUtto apposto' });
        }
        else {
            return res.status(500).send({ done: false, message: 'Cè qualcosa che non va' })
        }
    });
});

app.post("/api/getUserByID", function (req, res) {
    var idUser = req.body.id;
    var request = new sql.Request();
    request.input('id', sql.VarChar, idUser);
    request.query('SELECT Username FROM Users WHERE ID = @id', function (error, results, fields) {
        if (results != undefined && results.length > 0) {
            if (results[0].Username != undefined && results[0].Username != "") {
                return res.status(200).send({ username: results[0].Username, message: 'TUtto apposto' });
            }
            else {
                return res.status(500).send({ username: '', message: 'Cè qualcosa che non va.' });
            }
        }
        else {
            return res.status(404).send({ message: 'Cè qualcosa che non va' })
        }
    });
});

app.get("/api/getAffiliazioni", function (req, res) {
    var request = new sql.Request();
    request.query('SELECT * FROM Affiliations', function (error, results, fields) {
        if (error) {
            return res.status(500).send({ affiliazioni: undefined, message: 'Errore.. ' + error });
        }
        if (results.length > 0) {
            return res.status(200).send({ affiliazioni: results, message: 'TUtto apposto' });
        }
        else {
            return res.status(200).send({ affiliazioni: results, message: 'Nessuna affiliazione' })
        }
    });
});

app.post("/api/sendmail", (req, res) => {
    let mail = req.body;
    var info = "";
    var err = "";
    sendMail(mail, info => {
        res.status(200).send(info);
    }).catch(err => {
        console.log("errrore");
        console.log(info);
        console.log(err);
        res.status(404).send({ error: err });
    });
});

app.post("/api/createKeyLogin", function (req, res) {
    var user = { 'name': req.body.name, 'nickname': req.body.nickname, 'email': req.body.email };
    var today = new Date();
    today.setUTCMinutes(today.getMinutes() + 5);
    var token = {
        key: createKey(user),
        dataScadenza: today
    };
    return res.status(200).send({ token: token });
})

function createToken(user) {
    var token = jwt.sign({ id: user.password }, configSecretKey.secret, {
        expiresIn: 30000 // expires in 1 hour
    });
    return token;
};

function createKey(user) {
    var token = jwt.sign({ name: user.name, email: user.username, nickname: user.nickname }, configSecretKey.secret, {
        expiresIn: 30000 // expires in 1 hour
    });
    return token;
};

async function sendMail(mail, callback) {
    console.log("mail: " + JSON.stringify(mail));
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "iltuttoinweb@gmail.com", //example of generated by Mailtrap 
            pass: "txbiytycsgrxjtfr" //example of generated by Mailtrap 
        }
    });
    //let keyLogin = createKeyLogin(mail);
    var keyLogin = mail.key;
    let mailFromUserOptions = {
        from: 'cicciobaudo',
        to: mail.email,
        subject: '[' + mail.typeSupportForm + '] :' + 'Test Nodemailer with Mailtrap',
        html: '<h1>Messaggio da parte dell Admin: ' + '</h1>' + mail.message + '<br>'
    };
    if (keyLogin != undefined && keyLogin != "") {
        let mailFromSystemOptions = {
            from: 'System',
            to: mail.email,
            subject: 'Conferma email registrazione',
            html: '<h1>Messaggio dal sistema.</h1>' + '<br>' + mail.message + '<br>'
        };
    }
    // let mailFromSystemOptions = {
    //     from: 'System',
    //     to: mail.email,
    //     subject: 'Conferma email registrazione',
    //     html: '<h1>Messaggio da parte dell Admin: ' + '</h1>' + mail.message + '<br>'
    // };
    let infoMail = "";

    if (mail.fromSystem) {
        infoMail = await transporter.sendMail(mailFromSystemOptions);
    }
    else {
        infoMail = await transporter.sendMail(mailFromUserOptions);
    }

    return callback(infoMail);
};

function createKeyLogin(mail) {
    var key = jwt.sign({ name: mail.name, nickname: mail.nickname }, configSecretKey.secret, {
        expiresIn: 30000 // expires in 1 hour
    });
    return key;
};

var server = app.listen(5000, function () {
    console.log('Server is running..');
});