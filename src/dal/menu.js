const { read, execute } = require('./dbHelpers');
const tableName = 'menu_items';

const allMenus = async (whereCondition = {}, columns = "*") => {
    const { name, type } = whereCondition;
    let where = "";
    if(name){
        where = ` AND name LIKE '%${name}%'`
    }
    if(type){
        where = ` AND type LIKE '%${type}%'`
    }
    const sqlQuery = `
    SELECT 
        ${columns}
    FROM 
        ${tableName}
    WHERE 
        available = 1 ${where}
        `;
    const result = await execute(sqlQuery, where);
    return result;
};

const getMenuByCategoriesList = async (data = {}, columns = "*") => {
    const { type } = data;
    const sqlQuery = `
    SELECT 
        ${columns}
    FROM 
        ${tableName}
    WHERE 
        type IN ('${type.join("','")}')
        `;
    return await execute(sqlQuery, type);
};

module.exports = {
    allMenus,
    getMenuByCategoriesList
};