var maquinaModel = require("../models/maquinaModel");

var sessoes = [];

function capturarDadosMaquina(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarDadosMaquina(idMaquina, idInstituicao)
        .then((response) => {
            res.json(response);
        })
        .catch((erro) => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarTodosDadosMaquina(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarTodosDadosMaquina(idMaquina, idMaquina)
        .then((response) => {
            res.json(response);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error.sqlMessage)
        })
}

function capturarTodasMaquinas(req, res) {
    let idInstituicao = req.body.idInstituicao;
    let ordAlfabetica = req.body.ordAlfabetica === 'ord_z_a' ? 'ORDER BY m.nome DESC' : 'ORDER BY m.nome';
    let qtdStrikes = req.body.qtdStrikes;
    let emUso = req.body.emUso;
    let estado = req.body.estado;
    let pesquisa = `AND m.nome LIKE '%${req.body.pesquisa}%'`;

    if(emUso) emUso = req.body.emUso == 'true' ? 'AND m.emUso = 1' : 'AND m.emUso = 0';

    switch(qtdStrikes) {
        case 'zero_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) = 0'
            break;
        case 'um_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) = 1'
            break;
        case 'um_ou_mais_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) >= 1'
            break;
        case 'dois_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) = 2'
            break;
        case 'dois_ou_mais_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) >= 2'
            break;
        case 'tres_stk':
            qtdStrikes = 'AND (SELECT COUNT(*) FROM strike WHERE fkMaquina = idMaquina AND fkSituacao IN(1, 3)) >= 3'
            break;
        default:
            qtdStrikes = '';
            break;
    }

    switch(estado) {
        case 'critico':
            estado = `AND (SELECT CASE WHEN MAX(h.consumo) >= 85 THEN 'Crítico' WHEN MAX(h.consumo) >= 70 THEN 'Alerta' ELSE 'Normal' END AS status FROM maquina ms LEFT JOIN historico h ON m.idMaquina = h.fkMaquina JOIN instituicao inst ON inst.idInstituicao = m.fkInstituicao WHERE idInstituicao = 1 AND ms.idMaquina = m.idMaquina GROUP BY m.idMaquina) LIKE 'Crítico'`;
           break;
        case 'alerta':
            estado = `AND (SELECT CASE WHEN MAX(h.consumo) >= 85 THEN 'Crítico' WHEN MAX(h.consumo) >= 70 THEN 'Alerta' ELSE 'Normal' END AS status FROM maquina ms LEFT JOIN historico h ON m.idMaquina = h.fkMaquina JOIN instituicao inst ON inst.idInstituicao = m.fkInstituicao WHERE idInstituicao = 1 AND ms.idMaquina = m.idMaquina GROUP BY m.idMaquina) LIKE 'Alerta'`;
            break;
        case 'normal':
            estado = `AND (SELECT CASE WHEN MAX(h.consumo) >= 85 THEN 'Crítico' WHEN MAX(h.consumo) >= 70 THEN 'Alerta' ELSE 'Normal' END AS status FROM maquina ms LEFT JOIN historico h ON m.idMaquina = h.fkMaquina JOIN instituicao inst ON inst.idInstituicao = m.fkInstituicao WHERE idInstituicao = 1 AND ms.idMaquina = m.idMaquina GROUP BY m.idMaquina) LIKE 'Normal'` 
            break;
        default:
            estado = '';
            break;
    }

    maquinaModel.capturarTodasMaquinas(idInstituicao, ordAlfabetica, qtdStrikes, emUso, estado, pesquisa)
    .then((response) => {
        res.json(response);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json(error.sqlMessage);
    });
}

function capturarConsumoRAM(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarConsumoRAM(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarConsumoCPU(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarConsumoCPU(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarConsumoDisco(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarConsumoDisco(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarNovoDadoRAM(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarNovoDadoRAM(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarNovoDadoCPU(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarNovoDadoCPU(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}

function capturarNovoDadoDisco(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idMaquina = req.params.idMaquina;

    if(idInstituicao == undefined) {
        console.log("idInstituicao está undefined");
    } else if(idMaquina == undefined) {
        console.log("idMaquina está undefined");
    }

    maquinaModel.capturarNovoDadoDisco(idMaquina, idInstituicao)
        .then(function (response) {
            res.json(response);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage)
        })
}


function editarMaquina(req, res) {
    var nomeMaquina = req.body.nomeMaquina;
    var SistemaOperacional = req.body.SistemaOperacional;

    if (nomeMaquina !== undefined) {
        maquinaModel.obterNomeMaquina()
            .then(function (valorAtual) {
                if (valorAtual !== nomeMaquina) {
                    // Atualizar o campo nomeMaquina
                    maquinaModel.editarNomeMaquina(nomeMaquina)
                        .then(function (resultado) {
                            res.json(resultado);
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                            res.status(500).json(erro.sqlMessage);
                        });
                } else {
                    res.json({ message: "O valor do campo nomeMaquina é o mesmo, nenhuma alteração foi feita." });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao obter o valor atual do campo nomeMaquina: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    } else if (SistemaOperacional !== undefined) {
        maquinaModel.obterSistemaOperacional()
            .then(function (valorAtual) {
                if (valorAtual !== SistemaOperacional) {
                    maquinaModel.editarSistemaOperacional(SistemaOperacional)
                        .then(function (resultado) {
                            res.json(resultado);
                        })
                        .catch(function (erro) {
                            console.log(erro);
                            console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                            res.status(500).json(erro.sqlMessage);
                        });
                } else {
                    res.json({ message: "O valor do campo SistemaOperacional é o mesmo, nenhuma alteração foi feita." });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao obter o valor atual do campo SistemaOperacional: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    } else {
        res.json({ message: "Nenhum campo foi atualizado." });
    }
}


function deletarMaquina(req, res) {
    var idMaquina = req.body.idMaquina;

    maquinaModel.deletarMaquina(idMaquina)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar a máquina: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}



function maisUsoCpuRamKpi(req, res) {
    var idInstituicao = req.params.idInstituicao;

    maquinaModel.maisUsoCpuRamKpi(idInstituicao)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function maquinasMaisDefeitos(req, res) {
    var idInstituicao = req.params.idInstituicao;

    maquinaModel.maquinasMaisDefeitos(idInstituicao)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function capturarStrikesPorMaquina(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let idUsuario = req.params.idUsuario;

    maquinaModel.capturarStrikesPorMaquina(idInstituicao, idUsuario)
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err);
            console.log(err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        })
}

function capturarStrikesDaMaquina(req, res) {
    let idMaquina = req.params.idMaquina;

    maquinaModel.capturarStrikesDaMaquina(idMaquina)
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err);
            console.log(err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        })
}

//trocar essa função para o model de permissoes quando tiver um 
function capturarPermissoes(req, res) {
    let idMaquina = req.params.idUsuario;
   
    maquinaModel.capturarPermissoes(idMaquina)
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err);
            console.log(err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        })
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
    capturarStrikesPorMaquina,
    capturarStrikesDaMaquina,
    capturarPermissoes
}