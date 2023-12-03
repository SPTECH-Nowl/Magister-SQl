
let database = require("../database/config");

function capturarDadosMaquina(idMaquina, idInstituicao) {
    const instrucao = `
            SELECT 
            m.idMaquina AS id,
            m.nome AS nome,
            m.so AS so,
            m.emUso AS emUso,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware WHERE fkTipoHardware = 3 AND idMaquina = m.idMaquina) AS capacidadeRam,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware WHERE fkTipoHardware = 2 AND idMaquina = m.idMaquina) AS capacidadeCPU,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware WHERE fkTipoHardware = 1 AND idMaquina = m.idMaquina) AS capacidadeDisco, 
            (SELECT COUNT(*) FROM strike WHERE fkMaquina = m.idMaquina AND CAST(dataHora AS DATE) = CAST(GETDATE() AS DATE)) AS quantidadeStrikes,
            (SELECT COUNT(*) FROM historico WHERE fkMaquina = m.idMaquina AND CAST(dataHora AS DATE) = CAST(GETDATE() AS DATE) AND consumo > 70) AS quantidadeAlertas
        FROM maquina m
        WHERE m.idMaquina = ${idMaquina};
    `;

    console.log(instrucao);
    return database.executar(instrucao);
}

function capturarTodosDadosMaquina(idMaquina, idInstituicao) {
    const instrucao = `
        SELECT 
            m.idMaquina AS id,
            m.nome AS nome,
            m.so AS so,
            m.emUso AS emUso,
            (SELECT TOP 1 CONCAT(fabricante, ' ', modelo, ' ', especificidade) FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 3 AND idMaquina = ${idMaquina}) AS componenteRAM,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 3 AND idMaquina = ${idMaquina}) AS capacidadeRAM,
            (SELECT TOP 1 CONCAT(fabricante, ' ', modelo, ' ', especificidade) FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 2 AND idMaquina = ${idMaquina}) AS componenteCPU,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 2 AND idMaquina = ${idMaquina}) AS capacidadeCPU,
            (SELECT TOP 1 CONCAT(fabricante, ' ', modelo, ' ', especificidade) FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 1 AND idMaquina = ${idMaquina}) AS componenteDisco,
            (SELECT TOP 1 capacidade FROM hardware JOIN componente ON fkHardware = idHardware JOIN maquina ON fkMaquina = idMaquina WHERE fkTipoHardware = 1 AND idMaquina = ${idMaquina}) AS capacidadeDisco,
            (SELECT COUNT(*) FROM strike JOIN maquina ON fkMaquina = idMaquina WHERE fkMaquina = ${idMaquina}) AS qtdStrikes
        FROM maquina m
        JOIN componente c ON c.fkMaquina = m.idMaquina
        JOIN hardware ram ON c.fkHardware = ram.idHardware
        JOIN hardware cpu ON c.fkHardware = cpu.idHardware
        JOIN hardware disco ON c.fkHardware = disco.idHardware
        WHERE m.idMaquina = ${idMaquina}
    `;

    return database.executar(instrucao);
}



function capturarTodasMaquinas(idInstituicao, ordAlfabetica = '', qtdStrikes = '', emUso = '', estado = '', pesquisa = '') {
    let instrucao = `
            SELECT TOP 100 PERCENT
            m.idMaquina as id,
            m.nome AS nome,
            m.emUso AS emUso,
            m.SO AS so,
            (SELECT COUNT(*) FROM strike WHERE fkMaquina = m.idMaquina AND fkSituacao IN (1, 3)) AS qtdStrikes,
            CASE
                WHEN (
                    SELECT consumo
                    FROM historico h
                    WHERE h.fkMaquina = m.idMaquina
                        AND h.fkComponente IN (
                            SELECT idComponente
                            FROM componente
                            WHERE fkHardware IN (
                                SELECT idHardware
                                FROM hardware
                                WHERE fkTipoHardware IN (
                                    SELECT idTipoHardware
                                    FROM tipoHardware
                                    WHERE tipo = 'RAM'
                                )
                            )
                        )
                    ORDER BY h.dataHora DESC
                    OFFSET 0 ROWS FETCH FIRST 1 ROW ONLY
                ) >= 85 THEN 'Crítico'
                WHEN (
                    SELECT consumo
                    FROM historico h
                    WHERE h.fkMaquina = m.idMaquina
                        AND h.fkComponente IN (
                            SELECT idComponente
                            FROM componente
                            WHERE fkHardware IN (
                                SELECT idHardware
                                FROM hardware
                                WHERE fkTipoHardware IN (
                                    SELECT idTipoHardware
                                    FROM tipoHardware
                                    WHERE tipo = 'RAM'
                                )
                            )
                        )
                    ORDER BY h.dataHora DESC
                    OFFSET 0 ROWS FETCH FIRST 1 ROW ONLY
                ) >= 70 THEN 'Alerta'
                ELSE 'Normal'
            END AS status
        FROM maquina m
        JOIN instituicao inst ON inst.idInstituicao = m.fkInstituicao
        WHERE idInstituicao =  ${idInstituicao} ${qtdStrikes} ${emUso} ${estado} ${pesquisa}
        GROUP BY m.idMaquina, m.nome, m.emUso, m.SO;
    `;
    console.log(instrucao);
    return database.executar(instrucao);
}



function capturarConsumoRAM(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, 
            FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, 
            h.consumo, 
            c.max AS maxConsumo, 
            th.tipo 
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'RAM' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY h.dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;
    `;

    return database.executar(instrucao);
}

function capturarConsumoCPU(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, 
            FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, 
            h.consumo, 
            c.max AS maxConsumo, 
            th.tipo 
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'Processador' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY h.dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;
    `;

    return database.executar(instrucao);
}

function capturarConsumoDisco(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, 
            FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, 
            h.consumo, 
            c.max AS maxConsumo, 
            th.tipo 
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'Disco' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY h.dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 8 ROWS ONLY;
    `;

    return database.executar(instrucao);
}

function capturarNovoDadoRAM(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, h.consumo, c.max AS maxConsumo
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'RAM' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY;
    `;

    return database.executar(instrucao);
}

function capturarNovoDadoCPU(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, h.consumo, c.max AS maxConsumo
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'Processador' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY;
    `;

    return database.executar(instrucao);
}

function capturarNovoDadoDisco(idMaquina, idInstituicao) {
    let instrucao = `
        SELECT 
            h.idHistorico, FORMAT(h.dataHora, 'HH:mm:ss') AS dataHora, h.consumo, c.max AS maxConsumo
        FROM historico h
        JOIN componente c ON h.fkComponente = c.idComponente
        JOIN hardware hw ON c.fkHardware = hw.idHardware
        JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
        WHERE th.tipo = 'Disco' AND h.fkMaquina = ${idMaquina}
            AND CAST(h.dataHora AS DATE) = CAST(GETDATE() AS DATE) 
        ORDER BY dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY;
    `;

    return database.executar(instrucao);
}

function editarMaquina(idMaquina, nomeMaquina, SistemaOperacional, idInstituicao) {
    let instrucao = `
        UPDATE maquina
        SET nome = '${nomeMaquina}', SO = '${SistemaOperacional}'
        WHERE idMaquina = ${idMaquina};
    `;
    return database.executar(instrucao);
}

function deletarMaquina(idMaquina) {
    let instrucao = `
        DELETE FROM maquina WHERE idMaquina = ${idMaquina};
    `;

    return database.executar(instrucao);
}

function maisUsoCpuRamKpi(idInstituicao) {
    let instrucao = `
            SELECT 
            fkMaquina,
            ROUND(MAX(ISNULL(CASE WHEN tipo = 'RAM' THEN consumo END, 0)), 2) AS maxConsumoRam,
            ROUND(MAX(ISNULL(CASE WHEN tipo = 'Processador' THEN consumo END, 0)), 2) AS maxConsumoProcessador
        FROM (
            SELECT 
                h.fkMaquina,
                h.consumo, 
                c.max AS maxConsumo, 
                th.tipo,
                RANK() OVER (PARTITION BY h.fkMaquina, th.tipo ORDER BY h.consumo DESC) AS rnk
            FROM 
                historico h
            JOIN componente c ON h.fkComponente = c.idComponente
            JOIN hardware hw ON c.fkHardware = hw.idHardware
            JOIN tipoHardware th ON hw.fkTipoHardware = th.idTipoHardware
            JOIN maquina m ON h.fkMaquina = m.idMaquina
            WHERE
                m.fkInstituicao = ${idInstituicao}
                AND DATEPART(WEEK, h.dataHora) = DATEPART(WEEK, GETDATE())  
                AND th.tipo IN ('RAM', 'Processador') -- Adicione esta condição
                AND h.consumo IS NOT NULL -- Adicione esta condição para garantir que consumo não seja nulo
        ) AS subconsulta
        WHERE rnk = 1
        GROUP BY fkMaquina;
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function maquinasMaisDefeitos(idInstituicao) {
    const instrucao = `
        SELECT
            m.idMaquina AS fkMaquina,
            m.nome AS nomeMaquina,
            COUNT(DISTINCT s.idStrike) AS quantidadeStrikes,
            COUNT(DISTINCT CASE WHEN h.consumo > 70 THEN h.idHistorico END) AS quantidadeAlertas,
            RANK() OVER (ORDER BY COUNT(DISTINCT CASE WHEN h.consumo > 80 THEN h.idHistorico END) DESC) AS ranking
        FROM
            maquina m
        LEFT JOIN strike s ON m.idMaquina = s.fkMaquina
        LEFT JOIN historico h ON m.idMaquina = h.fkMaquina
        WHERE
            m.fkInstituicao = ${idInstituicao}
            AND DATEPART(WEEK, h.dataHora) = DATEPART(WEEK, GETDATE())
        GROUP BY
            m.idMaquina, m.nome
        HAVING
            COUNT(DISTINCT s.idStrike) > 0 OR COUNT(DISTINCT CASE WHEN h.consumo > 70 THEN h.idHistorico END) > 0
        ORDER BY
            ranking;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}


function capturarStrikesPorMaquina(idInstituicao, idUsuario) {
    const instrucao = `
        SELECT
            m.idMaquina AS id,
            m.nome AS nome,
            COUNT(s.idStrike) AS qtdStrikes
        FROM maquina m
        LEFT JOIN historico h ON m.idMaquina = h.fkMaquina
        JOIN instituicao inst ON inst.idInstituicao = m.fkInstituicao
        JOIN usuario us ON us.fkInstituicao = inst.idInstituicao
        LEFT JOIN strike s ON s.fkMaquina = m.idMaquina AND s.fkSituacao IN (1, 3)
        WHERE inst.idInstituicao = ${idInstituicao} AND us.idUsuario = ${idUsuario}
        GROUP BY m.idMaquina, m.nome
        HAVING COUNT(s.idStrike) >= 3;
    `;

    console.log('strikes por maquina', instrucao);
    return database.executar(instrucao);
}

function capturarStrikesDaMaquina(idMaquina) {
    const instrucao = `
        SELECT FORMAT(dataHora, 'dd/MM/yy') AS data, FORMAT(dataHora, 'HH:mm:ss') AS hora
        FROM strike WHERE fkMaquina = ${idMaquina}
        ORDER BY dataHora DESC
        OFFSET 0 ROWS FETCH NEXT 1 ROW ONLY;
    `;

    console.log('strikes da maquina', instrucao);
    return database.executar(instrucao);
}

function capturarPermissoes(idUsuario) {
    const instrucao = `
        SELECT 
            atuacao.idAtuacao,
            atuacao.nome,
            atuacao.descricao,
            permissao.emUso
        FROM 
            permissao 
            JOIN usuario ON fkUsuario = idUsuario 
            JOIN atuacao ON fkAtuacao = idAtuacao
        WHERE idUsuario = ${idUsuario};
    `;

    return database.executar(instrucao);
}

module.exports = {
    capturarDadosMaquina,
    capturarTodosDadosMaquina,
    capturarTodasMaquinas,
    capturarConsumoRAM,
    capturarConsumoCPU,
    capturarConsumoDisco,
    capturarNovoDadoRAM,
    capturarNovoDadoDisco,
    capturarNovoDadoCPU,
    editarMaquina,
    deletarMaquina,
    maisUsoCpuRamKpi,
    maquinasMaisDefeitos,
    capturarPermissoes,
    capturarStrikesDaMaquina,
    capturarStrikesPorMaquina
};

