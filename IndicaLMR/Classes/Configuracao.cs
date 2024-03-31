using MySql.Data.MySqlClient;

namespace IndicaLMR.Classes
{
    public class Configuracao
    {
        private string chave, nome;
        private int valor;

        public string Chave { get { return chave; } set { chave = value; } }
        public string Nome { get { return nome; } set { nome = value; } }
        public int Valor { get {  return valor; } set {  valor = value; } }

        public Configuracao(string chave, string nome, int valor)
        {
            Chave = chave;
            Nome = nome;
            Valor = valor;
        }

        public static List<Configuracao> ListarConfiguracoes()
        {
            List<Configuracao> configuracoes = new List<Configuracao>();
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT * FROM configuracao", con);
                MySqlDataReader leitor = query.ExecuteReader();

                while (leitor.Read())
                {
                    if (leitor.HasRows)
                    {
                        Configuracao config = new Configuracao(
                            leitor["chave"].ToString(),
                            leitor["nome"].ToString(),
                            (int)leitor["valor"]
                            );

                        configuracoes.Add(config);
                    }
                }

                con.Close();
            }
            catch
            {
                configuracoes.Clear();
            }
            return configuracoes;

        }

        public static bool AtualizarValor(string chave, int valor)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE configuracao SET valor = @valor WHERE chave = @chave", con);
                query.Parameters.AddWithValue("@valor", valor);
                query.Parameters.AddWithValue("@chave", chave);

                query.ExecuteNonQuery();

                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static int ValorRealPonto()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT valor FROM configuracao WHERE chave = @chave", con);
                query.Parameters.AddWithValue("@chave", "convPontVal");

                int valor = (int) query.ExecuteScalar();

                con.Close();

                return valor;
            }
            catch
            {
                return 0;
            }
        }
    }
}
