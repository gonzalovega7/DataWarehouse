
import React, { useCallback, useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
//CONTEXT
import { UserTableContext } from '../../context/userTableContext'
import { RegionsContext } from '../../context/regionsContext'
//HYPER-TREE
import Tree, {
    useTreeState,
    treeHandlers,
} from 'react-hyper-tree';
//ICONS
import { GrEdit } from 'react-icons/gr';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
//COMPONENTS & CSS
import Inputs from '../supportComp/inputs';
import '../css/tree.css'

const RegionsView = () => {
    let data2 = []
    const [displayActions, setDisplayActions] = useState({ bool: false, name: null });
    const [displayInput, setDisplayInput] = useState({ bool: false, name: null });
    const [dataTree, setDataTree] = useState([]);
    const [newRegionsInfo, setNewRegionsInfo] = useState({});

    const { infoCountries } = useContext(UserTableContext)
    const { deleteFromDB, modifyRegions } = useContext(RegionsContext)

    const { required, handlers } = useTreeState({
        id: 'tree',
        data: dataTree,
        defaultOpened: false,
        multipleSelect: false,
    })

    useEffect(() => {

        infoCountries.filter((v, i, a) => a.findIndex(t => (t.region_name === v.region_name)) === i).forEach((x, v) => data2.push({
            id: x.region_id,
            name: x.region_name,
            objName: 'regions',
            children: []
        }))
        data2.forEach((a, b) =>
            infoCountries.filter((v, i, a) => a.findIndex(t => (t.country_name === v.country_name)) === i).forEach((y, v) => { if (a.name == y.region_name) { a.children.push({ id: y.country_id, name: y.country_name, objName: 'countries', children: [] }) } }))

        data2.forEach((a, b) => a.children.forEach((c, d) => infoCountries.forEach((e, f) => { if (e.country_name == c.name) { c.children.push({ id: e.city_id, name: e.city_name, objName: 'cities' }) } })))

        setDataTree(data2)
        treeHandlers.trees.tree.handlers.rerender()

    }, [infoCountries])

    const deleteRegion = (e, id, where) => {
        deleteFromDB(id, where)
        e.stopPropagation()
    }
    const modifyRegion = (e, id, where, parentId) => {

        let changes = { ...newRegionsInfo, parent_id: parentId };
        console.log(changes)
        modifyRegions(id, where, changes, parentId)
        setDisplayInput({ bool: false, name: null })
        treeHandlers.trees.tree.handlers.rerender()
        e.stopPropagation()
    }


    const displayEdit = (e, node, bool) => {
        setDisplayInput({ bool: bool, name: node.data.name });
        treeHandlers.trees.tree.handlers.rerender()
        e.stopPropagation()
    }
    const getInfo = (objectTag, value) => {
        console.log('objectTag, value')
        console.log(objectTag, value)
        if (objectTag === 'regions') { setNewRegionsInfo({ where: objectTag, region_name: value }); console.log(value) }
        if (objectTag === 'countries') { setNewRegionsInfo({ where: objectTag, country_name: value }); console.log(value) } // aca deberia pasar el region_id
        if (objectTag === 'cities') { setNewRegionsInfo({ where: objectTag, city_name: value }); console.log(value) }//aca deberia pasar el country_id

    }



    // METHOD to render the tree
    const renderNode = useCallback(({
        node,
        onToggle

    }) => (
        <div className="tree-node" key={node.data.title}
            onClick={(displayInput.bool && displayInput.name == node.data.name) ? null : (
                onToggle)}
            onMouseEnter={(e) => {
                setDisplayActions({ bool: true, name: node.data.name })
                treeHandlers.trees.tree.handlers.rerender()
                // console.log(treeHandlers.trees.tree.handlers.rerender)
            }}
            onMouseLeave={(e) => {
                setDisplayActions({ bool: false, name: null })
                treeHandlers.trees.tree.handlers.rerender()
            }}
        >
            <div
                onClick={onToggle}
                className={'tree-icon'}
            />
            <div
                className={
                    'node-content-wrapper'
                }

                onClick={
                    () => treeHandlers.trees.tree.handlers.setSelected(
                        node,
                        !node.isSelected(),
                    )
                }
            >
                <div className={(displayInput.bool && displayInput.name == node.data.name) ? 'titles inputsTitle' : 'titles'}>
                    {/* renders a Div with H6, Renders an input if we click en the Pencil icon */}
                    {(displayInput.bool && displayInput.name == node.data.name) ?
                        <Inputs label={(node.data.objName == 'regions') ? 'Region' : (node.data.objName == 'countries') ? 'Pais' : 'Ciudad'}
                            objectTag={node.data.objName}
                            type='text'
                            defaultValue={node.data.name}
                            getInfo={getInfo}
                        // onClick={(e) => e.preventDefault()}
                        /> : (
                            <>
                                <h6 className="node-title-geo">
                                    {(node.data.objName == 'regions') ? 'Region' : (node.data.objName == 'countries') ? 'Pais' : 'Ciudad'}
                                </h6>
                                <div className="node-title">
                                    {node.data.name}
                                </div>
                            </>
                        )
                    }


                </div>
                <div className='countAndAction'>

                    {/* Renders three dots. If we hover on the div, renders trashcan and pencil, if we press on pencil, renders a tick */}
                    <div className='acciones'>{
                        (displayActions.name == node.data.name && displayActions.bool === true) ?
                            <span >
                                {(displayInput.bool && displayInput.name == node.data.name) ?
                                    (<><AiOutlineCheckCircle className='tick' onClick={(e) => { modifyRegion(e, node.data.id, node.data.objName, node.options.parent?.id) }} /> <AiOutlineCloseCircle className='cross' onClick={(e) => { displayEdit(e, node, false) }} /> </>) :
                                    (<><FaTrash className='icon-hover' onClick={(e) => { deleteRegion(e, node.data.id, node.data.objName); treeHandlers.trees.tree.handlers.rerender() }} /><GrEdit className='icon-hover' onClick={(e) => { displayEdit(e, node, true) }} /></>)
                                }
                            </span> :
                            <BiDotsHorizontalRounded />}
                    </div>
                    {/* <span className='acciones'><FaTrash className='icon-hover' onClick={(e) => { deleteRegion(e, node.data.id, node.data.objName) }} /><GrEdit className='icon-hover' onClick={(e) => { displayEdit({region:node.data.objName}) }} /></span> */}
                    {!!node.options.childrenCount && (
                        <div className="children-length">
                            <div>{node.options.childrenCount}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ), [displayActions, dataTree, displayInput])



    return (
        <section className='regions-sect'>
            <h1>Regiones</h1>
            <div className='userComp-div'>
                <NavLink className='generic-button' to={{ pathname: `/regions/addNew` }}> + Agregar </NavLink>
            </div>
            <Tree
                {...required}
                {...handlers}

                draggable={true}
                depthGap={20}
                disableLines={true}
                renderNode={renderNode}
            />

        </section>
    )
}

export default RegionsView;

