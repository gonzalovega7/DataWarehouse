// ------------------------------------------------------------------------------ //
//     File:       countries.js ------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { validacionjwt, response500 } = require('../middelwares/middelwares')
const sequelize = require('../seq-conexion.js');

// PAISES
// GET /paises – JWT  OK
// POST / paises – JWT OK
// PATCH / paises /{ paises _id} - JWT OK
// DELETE / paises /{ paises _id} – JWT  OK



router.patch('/:country_id/modify', validacionjwt, async (req, res) => {
    const { country_name, } = req.body;
    const { country_id } = req.params;
    console.log(req.body)
    try {
        let countryCheck = await sequelize.query('SELECT * FROM countries INNER JOIN regions ON countries.region_id = regions.region_id WHERE countries.country_id = ? AND countries.active = 1 AND regions.active = 1',
            {
                replacements: [country_id],
                type: sequelize.QueryTypes.SELECT
            })
        if (!!countryCheck.length) {
            if (country_name) {
                await sequelize.query('UPDATE `countries` SET country_name = ? WHERE country_id = ?',
                    {
                        replacements: [country_name, country_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }
            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `country_id ${country_id} modified correctly!`,
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
                    'description': `country_id ${country_id} does not exist`,
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

router.delete('/:country_id/delete', validacionjwt, async (req, res) => {
    const { eliminado } = req.query
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { country_id } = req.params;

    if (eliminadoBool) {
        try {
            let companyCheck = await sequelize.query('SELECT * FROM countries WHERE country_id = ?',
                {
                    replacements: [country_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!companyCheck.length) {
                await sequelize.query('UPDATE `countries` SET active = ? WHERE country_id = ?',
                    {
                        replacements: [0, country_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `country_id: ${country_id} is now inactive.`,
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
                        'description': `country_id: ${country_id} does not exist.`,
                        'date': new Date()
                    }
                    , "data": {
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
            , "data": {
                "isAuthenticated": true
            }
        }
        res.status(400).json(response)
    }

})

module.exports = router;