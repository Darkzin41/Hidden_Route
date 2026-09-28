import UsuarioService from './UsuarioService';

const service = new UsuarioService();

UsuarioService.obterUsuarios().then(users => {
  const userList = document.createElement('ul');
  users.forEach(user => {
    const listItem = document.createElement('li');
    listItem.textContent = user.nome;
    userList.appendChild(listItem);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      UsuarioService.deletarUsuario(user.id).then(() => {
        listItem.remove();
      }).catch(error => {
        console.error('Erro ao deletar usuário:', error);
      });
    };
    listItem.appendChild(deleteButton);
  });
  document.body.appendChild(userList);
}).catch(error => {
  document.body.append(document.createTextNode(error));
});

function handleCadastrarClick() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  alert(`Cadastrando usuário: ${nome}, Email: ${email}`);
}

const userList = document.createElement('ul');
const buttonCadastrar = document.getElementById('btnCadastrar');
buttonCadastrar.addEventListener('click', handleCadastrarClick());

document.body.appendChild(userList);