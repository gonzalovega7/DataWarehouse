// ------------------------------------------------------------------------------ //
//     File:       cities.js ---------------------------------------------------- //
//     Author:     Gonzalo Vega ------------------------------------------------- //
// ------------------------------------------------------------------------------ //

const express = require('express');
let router = express.Router();
const { validacionjwt, response500 } = require('../middelwares/middelwares');
const sequelize = require('../seq-conexion.js');


// CIUDADES
// GET /ciudades – JWT OK
// PATCH /ciudades /{ciudad_id} - JWT OK
// DELETE /regiones /{ciudad_id} – JWT OK

router.get('/', validacionjwt, async (req, res) => {

    try {
        const data = await sequelize.query('SELECT cities.city_name,cities.city_id, countries.`country_name`,countries.`country_id`, regions.`region_name`,regions.`region_id` FROM cities INNER JOIN countries ON cities.country_id = countries.country_id INNER JOIN regions ON countries.region_id = regions.region_id WHERE cities.active = 1 AND countries.active = 1 AND regions.active = 1',
            { type: sequelize.QueryTypes.SELECT })
        const response = {
            "requestInfo":
            {
                'code': 200,
                'description': 'success!',
                'date': new Date()
            }
            , "data": {
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

router.patch('/:city_id/modify', validacionjwt, async (req, res) => {
    const { city_name, parent_id } = req.body;
    const { city_id } = req.params;
    try {

        let cityCheck = await sequelize.query('SELECT * FROM cities INNER JOIN countries ON cities.country_id = countries.country_id WHERE cities.city_id = ? AND cities.active = 1 AND countries.active =1',
            {
                replacements: [city_id],
                type: sequelize.QueryTypes.SELECT
            })
        if (!!cityCheck.length) {
            if (city_name) {
                await sequelize.query('UPDATE `cities` SET city_name = ? WHERE city_id = ?',
                    {
                        replacements: [city_name, city_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
            }

            const response = {
                "requestInfo":
                {
                    'code': 200,
                    'description': `city_id ${city_id} modified correctly!`,
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
                    'description': `country_id ${parent_id} does not exist`,
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

router.delete('/:city_id/delete', validacionjwt, async (req, res) => {
    const { eliminado } = req.query
    let eliminadoBool = JSON.parse(eliminado.toLowerCase());
    const { city_id } = req.params;

    if (eliminadoBool) {
        try {
            let companyCheck = await sequelize.query('SELECT * FROM cities WHERE city_id = ?',
                {
                    replacements: [city_id],
                    type: sequelize.QueryTypes.SELECT
                })
            if (!!companyCheck.length) {
                await sequelize.query('UPDATE `cities` SET active = ? WHERE city_id = ?',
                    {
                        replacements: [0, city_id],
                        type: sequelize.QueryTypes.UPDATE
                    })
                const response = {
                    "requestInfo":
                    {
                        'code': 200,
                        'description': `city_id: ${city_id} is now inactive.`,
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
                        'description': `city_id: ${city_id} does not exist.`,
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