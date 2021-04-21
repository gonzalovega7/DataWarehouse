// ------------------------------------------------------------------------------ //
//     File:       users.js ----------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { jwt, tokenKey } = require('../jwt.js');
const { validacionAdmin, validacionjwt, response500 } = require('../middelwares/middelwares');
const sequelize = require('../seq-conexion.js');

// API
// USUARIOS
// GET /usuarios – JWT - Administradores OK
// POST /usuarios – JWT - Administradores OK
// PATCH /usuarios/{usuario_id} - JWT - Administradores OK
// DELETE /usuarios/{usuario_id} – JWT – Administradores OK
// POST /users/login OKz


// CREATE NEW USERS
router.post('/newUser', validacionjwt, validacionAdmin, async (req, res) => {
    // console.log(req.body)
    const { name, surname, mail, pass, admin, phone } = req.body;

    if (!name || !surname || !mail || !pass || !toString(admin) || !phone) {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': 'name, surname, mail, pass, admin, phone cant be undefined',
                'date': new Date()
            },
            "data": {
                "isAuthenticated": true
            }

        }

        res.status(400).json(response);
    } else {
        try {
            await sequelize.query('INSERT INTO users (name, surname, mail, pass, admin, phone, active) VALUES (?,?,?,?,?,?,?)', {
                replacements: [name, surname, mail, pass, admin, phone, 1],
                type: sequelize.QueryTypes.INSERT
            })
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': 'new user added correctly!',
                    'date': new Date()
                },
                "data": {
                    "isAuthenticated": true
                }

            }
            res.status(200).json(response)
        } catch (err) {
            if (err.original.code === 'ER_DUP_ENTRY') {
                const response = {
                    "requestInfo":
                    {
                        'code': 409,
                        'description': 'duplicated conflict error!',
                        'date': new Date(),
                        'error': 'Duplicated'
                    },
                    "data": {
                        "isAuthenticated": true
                    }

                }
                res.status(409).json(response)
            } else {
                res.status(500).json(response500)
            }
            console.log(err.original.code)
        }
    }
})

// BRING ALL USERS
router.get('/', validacionjwt, validacionAdmin, async (req, res) => {
    const { mail } = req.query;
    // console.log(mail)
    try {
        const data = await sequelize.query('SELECT user_id,name,surname, mail,admin, phone FROM users WHERE mail!=? AND active = 1', {
            replacements: [mail],
            type: sequelize.QueryTypes.SELECT
        })
        // console.log(data)
        const response = {
            "requestInfo":
            {
                'code': 200,
                'description': 'success!',
                'date': new Date()
            },
            "data": {
                "data": data,
                "isAuthenticated": true
            }
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json(response500)
    }
})

// //LOG IN
router.post('/login', async (req, res) => {
    const { pass, mail } = req.body

    try {
        const [data] = await sequelize.query(`SELECT * FROM users WHERE mail = ?`,
            {
                replacements: [mail],
                type: sequelize.QueryTypes.SELECT
            });
        if (data?.active == 0) {

            const response = {
                "requestInfo":
                {
                    'code': 403,
                    'description': 'User is inactive',
                    'date': new Date()
                },
                "data": {
                    "token": null,
                    "isAuthenticated": false
                }
            }

            res.status(403).json(response)
        } else {

            if (data?.mail === mail && data?.pass == pass) {
                let cifrado = {
                    'user_id': data.user_id,
                    'name': data.name,
                    'surname': data.surname,
                    'mail': data.mail,
                    'admin': data.admin,
                    'active': true

                }
                req.infoToken = jwt.sign(cifrado, tokenKey, { expiresIn: '1h' })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': 'success!',
                        'date': new Date()
                    }
                    ,
                    "data": {
                        "user_fullName": `${data.name} ${data.surname}`,
                        "mail": data.mail,
                        "admin": data.admin,
                        "token": req.infoToken,
                        "isAuthenticated": true
                    }

                }
                res.status(200).json(response)
            } else {

                const response = {
                    "requestInfo":
                    {
                        'code': 401,
                        'description': 'Incorrect Username or Pass',
                        'date': new Date()
                    },
                    "data": {
                        "token": null,
                        "isAuthenticated": false
                    }
                }
                res.status(401).json(response)
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(response500)
    }

})

router.patch('/:user_id', validacionjwt, validacionAdmin, async (req, res) => {
    const { name, surname, mail, pass, admin, phone } = req.body;
    const { user_id } = req.params;

    try {
        let chequeoUser = await sequelize.query('SELECT * FROM users WHERE user_id = ?',
            {
                replacements: [user_id],
                type: sequelize.QueryTypes.SELECT
            })
        if (!!chequeoUser.length) {
            if (name) {
                await sequelize.query('UPDATE `users` SET name = ? WHERE user_id = ?',
                    {
                        replacements: [name, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (surname) {
                await sequelize.query('UPDATE `users` SET surname = ? WHERE user_id = ?',
                    {
                        replacements: [surname, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (mail) {
                await sequelize.query('UPDATE `users` SET mail = ? WHERE user_id = ?',
                    {
                        replacements: [mail, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (pass) {
                await sequelize.query('UPDATE `users` SET pass = ? WHERE user_id = ?',
                    {
                        replacements: [pass, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (admin) {
                await sequelize.query('UPDATE `users` SET admin = ? WHERE user_id = ?',
                    {
                        replacements: [admin, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (phone) {
                await sequelize.query('UPDATE `users` SET phone = ? WHERE user_id = ?',
                    {
                        replacements: [phone, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `user_id ${user_id} modified correctly!`,
                    'date': new Date()
                },
                "data": {
                    "isAuthenticated": true
                }
            }

            res.status(200).json(response)
        }
        else {
            const response = {
                "requestInfo":
                {
                    'code': 400,
                    'description': `user_id ${user_id} does not exist!`,
                    'date': new Date()
                },
                "data": {
                    "isAuthenticated": true
                }
            }
            res.status(400).json(response)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(response500);
    }
})

router.delete('/:user_id/delete', validacionjwt, validacionAdmin, async (req, res) => {

    const { eliminado } = req.query
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { user_id } = req.params;

    if (eliminadoBool) {
        try {
            let chequeoUser = await sequelize.query('SELECT * FROM users WHERE user_id = ?',
                {
                    replacements: [user_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!chequeoUser.length) {
                await sequelize.query('UPDATE `users` SET active = ? WHERE user_id = ?',
                    {
                        replacements: [0, user_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `user_id: ${user_id} is now inactive.`,
                        'date': new Date()
                    },
                    "data": {
                        "isAuthenticated": true
                    }

                }
                res.status(200).json(response)
            }
            else {
                const response = {
                    "requestInfo":
                    {
                        'code': 400,
                        'description': `user_id: ${user_id} does not exist.`,
                        'date': new Date()
                    },
                    "data": {
                        "isAuthenticated": true
                    }
                }
                res.status(400).json(response)
            }
        } catch (error) {
            res.status(500).send(response500);
        }

    }
    else {
        res.status(500).json('Parametro esperado eliminado=true');
    }
})
module.exports = router;
