const API_URL = 'http://localhost:3000/usuario';

class UsuarioService {
    static async criarUsuario(usuario) {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        return response.json();
    }

    static async obterUsuarios() {
        const response = await fetch(`${API_URL}`);
        return response.json();
    }

    static async obterUsuarioPorId(id) {
        const response = await fetch(`${API_URL}/${id}`);
        return response.json();
    }

    static async atualizarUsuario(id, usuario) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });
        return response.json();
    }

    static async deletarUsuario(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    }
}

export default UsuarioService;