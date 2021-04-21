// ------------------------------------------------------------------------------ //
//     File:       middelwares.js ----------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const { jwt, tokenKey } = require('../jwt.js');
const sequelize = require('../seq-conexion.js');
const response500 = {
    "requestInfo":
    {
        'code': 500,
        'description': 'Internal Server error',
        'date': new Date()
    }
    , "data":
    {
        "token": null,
        "isAuthenticated": false
    }

};
//CHEQUEAR MIDDELWARESS QUE SON LOS DE DELILAH RESTO!!! RESPONSES MEJORADAS
// function validacionExistencia(req, res, next) {
//     (async () => {
//         let table = `usuarios`;
//         let param = `usuario`;
//         let usuarios = await sequelize.query(`SELECT * FROM ${table} WHERE ${param} = '${req.body.usuario}'`, { type: sequelize.QueryTypes.SELECT })
//         if (!!usuarios.length) {
//             let response = {
//                 "requestInfo":
//                 {
//                     'code': 401,
//                     'description': 'Incorrect access token',
//                     'date': new Date()
//                 },
//                 "data": {
//                     "token": null,
//                     "isAuthenticated": true
//                 }

//             }

//             let response = {
//                 'code': 403,
//                 'Description': 'username already exists',
//                 'date': new Date()
//             }
//             res.status(403).json(response)
//         } else {
//             next();
//         }
//     })()

// }
function validacionjwt(req, res, next) {


    // const tokeen = req.headers.authorization.split(' ')[1];
    // const verificarToken = jwt.verify(tokeen, tokenKey);
    try {
        const token = req.headers.authorization.split(' ')[1];

        const verificarToken = jwt.verify(token, tokenKey);

        if (verificarToken) {
            req.infoToken = verificarToken;
            console.log('validacionJWT next!')
            return next();
        } else {
            let response = {
                "requestInfo":
                {
                    'code': 401,
                    'description': 'Incorrect access token',
                    'date': new Date()
                },
                "data": {
                    "token": null,
                    "isAuthenticated": false
                }

            }
            res.status(401).json(response)
        }
    } catch (error) {
        console.log(error);

        let response = {
            "requestInfo":
            {
                'code': 500,
                'description': 'JWT Error',
                'date': new Date()
            },
            "data": {
                "token": null,
                "isAuthenticated": false
            }


        }
        res.status(500).json(response)
    }


}

function validacionAdmin(req, res, next) {
    if (req.infoToken == undefined) {

        let response = {
            "requestInfo":
            {
                'code': 400,
                'description': 'You must log in to continue',
                'date': new Date()
            },
            "data": {
                "token": null,
                "isAuthenticated": false
            }

        }
        res.status(400).json(response)
    } else {
        const token = req.headers.authorization.split(' ')[1];
        const verificado = jwt.verify(token, tokenKey);

        if (verificado.admin !== 1) {
            let response = {
                "requestInfo":
                {
                    'code': 401,
                    'description': 'User does not have admin permissions',
                    'date': new Date()
                },
                "data": {
                    "token": null,
                    "isAuthenticated": false
                }
            }
            res.status(400).json(response);
        } else {
            console.log('paso el middelware')
            next();
        }
    }


}

module.exports = { validacionAdmin, validacionjwt, response500 };
