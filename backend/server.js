// ------------------------------------------------------------------------------ //
//     File:       server.js ---------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
const app = express();
const usersRoute = require('./routes/users')
const companiesRoute = require('./routes/companies')
const regionsRoute = require('./routes/regions')
const countriesRoute = require('./routes/countries')
const citiesRoute = require('./routes/cities')
const contactsRoute = require('./routes/contacts')
// const sequelize = require('../seq-conexion.js');
// const { jwt, tokenKey } = require('../jwt.js');
// const {response500 } = require('../middelwares/middelwares')
const port = 9000;


app.use(express.json());
// app.use(app.router);
// routes.initialize(app);
app.use((req, res, next) => {
    // res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.listen(port, () => {
    console.log(`App corriendo en puerto ${port}`);
})

app.use('/users', usersRoute);
app.use('/companies', companiesRoute);
app.use('/regions', regionsRoute);
app.use('/countries', countriesRoute);
app.use('/cities', citiesRoute);
app.use('/contacts', contactsRoute);


//LOG IN
// app.post('/', async (req, res) => {
//     const { pass, mail } = req.body

//     try {
//         const [data] = await sequelize.query(`SELECT * FROM users WHERE mail = ?`,
//             {
//                 replacements: [mail],
//                 type: sequelize.QueryTypes.SELECT
//             });
//         if (data?.active == 0) {
//             const response = {
//                 "errors": [
//                     {
//                         'code': 403,
//                         'description': 'User is inactive',
//                         'date': new Date()
//                     }
//                 ]
//             }
//             res.status(403).json(response)
//         } else {

//             if (data?.mail === mail && data?.pass == pass) {
//                 let cifrado = {
//                     'user_id': data.user_id,
//                     'name': data.name,
//                     'surname': data.surname,
//                     'mail': data.mail,
//                     'admin': data.admin,
//                     'active': true

//                 }
//                 req.infoToken = jwt.sign(cifrado, tokenKey, { expiresIn: '1h' })
//                 const response = {
//                     "request info":
//                     {
//                         'code': 200,
//                         'description': 'success!',
//                         'date': new Date()
//                     }
//                     ,
//                     "data": {
//                         "user_fullName": `${data.name} ${data.surname}`,
//                         "admin": (data.admin) ? data.admin : data.admin,
//                         "token": req.infoToken,
//                         "isAuthenticated": true
//                     }

//                 }
//                 res.status(200).json(response)
//             } else {
//                 const response = {
//                     "errors":
//                     {
//                         'code': 401,
//                         'description': 'Incorrect Username or Pass',
//                         'date': new Date()
//                     }
//                     , "data":
//                     {
//                         "isAuthenticated": false
//                     }

//                 }
//                 res.status(401).json(response)
//             }
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json(response500)
//     }

// })
// API
// USUARIOS OK
// GET /usuarios – JWT - Administradores
// POST /usuarios – JWT - Administradores
// PATCH /usuarios/{usuario_id} - JWT - Administradores
// DELETE /usuarios/{usuario_id} – JWT – Administradores
// POST /users/login

// REGIONES OK
// GET /regiones – JWT
// POST / regiones – JWT
// PATCH / regiones /{region_id} - JWT 
// DELETE / regiones /{region_id} – JWT 

// PAISES OK
// GET /paises – JWT 
// POST / paises – JWT 
// PATCH / paises /{ paises _id} - JWT 
// DELETE / paises /{ paises _id} – JWT 

// CIUDADES OK
// GET /ciudades – JWT 
// POST /ciudades – JWT 
// PATCH /ciudades /{ciudad_id} - JWT 
// DELETE /regiones /{ciudad_id} – JWT 

// COMPAÑIAS OK
// GET /compañias – JWT 
// POST / compañias – JWT 
// PATCH / compañias /{compañia_id} - JWT 
// DELETE / compañias /{compañia_id} – JWT 

// CONTACTOS
// GET /compañias – JWT 
// POST / compañias – JWT 
// PATCH / compañias /{compañia_id} - JWT 
// DELETE / compañias /{compañia_id} – JWT 
