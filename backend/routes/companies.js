// ------------------------------------------------------------------------------ //
//     File:       companies.js ------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { validacionjwt, response500 } = require('../middelwares/middelwares')
const sequelize = require('../seq-conexion.js');

// COMPAÑIAS
// GET /compañias – JWT  OK
// POST / compañias – JWT  OK
// PATCH / compañias /{compañia_id} - JWT OK
// DELETE / compañias /{compañia_id} – JWT OK




router.get('/', validacionjwt, async (req, res) => {

    try {
        const data = await sequelize.query('SELECT companies.company_id,companies.company_name AS company,companies.company_address AS address, companies.mail, companies.phone, cities.city_name AS city, countries.country_name AS country, regions.region_name AS region FROM companies INNER JOIN cities ON companies.city_id = cities.city_id INNER JOIN countries ON cities.country_id = countries.country_id INNER JOIN regions ON countries.region_id = regions.region_id WHERE companies.active = 1',
            { type: sequelize.QueryTypes.SELECT })
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
    }
    catch (error) {
        console.log(error)
        res.status(500).json(response500)
    }

})

router.post('/newCompany', validacionjwt, async (req, res) => {
    const { company_name, company_address, mail, phone, city_id } = req.body;
    console.log(req.body)
    if (!company_name || !company_address || !mail || !phone || !String(city_id)) {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': 'company_name, company_address, mail, phone, city_id cant be undefined',
                'date': new Date()
            },
            "data": {
                "isAuthenticated": true
            }
        }
        res.status(400).json(response);
    } else {
        try {
            await sequelize.query('INSERT INTO companies (company_name, company_address, mail, phone, city_id, active) VALUES (?,?,?,?,?,?)', {
                replacements: [company_name, company_address, mail, phone, city_id, 1],
                type: sequelize.QueryTypes.INSERT
            })
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': 'new company added correctly!',
                    'date': new Date()
                },
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

router.patch('/:company_id/modify', validacionjwt, async (req, res) => {
    const { company_name, company_address, mail, phone, city } = req.body;
    console.log(req.body)
    const { company_id } = req.params;

    try {
        let companyCheck = await sequelize.query('SELECT * FROM companies WHERE company_id = ?',
            {
                replacements: [company_id],
                type: sequelize.QueryTypes.SELECT
            })
        if (!!companyCheck.length) {
            if (company_name) {
                await sequelize.query('UPDATE `companies` SET company_name = ? WHERE company_id = ?',
                    {
                        replacements: [company_name, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (company_address) {
                await sequelize.query('UPDATE `companies` SET company_address = ? WHERE company_id = ?',
                    {
                        replacements: [company_address, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (mail) {
                await sequelize.query('UPDATE `companies` SET mail = ? WHERE company_id = ?',
                    {
                        replacements: [mail, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            if (phone) {
                await sequelize.query('UPDATE `companies` SET phone = ? WHERE company_id = ?',
                    {
                        replacements: [phone, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }

            if (city) {
                let city_id = await sequelize.query('SELECT city_id FROM cities WHERE city_name = ?', {
                    replacements: [city],
                    type: sequelize.QueryTypes.SELECT
                })
                await sequelize.query('UPDATE `companies` SET city_id = ? WHERE company_id = ?',
                    {
                        replacements: [city_id[0].city_id, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }

            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `company_id ${company_id} modified correctly!`,
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
                    'description': `company_id ${company_id} does not exist`,
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

router.delete('/:company_id/delete', validacionjwt, async (req, res) => {
    const { eliminado } = req.query
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { company_id } = req.params;

    if (eliminadoBool) {
        try {
            let companyCheck = await sequelize.query('SELECT * FROM companies WHERE company_id = ?',
                {
                    replacements: [company_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!companyCheck.length) {
                await sequelize.query('UPDATE `companies` SET active = ? WHERE company_id = ?',
                    {
                        replacements: [0, company_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `company_id: ${company_id} is now inactive.`,
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
                        'description': `company_id: ${company_id} does not exist.`,
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
            res.status(500).send(response500);
        }

    }
    else {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': `'eliminado' parameter must be boolean.`,
                'date': new Date()
            }
            ,
            "data": {
                "isAuthenticated": true
            }
        }
        res.status(400).json(response)
    }

})
module.exports = router;