document.addEventListener('DOMContentLoaded', function () {
    carregarFeed(),
        filtrosTipo()
});


function buscarUsuario() {
    var nomeDigitado = input_busca.value
    var instituicao = localStorage.getItem("instituicao")

    if (nomeDigitado.length < 3) {
        carregarFeed()
    } else {
        fetch(`/usuarios/pesquisarUsuario/${nomeDigitado}/${instituicao}`)
            .then((usuarioBuscado => {
                if (usuarioBuscado.status == 204) {
                    var tableUsuarios = document.getElementById("listaDeUsuarios");
                    tableUsuarios.innerHTML = "<tr><td colspan='4'>Nenhum resultado encontrado.</td></tr>";
                } else {
                    usuarioBuscado.json().then(function (usuarioBuscado) {
                        var tableUsuarios = document.getElementById("listaDeUsuarios");
                        tableUsuarios.innerHTML = ""; // Limpar a tabela antes de preencher com os novos dados

                        console.log(usuarioBuscado)

                        for (var i = 0; i < usuarioBuscado.length; i++) {
                            var usuario = usuarioBuscado[i];

                            var linhaTable = document.createElement("tr");
                            var celulaNome = document.createElement("td");
                            var celulaEmail = document.createElement("td");
                            var celulaTipo = document.createElement("td");
                            var celulaBotoes = document.createElement("td");

                            celulaNome.textContent = usuario.nomeUsuario;
                            celulaEmail.textContent = usuario.email;
                            celulaTipo.textContent = usuario.nivPermissao;

                            // Adicione os botões com base no ID do usuário
                            celulaBotoes.innerHTML = `
                            <img src="../assets/img/Icone/deleteIcon.svg" class="tooltip" title="Excluir Escola">
                            <img src="../assets/img/Icone/editIcon.svg" class="tooltip" title="Editar Escola">
                            <img src="../assets/img/Icone/moreInfoIcon.svg" class="tooltip" title="Mais Informações">
                        `;


                            linhaTable.appendChild(celulaNome);
                            linhaTable.appendChild(celulaEmail);
                            linhaTable.appendChild(celulaTipo);
                            linhaTable.appendChild(celulaBotoes);

                            tableUsuarios.appendChild(linhaTable);
                        }
                    });
                }

            }))
    }
}



document.addEventListener('DOMContentLoaded', function () {
    const adicionarUsuarioButton = document.getElementById('adicionarUsuario');
    adicionarUsuarioButton.addEventListener('click', adicionarUsuario);
});

function adicionarUsuario() {
    let usuarioAdicionado = false; // Variável para rastrear se o usuário foi adicionado

    Swal.fire({
        title: 'Adicionar Usuário',
        html:
            '<input type="text" id="nomeInput" placeholder="Nome" class="swal2-input" style="border-radius: 15px;">' +
            '<input type="email" id="emailInput" placeholder="Email" class="swal2-input" style="border-radius: 15px;">' +
            '<input type="password" id="senhaInput" placeholder="Senha" class="swal2-input" style="border-radius: 15px;">' +
            '<select id="tipoInput" class="swal2-input" style="border-radius: 15px;">' +
            '<option value="1">ADM Nowl</option>' +
            '<option value="2">ADM da Instituição</option>' +
            '<option value="3">Professor</option>' +
            '</select>',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33', // Cor do botão "Cancelar"
        confirmButtonText: 'Adicionar Usuário',
        confirmButtonColor: '#28a745', // Cor do botão "Adicionar Usuário"
        showLoaderOnConfirm: true,
        customClass: {
            container: 'custom-modal',
            popup: 'custom-popup',
            closeButton: 'custom-close-button',
            confirmButton: 'custom-confirm-button',
            cancelButton: 'custom-cancel-button',
        },
        onOpen: () => {
            const customModal = Swal.getPopup();
            customModal.style.backgroundColor = 'white';
            customModal.style.width = '550px';
            customModal.style.borderRadius = '15px';
        },
        preConfirm: () => {
            // Validação dos campos
            const nomeInput = document.getElementById('nomeInput');
            const emailInput = document.getElementById('emailInput');
            const senhaInput = document.getElementById('senhaInput');
            const tipoInput = document.getElementById('tipoInput');

            const nome = nomeInput.value;
            const email = emailInput.value;
            const senha = senhaInput.value;
            const tipo = tipoInput.value;

            // Função para definir o estilo dos inputs
            function setFieldStyle(input, isValid) {
                if (isValid) {
                    input.style.borderColor = '#4CAF50'; // Borda verde para campos válidos
                } else {
                    input.style.borderColor = '#FF5555'; // Borda vermelha para campos inválidos
                }
            }

            // Validação do campo Nome
            if (nome.length < 3) {
                setFieldStyle(nomeInput, false);
                Swal.showValidationMessage('O nome deve ter pelo menos 3 caracteres.');
                return false;
            } else {
                setFieldStyle(nomeInput, true);
            }

            // Validação do campo Email
            if (!email.includes('@')) {
                setFieldStyle(emailInput, false);
                Swal.showValidationMessage('O email deve conter o símbolo "@".');
                return false;
            } else {
                setFieldStyle(emailInput, true);
            }

            // Validação do campo Senha
            if (senha.length < 5) {
                setFieldStyle(senhaInput, false);
                Swal.showValidationMessage('A senha deve ter pelo menos 5 caracteres.');
                return false;
            } else {
                setFieldStyle(senhaInput, true);
            }

            // Validação do campo Tipo
            if (tipo !== '1' && tipo !== '2' && tipo !== '3') {
                setFieldStyle(tipoInput, false);
                Swal.showValidationMessage('O tipo só pode ser 1, 2 ou 3.');
                return false;
            } else {
                setFieldStyle(tipoInput, true);
            }

            // Simule a adição de um usuário (substitua isso com sua lógica real)
            return new Promise((resolve) => {
                fetch("/usuarios/cadastrarNaDash", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        nomeUsuario: nome,
                        emailUsuario: email,
                        senhaUsuario: senha,
                        nivPermissao: tipo,
                        instituicao: localStorage.getItem("instituicao")
                    })
                })
                    // .then(async (response) => {
                    //     if (!response.ok) {
                    //         throw new Error('Erro ao cadastrar usuário'); // Lança um erro para cair no catch
                    //     }
                    //     return await response.json(); // Retorna a resposta JSON se estiver tudo OK
                    //     })
                    .then(() => {
                        usuarioAdicionado = true; // Define a variável como true quando o usuário é adicionado
                        resolve(); // Resolve a Promise após a adição do usuário
                    })
                    .catch((error) => {
                        console.log(error);
                        console.log("Houve um erro ao tentar cadastrar o usuário");
                    });
            });
        },
    })
        .then((result) => {
            if (result.isConfirmed && usuarioAdicionado) {
                sessionStorage.clear();

                Swal.fire({
                    icon: 'success',
                    title: 'O usuário foi cadastrado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });

                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        })
        .catch(() => {
            // Não faça nada se o usuário fechar o modal ou se houver um erro
        });
}


function filtrosTipo() {
    fetch(`/usuarios/qtdTotal/${localStorage.getItem("instituicao")}`)
        .then((qtdTotal) => {
            if (qtdTotal.ok) {
                fetch(`/usuarios/qtdAdministrador/${localStorage.getItem("instituicao")}`)
                    .then((qtdTotalAdm) => {
                        fetch(`/usuarios/qtdInstrutor/${localStorage.getItem("instituicao")}`)
                            .then((qtdTotalInstrutor) => {
                                if (qtdTotalInstrutor.ok) {
                                    qtdTotal.json().then((qtdTotal) => {
                                        qtdTotalAdm.json().then((qtdTotalAdm) => {
                                            qtdTotalInstrutor.json().then((qtdTotalInstrutor) => {
                                                var orderOptions = document.getElementById("orderOptions")

                                                var spanTotal = document.createElement("span")
                                                var spanTotalAdministrador = document.createElement("span")
                                                var spanTotalInstrutor = document.createElement("span")

                                                spanTotal.textContent = `Total (${qtdTotal[0].qtdTotal})`
                                                spanTotalAdministrador.textContent = `Administradores (${qtdTotalAdm[0].qtdTotal})`
                                                spanTotalInstrutor.textContent = `Instrutor (${qtdTotalInstrutor[0].qtdTotal})`

                                                spanTotal.onclick = carregarFeed
                                                spanTotalAdministrador.onclick = carregarFeedAdm
                                                spanTotalInstrutor.onclick = carregarFeedInstrutor

                                                orderOptions.appendChild(spanTotal)
                                                orderOptions.appendChild(spanTotalAdministrador)
                                                orderOptions.appendChild(spanTotalInstrutor)


                                            })
                                        })
                                    })

                                }
                            })
                    })
            }
        })
}

function carregarFeed() {
    var codInstituicao = localStorage.getItem("instituicao");
    fetch(`/usuarios/listar/${codInstituicao}`)
        .then(function (listaUsuarios) {
            if (listaUsuarios.ok) {
                if (listaUsuarios.status == 204) {
                    var tableUsuarios = document.getElementById("listaDeUsuarios");
                    tableUsuarios.innerHTML = "<tr><td colspan='4'>Nenhum resultado encontrado.</td></tr>";
                } else {
                    listaUsuarios.json().then(function (listaUsuarios) {
                        var tableUsuarios = document.getElementById("listaDeUsuarios");
                        tableUsuarios.innerHTML = ""; // Limpar a tabela antes de preencher com os novos dados

                        for (var i = 0; i < listaUsuarios.length; i++) {
                            var usuario = listaUsuarios[i];

                            var linhaTable = document.createElement("tr");
                            linhaTable.setAttribute('id', `usuario_${usuario.idUsuario}`)

                            var celulaNome = document.createElement("td");
                            var celulaEmail = document.createElement("td");
                            var celulaTipo = document.createElement("td");
                            var celulaBotoes = document.createElement("td");

                            celulaNome.textContent = usuario.nomeUsuario;
                            celulaEmail.textContent = usuario.email;
                            celulaTipo.textContent = getTipoUsuarioText(usuario.nivPermissao);

                            celulaBotoes.innerHTML = `
                                <img src="../assets/img/Icone/deleteIcon.svg" class="tooltip" title="Excluir Usuário" id="btn_delete${usuario.idUsuario}" onclick="deletar(${usuario.idUsuario}, ${localStorage.getItem("nivPerm")})">
                                <img src="../assets/img/Icone/editIcon.svg" class="tooltip" title="Editar Usuário" id="btn_update${usuario.idUsuario}" onclick="alterar(${usuario.idUsuario})">
                                <img src="../assets/img/Icone/moreInfoIcon.svg" class="tooltip" title="Mais Informações" id="btn_get${usuario.idUsuario}" onclick="mostrar_dados(${usuario.idUsuario})">
                            `;

                            linhaTable.appendChild(celulaNome);
                            linhaTable.appendChild(celulaEmail);
                            linhaTable.appendChild(celulaTipo);
                            linhaTable.appendChild(celulaBotoes);

                            tableUsuarios.appendChild(linhaTable);
                        }
                    });
                }
            } else {
                throw ('Houve um erro na API!');
            }
        })
        .catch(function (resposta) {
            console.error(resposta);
        });
}

function getTipoUsuarioText(tipoUsuario) {
    switch (tipoUsuario) {
        case 1:
            return "ADM Nowl";
        case 2:
            return "ADM da Instituição";
        case 3:
            return "Professor";
        default:
            return "Desconhecido";
    }
}

// Chame a função para carregar a tabela de usuários
document.addEventListener("DOMContentLoaded", function () {
    carregarFeed();
    tippy(".tooltip", {
        placement: "top",
    });
});

function carregarFeedAdm() {
    var codInstituicao = localStorage.getItem("instituicao");

    fetch(`/usuarios/listarAdm/${codInstituicao}`)
        .then(function (listaUsuarios) {
            if (listaUsuarios.ok) {
                if (listaUsuarios.status == 204) {
                    var tableUsuarios = document.getElementById("listaDeUsuarios");
                    tableUsuarios.innerHTML = "<tr><td colspan='4'>Nenhum resultado encontrado.</td></tr>";
                } else {
                    listaUsuarios.json().then(function (listaUsuarios) {
                        var tableUsuarios = document.getElementById("listaDeUsuarios");
                        tableUsuarios.innerHTML = "";

                        for (var i = 0; i < listaUsuarios.length; i++) {
                            var usuario = listaUsuarios[i];

                            var linhaTable = document.createElement("tr");
                            var celulaNome = document.createElement("td");
                            var celulaEmail = document.createElement("td");
                            var celulaTipo = document.createElement("td");
                            var celulaBotoes = document.createElement("td");

                            celulaNome.textContent = usuario.nomeUsuario;
                            celulaEmail.textContent = usuario.email;
                            celulaTipo.textContent = getTipoUsuarioText(usuario.nivPermissao);

                            celulaBotoes.innerHTML = `
                                <img src="../assets/img/Icone/deleteIcon.svg" class="tooltip" title="Excluir Usuário" id="btn_delete${usuario.idUsuario}" onclick="deletar(${usuario.idUsuario}, ${localStorage.getItem("nivPerm")})">
                                <img src="../assets/img/Icone/editIcon.svg" class="tooltip" title="Editar Usuário" id="btn_update${usuario.idUsuario}" onclick="alterar(${usuario.idUsuario})">
                                <img src="../assets/img/Icone/moreInfoIcon.svg" class="tooltip" title="Mais Informações" id="btn_get${usuario.idUsuario}" onclick="mostrar_dados(${usuario.idUsuario})">
                            `;

                            linhaTable.appendChild(celulaNome);
                            linhaTable.appendChild(celulaEmail);
                            linhaTable.appendChild(celulaTipo);
                            linhaTable.appendChild(celulaBotoes);

                            tableUsuarios.appendChild(linhaTable);
                        }
                    });
                }
            } else {
                throw ('Houve um erro na API!');
            }
        })
        .catch(function (resposta) {
            console.error(resposta);
        });
}

function carregarFeedInstrutor() {
    var codInstituicao = localStorage.getItem("instituicao");

    fetch(`/usuarios/listarInstrutor/${codInstituicao}`)
        .then(function (listaUsuarios) {
            if (listaUsuarios.ok) {
                if (listaUsuarios.status == 204) {
                    var tableUsuarios = document.getElementById("listaDeUsuarios");
                    tableUsuarios.innerHTML = "<tr><td colspan='4'>Nenhum resultado encontrado.</td></tr>";
                } else {
                    listaUsuarios.json().then(function (listaUsuarios) {
                        var tableUsuarios = document.getElementById("listaDeUsuarios");
                        tableUsuarios.innerHTML = "";

                        for (var i = 0; i < listaUsuarios.length; i++) {
                            var usuario = listaUsuarios[i];

                            var linhaTable = document.createElement("tr");
                            var celulaNome = document.createElement("td");
                            var celulaEmail = document.createElement("td");
                            var celulaTipo = document.createElement("td");
                            var celulaBotoes = document.createElement("td");

                            celulaNome.textContent = usuario.nomeUsuario;
                            celulaEmail.textContent = usuario.email;
                            celulaTipo.textContent = getTipoUsuarioText(usuario.nivPermissao);

                            celulaBotoes.innerHTML = `
                                <img src="../assets/img/Icone/deleteIcon.svg" class="tooltip delete-action" title="Excluir Usuário"  id="btn_delete${usuario.idUsuario}" onclick="deletar(${usuario.idUsuario}, ${localStorage.getItem("nivPerm")})">
                                <img src="../assets/img/Icone/editIcon.svg"  class="tooltip edit-action" title="Editar Usuário"  id="btn_update${usuario.idUsuario}" onclick="alterar(${usuario.idUsuario})">
                                <img src="../assets/img/Icone/moreInfoIcon.svg"  class="tooltip info-action" title="Mais Informações"  id="btn_get${usuario.idUsuario}" onclick="mostrar_dados(${usuario.idUsuario})">
                            `;

                            linhaTable.appendChild(celulaNome);
                            linhaTable.appendChild(celulaEmail);
                            linhaTable.appendChild(celulaTipo);
                            linhaTable.appendChild(celulaBotoes);

                            tableUsuarios.appendChild(linhaTable);
                        }
                    });
                }
            } else {
                throw ('Houve um erro na API!');
            }
        })
        .catch(function (resposta) {
            console.error(resposta);
        });
}

// Adicione essa função para obter o texto do tipo de usuário com base no valor numérico
function getTipoUsuarioText(tipoUsuario) {
    switch (tipoUsuario) {
        case 1:
            return "Administrador Nowl";
        case 2:
            return "Administrador Instituição";
        case 3:
            return "Professor Instituição";
        default:
            return "Desconhecido";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    carregarFeedAdm();
    carregarFeedInstrutor();
    tippy(".tooltip", {
        placement: "top",
    });
});


function mostrar_dados(idUsuario) {
    fetch(`/usuarios/mostrar_dados/${idUsuario}`)
        .then(function (response) {
            if (!response.ok) {
                console.error('Erro na resposta da API:', response.status);
                return;
            }
            return response.json();
        })
        .then(function (dadosUsuario) {
            if (dadosUsuario && dadosUsuario.length > 0) {
                const usuario = dadosUsuario[0];
                console.log("Dados recebidos dos usuários: ", JSON.stringify(usuario));

                Swal.fire({
                    title: 'Dados do Cliente',
                    html: `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                            <span><b>Nome:</b> ${usuario.nome}</span>
                            <span><b>Email:</b> ${usuario.email}</span>
                            <span><b>Senha:</b> ${usuario.senha}</span>
                            ${getTipoUsuarioMessage(usuario.fkTipoUsuario)}
                        </div>`,
                    showCloseButton: true, // botão de fechar
                    customClass: {
                        container: 'custom-modal', // modal
                        popup: 'custom-popup', // conteúdo do modal
                        closeButton: 'custom-close-button', // botão de fechar
                    },
                });
            } else {
                console.error('Dados do usuário não encontrados na resposta da API.');
            }
        })
        .catch(function (erro) {
            console.error('Erro na requisição:', erro);
        });
}

function getTipoUsuarioMessage(tipoUsuario) {
    if (tipoUsuario == 1) {
        return '<span><b>Tipo de Usuário:</b> ADM Nowl</span>';
    } else if (tipoUsuario == 2) {
        return '<span><b>Tipo de Usuário:</b> ADM da instituição</span>';
    } else if (tipoUsuario == 3) {
        return '<span><b>Tipo de Usuário:</b> Professor</span>';
    } else {
        return '<span><b>Tipo de Usuário:</b> Desconhecido</span>';
    }
}

// Exemplo de uso:
// Supondo que você tenha uma chamada de API ou algo parecido para obter os dados do usuário
// Vamos assumir que 'dadosDaAPI' contém os dados do usuário.
const dadosDaAPI = {
    nome: 'Nome do Usuário',
    email: 'usuario@email.com',
    senha: 'senha123',
    fkTipoUsuario: 2, // Altere este valor para testar diferentes tipos de usuário
};

mostrar_dados(dadosDaAPI);



function deletar(idUsuario, tipoPermissao) {
    if (tipoPermissao === "0") {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Você não possui permissão para deletar',
            customClass: {
                confirmButton: 'swal2-button-custom'
            }
        });
        return false;
    } else {
        Swal.fire({
            title: 'Você tem certeza que deseja deletar?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Deletar',
            denyButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            denyButtonColor: '#3085d6',
            icon: 'warning',
            customClass: {
                confirmButton: 'swal2-button-custom',
                popup: 'swal2-popup-custom'
            },
            width: '500px',  // Aumentei a largura 
            heightAuto: false,
            customHeight: '700px' // Aumento a altura
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/usuarios/deletar/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idUsuarioPE: idUsuario
                    })
                }).then(function (resposta) {
                    if (resposta.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuário deletado com sucesso!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        //  recarrega a página 
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Falha ao deletar o usuário',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }).catch(function (resposta) {
                    console.log(resposta);
                });
            }
        });
    }
}







function testar() {
    aguardar();

    var formulario = new URLSearchParams(new FormData(document.getElementById("form_postagem")));

    var divResultado = document.getElementById("div_feed");

    divResultado.appendChild(document.createTextNode(formulario.get("descricao")));
    divResultado.innerHTML = formulario.get("descricao");



    return false;
}

function alterar(idUsuario) {
    fetch(`/usuarios/listarPorUsuario/${idUsuario}`)
        .then((dadosUsuario) => {
            if (dadosUsuario.ok) {
                dadosUsuario.json().then((dadosUsuario) => {
                    // Verifique se todos os campos estão vazios
                    if (
                        dadosUsuario[0].nome === "" &&
                        dadosUsuario[0].email === "" &&
                        dadosUsuario[0].senha === "" &&
                        dadosUsuario[0].nivPermissao === ""
                    ) {
                        Swal.fire("Atenção", "Todos os campos estão vazios. Não é possível editar.", "warning");
                        return;
                    }

                    Swal.fire({
                        title: 'Editar Usuário',
                        html:
                            `<input type="text" id="nomeInput" placeholder="Nome" value="${dadosUsuario[0].nome}" class="swal2-input" style="border-radius: 15px;">
                            <input type="email" id="emailInput" placeholder="Email" value="${dadosUsuario[0].email}" class="swal2-input" style="border-radius: 15px;">
                            <input type="password" id="senhaInput" placeholder="Senha" value="${dadosUsuario[0].senha}" class="swal2-input" style="border-radius: 15px;">
                            <select id="tipoInput" class="swal2-input" style="border-radius: 15px;">
                                <option value="1" ${dadosUsuario[0].nivPermissao === '1' ? 'selected' : ''}>Adminstrador Nowl</option>
                                <option value="2" ${dadosUsuario[0].nivPermissao === '2' ? 'selected' : ''}>Admnistrador da instituição</option>
                                <option value="3" ${dadosUsuario[0].nivPermissao === '3' ? 'selected' : ''}>Professor</option>
                            </select>`,
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Salvar Usuário',
                        cancelButtonColor: '#d33', // Cor do botão "Cancelar" 
                        confirmButtonColor: '#28a745', // Cor do botão "Salvar Usuário" 
                        showCloseButton: true, // botão de fechar
                        customClass: {
                            container: 'custom-modal',
                            popup: 'custom-popup',
                            closeButton: 'custom-close-button',
                            confirmButton: 'custom-confirm-button',
                            cancelButton: 'custom-cancel-button',
                        },
                        onOpen: () => {
                            const customModal = Swal.getPopup();
                            customModal.style.backgroundColor = 'white';
                            customModal.style.width = '500px';
                            customModal.style.borderRadius = '15px';
                        },
                        onBeforeOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            const cancelButton = Swal.getCancelButton();
                            if (confirmButton && cancelButton) {
                                confirmButton.style.borderRadius = '15px';

                                cancelButton.style.borderRadius = '15px';
                            }

                            confirmButton.addEventListener('click', () => {
                                const nomeInput = document.getElementById('nomeInput').value;
                                const emailInput = document.getElementById('emailInput').value;
                                const senhaInput = document.getElementById('senhaInput').value;
                                const tipoInput = document.getElementById('tipoInput').value;

                                // Função para definir o estilo dos inputs
                                function setFieldStyle(input, isValid) {
                                    if (isValid) {
                                        input.style.borderColor = '#4CAF50';
                                    } else {
                                        input.style.borderColor = '#FF5555';
                                    }
                                }

                                // Validação dos campos
                                if (nomeInput.length < 3) {
                                    setFieldStyle(document.getElementById('nomeInput'), false);
                                    Swal.showValidationMessage('O nome deve ter pelo menos 3 caracteres.');
                                    return false;
                                } else {
                                    setFieldStyle(document.getElementById('nomeInput'), true);
                                }

                                if (!emailInput.includes('@')) {
                                    setFieldStyle(document.getElementById('emailInput'), false);
                                    Swal.showValidationMessage('O email deve conter o símbolo "@".');
                                    return false;
                                } else {
                                    setFieldStyle(document.getElementById('emailInput'), true);
                                }

                                if (senhaInput.length < 5) {
                                    setFieldStyle(document.getElementById('senhaInput'), false);
                                    Swal.showValidationMessage('A senha deve ter pelo menos 5 caracteres.');
                                    return false;
                                } else {
                                    setFieldStyle(document.getElementById('senhaInput'), true);
                                }

                                // A validação para 'tipoInput' não é mais necessária

                                fetch("/usuarios/editar", {
                                    method: "put",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        nomeUsuario: nomeInput,
                                        emailUsuario: emailInput,
                                        senhaUsuario: senhaInput,
                                        nivPermissao: tipoInput,
                                        idUsuario: idUsuario
                                    })
                                })
                                    .then(async function (response) {
                                        if (response.ok) {
                                            console.log(response);
                                            var retorno = await response.json();
                                            console.log(retorno);
                                            return retorno;
                                        }
                                    })
                                    .then(result => {
                                        if (result) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Sucesso!',
                                                text: 'Usuário atualizado com sucesso!',
                                                showConfirmButton: false,
                                                timer: 1500 // Fecha o pop-up após 1,5 segundos
                                            });
                                            setTimeout(() => {
                                                location.reload();
                                            }, 1500);
                                        } else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Falha!',
                                                text: 'Falha ao editar usuário',
                                            });
                                        }
                                    });
                            });
                        },
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Falha!',
                    text: 'Falha ao editar usuário',
                });
            }
        });
}
