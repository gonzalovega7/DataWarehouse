// ------------------------------------------------------------------------------ //
//     File:       contacts.js -------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { validacionjwt, response500 } = require('../middelwares/middelwares')
const sequelize = require('../seq-conexion.js');

// CONTACTOS
// GET /contactos – JWT
// POST / contactos – JWT
// PATCH / contactos / {contactos} - JWT
// DELETE / contactos /{contactos} – JWT


router.get('/', validacionjwt, async (req, res) => {
    const { user_id } = req.infoToken;
    // const { offset } = (req.query) ? Math.floor(req.query)-(req.query%10) : 0;
    const { offset } = req.query;
    // const offsetNumber = (Number(offset)) ? Math.floor(Number(offset)) - (Number(offset) % 10) : 0;
    const offsetNumber = Number(offset);
    if (Number(offset) % 10 !== 0) {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': `Offset number must be multiple of ten`,
                'date': new Date()
            },
            "data": {
                "isAuthenticated": true
            }

        }
        res.status(400).json(response)
    }
    let queryParams = '';
    if (req.query) {
        let { name, position, city, country, region, company, interest } = req.query;

        if (name) { queryParams += ` AND contacts.name = ${name}  `; }
        if (position) { queryParams += ` AND contacts.position = ${position}  `; }
        if (city) { queryParams += ` AND cities.city_name = ${city} `; }
        if (country) { queryParams += ` AND countries.country_name = ${country} `; }
        if (region) { queryParams += ` AND regions.region_name = ${region} `; }
        if (company) { queryParams += ` AND companies.company_name = ${company} `; }
        if (interest) { queryParams += ` AND contacts.interest = ${interest} `; }
    }

    try {
        // const data = await sequelize.query('SELECT * FROM contacts WHERE active = 1 and user_id = ?',
        const data = await sequelize.query(`SELECT contacts.contact_id,contacts.name, contacts.surname, contacts.position, contacts.mail, contacts.interest, cities.city_name AS city, countries.country_name AS country, regions.region_name AS regions, companies.company_name AS company FROM contacts INNER JOIN cities ON contacts.city_id = cities.city_id INNER JOIN countries ON countries.country_id = cities.country_id  INNER JOIN regions ON countries.region_id = regions.region_id INNER JOIN companies ON companies.company_id = contacts.company_id WHERE contacts.active = 1 AND companies.active = 1 AND regions.active = 1 AND countries.active = 1 AND cities.active = 1 ${queryParams} AND user_id = ? LIMIT 10 OFFSET ?`,
            {
                replacements: [user_id, offsetNumber],
                type: sequelize.QueryTypes.SELECT
            })
        const pageCount = await sequelize.query('SELECT COUNT(*) AS `Rows` FROM `contacts`INNER JOIN cities ON contacts.city_id = cities.city_id INNER JOIN countries ON countries.country_id = cities.country_id INNER JOIN regions ON countries.region_id = regions.region_id INNER JOIN companies ON companies.company_id = contacts.company_id WHERE user_id = ? AND contacts.active = 1 AND companies.active = 1 AND regions.active = 1 AND countries.active = 1 AND cities.active = 1',
            {
                replacements: [user_id],
                type: sequelize.QueryTypes.SELECT
            })
        // console.log(pageCount[0].Rows)
        const response = {
            "requestInfo":
            {
                'code': 200,
                'description': 'success!',
                'date': new Date()
            },
            'PaginationInfo': {
                'Page': ((offsetNumber / 10) + 1),
                'PageCount': (Math.round(Math.round(pageCount[0].Rows) / 10) + 1)
            }
            ,
            "data": {
                "data": data,
                "isAuthenticated": true
            }
        }
        res.status(200).json(response)
    }
    catch (error) {
        console.log(error)
        res.status(500).json(response500)
    }

})

router.post('/newContact', validacionjwt, async (req, res) => {
    const { name, surname, position, mail, interest, city_name, company_name } = req.body;
    const { user_id } = req.infoToken
    if (!name || !surname || !position || !mail || !interest || !company_name || !city_name) {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': 'name, surname, position, mail, interest, company_id, city_id cant be undefined',
                'date': new Date()
            }
            ,
            "data": {
                "isAuthenticated": true
            }
        }
        res.status(400).json(response);
    } else {
        try {
            let company_id = await sequelize.query('SELECT company_id FROM companies WHERE company_name = ?', {
                replacements: [company_name],
                type: sequelize.QueryTypes.SELECT
            })
            console.log(company_id[0].company_id)
            let city_id = await sequelize.query('SELECT city_id FROM cities WHERE city_name = ?', {
                replacements: [city_name],
                type: sequelize.QueryTypes.SELECT
            })
            console.log(city_id[0].city_id)

            await sequelize.query('INSERT INTO contacts (name, surname, position, mail, interest, company_id, city_id,user_id, active) VALUES (?,?,?,?,?,?,?,?,?)', {
                replacements: [name, surname, position, mail, interest, company_id[0].company_id, city_id[0].city_id, user_id, 1],
                type: sequelize.QueryTypes.INSERT
            })
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': 'new contact added correctly!',
                    'date': new Date()
                }
                ,
                "data": {
                    "isAuthenticated": true
                }
            }
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json(response500)
        }
    }
})
//HASTA ACA INFO CORRECTA, NOSE SI ENDPOINTS CORRECTOS! REVISAR LOGICA

router.patch('/:contact_id/modify', validacionjwt, async (req, res) => {
    const { name, surname, position, mail, interest, company_name, city_name } = req.body;
    const { contact_id } = req.params;
    console.log('req.body')
    console.log(req.body)
    console.log('req.body')
    try {
        let contactCheck = await sequelize.query('SELECT * FROM contacts WHERE contact_id = ?',
            {
                replacements: [contact_id],
                type: sequelize.QueryTypes.SELECT
            })

        if (!!contactCheck.length) {
            if (name) {
                await sequelize.query('UPDATE `contacts` SET name = ? WHERE contact_id = ?',
                    {
                        replacements: [name, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (surname) {
                await sequelize.query('UPDATE `contacts` SET surname = ? WHERE contact_id = ?',
                    {
                        replacements: [surname, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (position) {
                await sequelize.query('UPDATE `contacts` SET position = ? WHERE contact_id = ?',
                    {
                        replacements: [position, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (mail) {
                await sequelize.query('UPDATE `contacts` SET mail = ? WHERE contact_id = ?',
                    {
                        replacements: [mail, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (interest) {
                await sequelize.query('UPDATE `contacts` SET interest = ? WHERE contact_id = ?',
                    {
                        replacements: [interest, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (company_name) {
                let company_id = await sequelize.query('SELECT company_id FROM companies WHERE company_name = ?', {
                    replacements: [company_name],
                    type: sequelize.QueryTypes.SELECT
                })

                await sequelize.query('UPDATE `contacts` SET company_id = ? WHERE contact_id = ?',
                    {
                        replacements: [company_id[0].company_id, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (city_name) {

                let city_id = await sequelize.query('SELECT city_id FROM cities WHERE city_name = ?', {
                    replacements: [city_name],
                    type: sequelize.QueryTypes.SELECT
                })
                await sequelize.query('UPDATE `contacts` SET city_id = ? WHERE contact_id = ?',
                    {
                        replacements: [city_id[0].city_id, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }


            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `contact_id ${contact_id} modified correctly!`,
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
                    'description': `contact_id ${contact_id} does not exist`,
                    'date': new Date()
                }
                ,
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

router.delete('/:contact_id/delete', validacionjwt, async (req, res) => {
    const { eliminado } = req.query
    console.log(req.query)
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { contact_id } = req.params;

    if (eliminadoBool) {
        try {
            let contactCheck = await sequelize.query('SELECT * FROM contacts WHERE contact_id = ?',
                {
                    replacements: [contact_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!contactCheck.length) {
                await sequelize.query('UPDATE `contacts` SET active = ? WHERE contact_id = ?',
                    {
                        replacements: [0, contact_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `contact_id: ${contact_id} is now inactive.`,
                        'date': new Date()
                    }
                    ,
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
                        'description': `contact_id: ${contact_id} does not exist.`,
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
        let response = {
            "requestInfo":
            {
                'code': 400,
                'description': `'eliminado' parameter must be boolean.`,
                'date': new Date()
            },
            "data": {
                "isAuthenticated": true
            }

        }


        res.status(400).json(response)
    }

})
module.exports = router;