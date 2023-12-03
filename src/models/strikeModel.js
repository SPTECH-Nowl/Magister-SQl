var database = require("../database/config");

function listar(codInstituicao, texto) {
    console.log('no model' + codInstituicao + texto);
    var instrucao = `
    SELECT 
        str.idStrike AS idStrike,
        maq.nome AS nome,
        CONVERT(VARCHAR, str.dataHora, 126) AS dataHora, 
        str.motivo AS motivo, 
        str.duracao AS duracao, 
        sit.situacao AS situacao 
    FROM 
        strike AS str
    JOIN 
        situacao AS sit ON sit.idSituacao = str.fkSituacao
    JOIN 
        maquina AS maq ON maq.idMaquina = str.fkMaquina
    WHERE 
        maq.fkInstituicao = ${codInstituicao} ${texto};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarSituacao(codInstituicao, situacao) {
    console.log('no model');
    var instrucao = `
    SELECT 
        str.idStrike AS idStrike,
        maq.nome AS nome,
        CONVERT(VARCHAR, str.dataHora, 126) AS dataHora, 
        str.motivo AS motivo, 
        str.duracao AS duracao, 
        sit.situacao AS situacao 
    FROM 
        strike AS str
    JOIN 
        situacao AS sit ON sit.idSituacao = str.fkSituacao
    JOIN 
        maquina AS maq ON maq.idMaquina = str.fkMaquina
    WHERE 
        situacao = '${situacao}' AND maq.fkInstituicao = ${codInstituicao};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function contadores(codInstituicao) {
    console.log('no model');
    var instrucao = `
    SELECT 
        COUNT(idStrike) as 'total',
        COUNT(CASE WHEN fkSituacao = 1 THEN 1 END) as 'ativos',
        COUNT(CASE WHEN fkSituacao = 2 THEN 1 END) as 'inativos',
        COUNT(CASE WHEN fkSituacao = 3 THEN 1 END) as 'validos',
        COUNT(CASE WHEN fkSituacao = 4 THEN 1 END) as 'invalidos' 
    FROM 
        strike
    JOIN 
        maquina ON idMaquina = fkMaquina
    WHERE 
        fkInstituicao = ${codInstituicao};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function strikePMes(idInstituicao, qtdMes) {
    console.log("Cheguei no model STRIKE");

    var instrucao = `
    SELECT COUNT(*) AS strikes
    FROM strike
    JOIN maquina ON strike.fkMaquina = maquina.idMaquina
    WHERE maquina.fkInstituicao = ${idInstituicao} AND
          ${qtdMes}
    `;

    console.log("Executando a instrução SQL:\n" + instrucao);
    return database.executar(instrucao);
}

function kpiInfos(idInstituicao){
    var instrucao = `
    SELECT 
        (SELECT COUNT(idStrike) FROM strike
        JOIN maquina ON strike.fkMaquina = maquina.idMaquina
        WHERE DATEPART(WEEK, dataHora) = DATEPART(WEEK, GETDATE()) AND fkInstituicao = ${idInstituicao}) as strikesNaSemana,
   
        (SELECT COUNT(idHistorico) FROM historico
        JOIN maquina ON historico.fkMaquina = maquina.idMaquina
        WHERE DATEPART(WEEK, dataHora) = DATEPART(WEEK, GETDATE()) AND fkInstituicao = ${idInstituicao}) as alertasNaSemana,
   
        (SELECT COUNT(DISTINCT m.idMaquina) AS totalMaquinas
        FROM maquina m
        WHERE m.fkInstituicao = ${idInstituicao}) AS totalMaquinas,
   
        (SELECT COUNT(DISTINCT m.idMaquina) AS maquinasComStrike
        FROM maquina m
        JOIN strike s ON m.idMaquina = s.fkMaquina
        WHERE CAST(s.dataHora AS DATE) = CAST(GETDATE() AS DATE) AND s.fkSituacao = 1 AND m.fkInstituicao = ${idInstituicao}) as maquinasComStrike,
       
        (SELECT COUNT(DISTINCT m.idMaquina) AS maquinasComAlerta
        FROM maquina m
        JOIN historico h ON m.idMaquina = h.fkMaquina
        JOIN hardware hw ON h.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE m.fkInstituicao = ${idInstituicao}
        AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        AND (
            (th.tipo = 'Processador' AND h.consumo > 70 AND h.idHistorico = (SELECT MAX(idHistorico) FROM historico WHERE fkMaquina = m.idMaquina AND tipo = 'Processador')) OR
            (th.tipo = 'RAM' AND h.consumo > 70 AND h.idHistorico = (SELECT MAX(idHistorico) FROM historico WHERE fkMaquina = m.idMaquina AND tipo = 'RAM')) OR
            (th.tipo = 'Disco' AND h.consumo > 70 AND h.idHistorico = (SELECT MAX(idHistorico) FROM historico WHERE fkMaquina = m.idMaquina AND tipo = 'Disco'))
        )
        ) AS maquinasComAlerta;
    `;

    return database.executar(instrucao);
}

function excluirStrike(texto) {
    var instrucao = `
        UPDATE strike 
        SET fkSituacao = 2
        ${texto};
    `;

    console.log("Executando a instrução SQL (Exclusão de Strike): \n" + instrucao);
    return database.executar(instrucao);
}

function editarStrike(texto) {
    var instrucao = `
        UPDATE strike
        SET ${texto};
    `;

    console.log("Executando a instrução SQL (Edição de Strike): \n" + instrucao);
    return database.executar(instrucao);
}

function acaoETempoUsuarioEspecifico(idFuncionario) {
    var instrucao = `
    SELECT
        atuacao.idAtuacao,
        atuacao.descricao 
        atuacao.nome AS atuacao_nome,
        permissao.*
    FROM 
        permissao
    JOIN 
        atuacao ON permissao.fkAtuacao = atuacao.idAtuacao
    WHERE 
        permissao.emUso = 1 AND permissao.fkUsuario = ${idFuncionario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function strikesToast(idInstituicao) {
    const instrucao = `
        SELECT 
        TOP 3
            maq.nome AS nome,
            CONVERT (VARCHAR(8), STR.dataHora, 108) AS dataHora
        FROM 
            strike AS str
        JOIN 
            situacao AS sit ON sit.idSituacao = str.fkSituacao
        JOIN 
            maquina AS maq ON maq.idMaquina = str.fkMaquina
        WHERE 
            maq.fkInstituicao = ${idInstituicao} AND str.fkSituacao = 1
        ORDER BY str.dataHora;
    `;

    console.log('strikeToast: ' + instrucao);

    return database.executar(instrucao);
}

module.exports = {
    listar,
    listarSituacao,
    contadores,
    strikePMes,
    kpiInfos,
    excluirStrike,
    acaoETempoUsuarioEspecifico,
    strikesToast,
    editarStrike
};
