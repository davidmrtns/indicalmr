using MySql.Data.MySqlClient;

namespace IndicaLMR.Classes
{
    public class Premio
    {
        private int id, valor;
        private string nome, descricao, imagem;
        private bool disponivel;

        public int Id { get { return id; } set {  id = value; } }
        public int Valor { get { return valor; } set {  valor = value; } }
        public string Nome { get {  return nome; } set {  nome = value; } }
        public string Descricao { get {  return descricao; } set {  descricao = value; } }
        public string Imagem { get {  return imagem; } set {  imagem = value; } }
        public bool Disponivel { get {  return disponivel; } set {  disponivel = value; } }

        public Premio(int id, string nome, string descricao, int valor, string imagem, bool disponivel)
        {
            Id = id;
            Nome = nome;
            Descricao = descricao;
            Valor = valor;
            Imagem = imagem;
            Disponivel = disponivel;
        }

        public bool CriarPremio()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("INSERT INTO premio VALUES(@id, @nome, @valor, @descricao, @imagem, @disponivel)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@valor", Valor);
                query.Parameters.AddWithValue("@descricao", Descricao);
                query.Parameters.AddWithValue("@imagem", Imagem);
                query.Parameters.AddWithValue("@disponivel", Disponivel);

                query.ExecuteNonQuery();

                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public Premio AlterarPremio(Premio premioNovo)
        {
            Premio premio = null;
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                if (Nome != premioNovo.Nome && premioNovo.Nome != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE premio SET nome = @nome WHERE id = @id", con);
                    query.Parameters.AddWithValue("@nome", premioNovo.Nome);
                    query.Parameters.AddWithValue("@id", premioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Valor != premioNovo.Valor && premioNovo.Valor > 0)
                {
                    MySqlCommand query = new MySqlCommand("UPDATE premio SET valor = @valor WHERE id = @id", con);
                    query.Parameters.AddWithValue("@valor", premioNovo.Valor);
                    query.Parameters.AddWithValue("@id", premioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Descricao != premioNovo.Descricao && premioNovo.Descricao != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE premio SET descricao = @descricao WHERE id = @id", con);
                    query.Parameters.AddWithValue("@descricao", premioNovo.Descricao);
                    query.Parameters.AddWithValue("@id", premioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Imagem != premioNovo.Imagem && premioNovo.Imagem != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE premio SET imagem = @imagem WHERE id = @id", con);
                    query.Parameters.AddWithValue("@imagem", premioNovo.Imagem);
                    query.Parameters.AddWithValue("@id", premioNovo.Id);
                    query.ExecuteNonQuery();
                }

                if (Disponivel != premioNovo.Disponivel)
                {
                    MySqlCommand query = new MySqlCommand("UPDATE premio SET disponivel = @disponivel WHERE id = @id", con);
                    query.Parameters.AddWithValue("@disponivel", premioNovo.Disponivel);
                    query.Parameters.AddWithValue("@id", premioNovo.Id);
                    query.ExecuteNonQuery();
                }

                MySqlCommand queryBusca = new MySqlCommand("SELECT * FROM premio", con);
                MySqlDataReader leitor = queryBusca.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        premio = new Premio(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["descricao"].ToString(),
                            (int)leitor["valor"],
                            leitor["imagem"].ToString(),
                            (bool)leitor["disponivel"]
                            );
                    }
                }

                con.Close();
                return premio;
            }
            catch
            {
                return null;
            }
        }

        public static List<Premio> ListarPremios()
        {
            List<Premio> premios = new List<Premio>();
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT * FROM premio", con);
                MySqlDataReader leitor = query.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        Premio premio = new Premio(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["descricao"].ToString(),
                            (int)leitor["valor"],
                            leitor["imagem"].ToString(),
                            (bool)leitor["disponivel"]
                            );

                        premios.Add(premio);
                    }
                }

                con.Close();
            }
            catch
            {
                premios.Clear();
            }
            return premios;
        }

        public static List<Premio> ListarPremiosDisponiveis()
        {
            List<Premio> premios = new List<Premio>();
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT * FROM premio WHERE disponivel = true", con);
                MySqlDataReader leitor = query.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        Premio premio = new Premio(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["descricao"].ToString(),
                            (int)leitor["valor"],
                            leitor["imagem"].ToString(),
                            (bool)leitor["disponivel"]
                            );

                        premios.Add(premio);
                    }
                }

                con.Close();
            }
            catch
            {
                premios.Clear();
            }
            return premios;
        }

        public static int BuscarValor(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT valor FROM premio WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", id);

                int valor = (int) query.ExecuteScalar();

                con.Close();

                return valor;
            }
            catch
            {
                return 0;
            }
        }

        public static bool ExcluirPremio(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("DELETE FROM premio WHERE id = @id", con);
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
