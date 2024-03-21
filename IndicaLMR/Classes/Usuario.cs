using MySql.Data.MySqlClient;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace IndicaLMR.Classes
{
    public class Usuario
    {
        private int id;
        private string nome, email, senha;
        private bool administrador, financeiro;

        public int Id { get { return id; } set {  id = value; } }
        public string Nome { get { return nome; } set {  nome = value; } }
        public string Email { get { return email; } set {  email = value; } }
        public string Senha { get { return senha; } set {  senha = value; } }
        public bool Administrador { get { return administrador; } set { administrador = value; } }
        public bool Financeiro { get { return financeiro; } set { financeiro = value; } }

        [JsonConstructor]
        public Usuario(int id, string nome, string email, bool administrador, bool financeiro) {
            Id = id;
            Nome = nome;
            Email = email;
            Administrador = administrador;
            Financeiro = financeiro;
        }

        public Usuario(int id, string nome, string email, string senha, bool administrador, bool financeiro)
        {
            Id = id;
            Nome = nome;
            Email = email;
            Senha = senha;
            Administrador = administrador;
            Financeiro = financeiro;
        }

        public Usuario(string email, string senha)
        {
            Email = email;
            Senha = senha;
        }

        public bool CriarUsuario()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            var sha = SHA256.Create();
            var asByteArray = Encoding.Default.GetBytes(Senha);
            var hashedPassword = sha.ComputeHash(asByteArray);
            string senhaHash = Convert.ToBase64String(hashedPassword);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("INSERT INTO usuario VALUES(@id, @email, @senha, @nome, @admin, @financeiro)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@email", Email);
                query.Parameters.AddWithValue("@senha", senhaHash);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@admin", Administrador);
                query.Parameters.AddWithValue("@financeiro", Financeiro);

                query.ExecuteNonQuery();

                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static Usuario Autenticar(string email, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Usuario usuario = null;

            var sha = SHA256.Create();
            var asByteArray = Encoding.Default.GetBytes(senha);
            var hashedPassword = sha.ComputeHash(asByteArray);
            string senhaHash = Convert.ToBase64String(hashedPassword);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT id, nome, admin, financeiro FROM usuario WHERE email = @email AND senha = @senha", con);
                query.Parameters.AddWithValue("@email", email);
                query.Parameters.AddWithValue("@senha", senhaHash);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        usuario = new Usuario(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            email,
                            (bool)leitor["admin"],
                            (bool)leitor["financeiro"]
                            );
                    }
                }
                con.Close();
            }
            catch
            {
                usuario = null;
            }
            return usuario;
        }

        public Usuario AlterarUsuario(Usuario usuarioNovo)
        {
            Usuario usuario = null;
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                if (Email != usuarioNovo.Email && usuarioNovo.Email != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE usuario SET email = @email WHERE id = @id", con);
                    query.Parameters.AddWithValue("@email", usuarioNovo.Email);
                    query.Parameters.AddWithValue("@id", usuarioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (usuarioNovo.Senha != "")
                {
                    var sha = SHA256.Create();
                    var asByteArray = Encoding.Default.GetBytes(usuarioNovo.Senha);
                    var hashedPassword = sha.ComputeHash(asByteArray);
                    string senhaHash = Convert.ToBase64String(hashedPassword);

                    MySqlCommand query = new MySqlCommand("UPDATE usuario SET senha = @senha WHERE id = @id", con);
                    query.Parameters.AddWithValue("@senha", senhaHash);
                    query.Parameters.AddWithValue("@id", Id);
                    query.ExecuteNonQuery();
                }

                if (Nome != usuarioNovo.Nome && usuarioNovo.Nome != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE usuario SET nome = @nome WHERE id = @id", con);
                    query.Parameters.AddWithValue("@nome", usuarioNovo.Nome);
                    query.Parameters.AddWithValue("@id", usuarioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Administrador != usuarioNovo.Administrador)
                {
                    MySqlCommand query = new MySqlCommand("UPDATE usuario SET admin = @admin WHERE id = @id", con);
                    query.Parameters.AddWithValue("@admin", usuarioNovo.Administrador);
                    query.Parameters.AddWithValue("@id", usuarioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Financeiro != usuarioNovo.Financeiro)
                {
                    MySqlCommand query = new MySqlCommand("UPDATE usuario SET financero = @financeiro WHERE id = @id", con);
                    query.Parameters.AddWithValue("@financeiro", usuarioNovo.Financeiro);
                    query.Parameters.AddWithValue("@id", usuarioNovo.Id);
                    query.ExecuteNonQuery();
                }

                MySqlCommand queryBusca = new MySqlCommand("SELECT * FROM usuario", con);
                MySqlDataReader leitor = queryBusca.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        usuario = new Usuario(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            email,
                            (bool)leitor["admin"],
                            (bool)leitor["financeiro"]
                            );
                    }
                }

                con.Close();
                return usuario;
            }
            catch
            {
                return null;
            }
        }

        public static List<Usuario> ListarUsuarios()
        {
            List<Usuario> usuarios = new List<Usuario>();
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT id, email, nome, admin, financeiro FROM usuario", con);
                MySqlDataReader leitor = query.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        Usuario usuario = new Usuario(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["email"].ToString(),
                            (bool)leitor["admin"],
                            (bool)leitor["financeiro"]
                            );

                        usuarios.Add(usuario);
                    }
                }

                con.Close();
            }
            catch
            {
                usuarios.Clear();
            }
            return usuarios;
        }

        public static bool ExcluirUsuario(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("DELETE FROM usuario WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", id);

                query.ExecuteNonQuery();

                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
