// ------------------------------------------------------------------------------ //
//     File:       regions.js --------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { validacionjwt, response500 } = require('../middelwares/middelwares')
const sequelize = require('../seq-conexion.js');

// REGIONES
// GET /regiones – JWT OK
// POST / regiones – JWT  OK
// PATCH / regiones /{region_id} - JWT OK
// DELETE / regiones /{region_id} – JWT  OK



router.get('/', validacionjwt, async (req, res) => {

    try {
        const data = await sequelize.query('SELECT * FROM regions WHERE active = 1',
            { type: sequelize.QueryTypes.SELECT })
        const response = {
            "requestInfo":
            {
                'code': 200,
                'description': 'success!',
                'date': new Date()
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

router.post('/newRegion', validacionjwt, async (req, res) => {

    const { region_name, country_name, city_name } = req.body;
    let region_id, country_id;
    if (!region_name) {
        const response = {
            "requestInfo":
            {
                'code': 400,
                'description': 'region_name cant be undefined',
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
            let region_check = await sequelize.query('SELECT * FROM regions WHERE region_name = ?', {
                replacements: [region_name],
                type: sequelize.QueryTypes.SELECT
            })

            if (!region_check) {
                await sequelize.query('INSERT INTO regions (region_name, active) VALUES (?,?)', {
                    replacements: [region_name, 1],
                    type: sequelize.QueryTypes.INSERT
                })
                let region_idObj = await sequelize.query(`SELECT @@identity AS region_id from regions WHERE region_name = ?`,
                    {
                        replacements: [region_name],
                        type: sequelize.QueryTypes.SELECT
                    })
                region_id = region_idObj[0].region_id;
            }
            if (!region_id) { region_id = region_check[0].region_id }

            // countries
            let country_check = await sequelize.query('SELECT * FROM countries WHERE country_name = ?', {
                replacements: [country_name],
                type: sequelize.QueryTypes.SELECT
            })

            if (!country_check.length) {
                await sequelize.query('INSERT INTO countries (country_name,region_id, active) VALUES (?,?,?)', {
                    replacements: [country_name, region_id, 1],
                    type: sequelize.QueryTypes.INSERT
                })
                let country_idObj = await sequelize.query(`SELECT @@identity AS country_id from countries WHERE country_name = ?`,
                    {
                        replacements: [country_name],
                        type: sequelize.QueryTypes.SELECT
                    })
                country_id = country_idObj[0].country_id;
            }
            if (!country_id) { country_id = country_check[0].country_id }
            //cities
            await sequelize.query('INSERT INTO cities (city_name, country_id, active) VALUES (?,?,?)', {
                replacements: [city_name, country_id, 1],
                type: sequelize.QueryTypes.INSERT
            })


            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': 'new region added correctly!',
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

router.patch('/:region_id/modify', validacionjwt, async (req, res) => {
    const { region_name } = req.body;
    const { region_id } = req.params;

    try {
        let regionCheck = await sequelize.query('SELECT * FROM regions WHERE region_id = ?',
            {
                replacements: [region_id],
                type: sequelize.QueryTypes.SELECT
            })
        if (!!regionCheck.length) {
            if (region_name) {
                await sequelize.query('UPDATE `regions` SET region_name = ? WHERE region_id = ?',
                    {
                        replacements: [region_name, region_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `region_id ${region_id} modified correctly!`,
                    'date': new Date()
                }, "data": {
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
                    'description': `region_id ${region_id} does not exist`,
                    'date': new Date()
                }, "data": {
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

router.delete('/:region_id/delete', validacionjwt, async (req, res) => {
    const { eliminado } = req.query
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { region_id } = req.params;

    if (eliminadoBool) {
        try {
            let companyCheck = await sequelize.query('SELECT * FROM regions WHERE region_id = ?',
                {
                    replacements: [region_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!companyCheck.length) {
                await sequelize.query('UPDATE `regions` SET active = ? WHERE region_id = ?',
                    {
                        replacements: [0, region_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `region_id: ${region_id} is now inactive.`,
                        'date': new Date()
                    }, "data": {
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
                        'description': `region_id: ${region_id} does not exist.`,
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
        const response = {
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