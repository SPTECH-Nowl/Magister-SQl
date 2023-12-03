// var database = require("../database/config")

// function buscarAcoes() {
//     var instrucao = `
//     SELECT * from atuacao;
//     `;

//     console.log("Executando a instrução SQL: \n" + instrucao);
//     return database.executar(instrucao);
// }


// function buscarAcao(idAcao) {
//     var instrucao = `
//     SELECT * from atuacao where idAtuacao = ${idAcao};
//     `;

//     console.log("Executando a instrução SQL: \n" + instrucao);
//     return database.executar(instrucao);
// }

// function adicionar(nome, descricao) {
//     var instrucao = `
//         insert into atuacao values (null, '${nome}', '${descricao}')
//     `;
//     return database.executar(instrucao);
// }
// module.exports = {
//     buscarAcoes,
//     buscarAcao,
//     adicionar
// };


const database = require("../database/config");

function buscarAcoes() {
    const instrucao = `
    SELECT * FROM atuacao;`;
    
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function buscarAcao(idAcao) {
    const instrucao = `
    SELECT * FROM atuacao WHERE idAtuacao = ${idAcao};`;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function adicionar(nome, descricao) {
    const instrucao = `
    INSERT INTO atuacao (nome, descricao) 
    VALUES ('${nome}', '${descricao}');`;
    
    return database.executar(instrucao);
}

module.exports = {
    buscarAcoes,
    buscarAcao,
    adicionar
};
