using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace IndicaLMR.Classes
{
    public class Parceiro
    {
        private string nome, telefone, cpf, senha;
        private int id, credito;
        private bool fechou;

        public int Id { get { return id; } set {  id = value; } }
        public string Nome { get { return nome; } set {  nome = value.ToUpper(); } }
        public string Telefone { get { return telefone; } set { telefone = value; } }
        public string Cpf { get { return cpf; } set { cpf = value; } }
        public string Senha { get { return senha; } set { senha = value; } }
        public int Credito { get { return credito; } set { credito = value; } }
        public bool Fechou { get { return fechou; } set { fechou = value; } }

        [JsonConstructor]
        public Parceiro() { }
        public Parceiro(string telefone, string nome)
        {
            Id = 0;
            Telefone = telefone;
            Nome = nome;
            Credito = 0;
            Fechou = false;
        }
        public Parceiro(string nome, string telefone, bool fechou)
        {
            Nome = nome;
            Telefone = telefone;
            Fechou = fechou;
        }
        public Parceiro(string nome, string telefone, string senha)
        {
            Nome = nome;
            Telefone = telefone;
            Senha = senha;
        }
        public Parceiro(int id, string nome, string telefone, string cpf)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
        }
        public Parceiro(string nome, string telefone, string cpf, string senha)
        {
            Id = 0;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Senha = senha;
            Credito = 0;
            Fechou = false;
        }

        private Parceiro(int id, string nome, string telefone, string cpf, int credito, bool fechou)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Credito = credito;
            Fechou = fechou;
        }

        public bool CadastrarParceiro()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            var sha = SHA256.Create();
            var asByteArray = Encoding.Default.GetBytes(Senha);
            var hashedPassword = sha.ComputeHash(asByteArray);
            string senhaHash = Convert.ToBase64String(hashedPassword);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("INSERT INTO parceiro VALUES(@id, @nome, @telefone, @cpf, @credito, @fechou, @senha)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@telefone", Telefone);
                query.Parameters.AddWithValue("@cpf", Cpf);
                query.Parameters.AddWithValue("@credito", Credito);
                query.Parameters.AddWithValue("@fechou", Fechou);
                query.Parameters.AddWithValue("@senha", senhaHash);

                query.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public long CadastrarParceiroIndicado()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("INSERT INTO parceiro VALUES(@id, @nome, @telefone, @cpf, @credito, @fechou, @senha)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@telefone", Telefone);
                query.Parameters.AddWithValue("@cpf", null);
                query.Parameters.AddWithValue("@credito", Credito);
                query.Parameters.AddWithValue("@fechou", Fechou);
                query.Parameters.AddWithValue("@senha", null);

                query.ExecuteNonQuery();
                long id = query.LastInsertedId;

                con.Close();

                return id;
            }
            catch
            {
                return 0;
            }
        }

        public static Parceiro BuscarParceiro(string cpf)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Parceiro parceiro = null;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT * FROM parceiro WHERE cpf = @cpf", con);
                query.Parameters.AddWithValue("@cpf", cpf);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        parceiro = new Parceiro(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["telefone"].ToString(),
                            leitor["cpf"].ToString(),
                            (int)leitor["credito"],
                            (bool)leitor["fechou"]
                            );
                    }
                }

                con.Close();
            }
            catch
            {
                parceiro = null;
            }
            return parceiro;
        }

        public static Parceiro BuscarParceiro(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Parceiro parceiro = null;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT nome, telefone, fechou FROM parceiro WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", id);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        parceiro = new Parceiro(
                            leitor["nome"].ToString(),
                            leitor["telefone"].ToString(),
                            (bool)leitor["fechou"]
                            );
                    }
                }

                con.Close();
            }
            catch
            {
                parceiro = null;
            }
            return parceiro;
        }

        public static List<Parceiro> ListarParceiros(string nome, string cpf, int pagina, int tamanhoPagina)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Parceiro> parceiros = new List<Parceiro>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                string filtro = "";

                if (nome != null)
                {
                    nome += "%";
                    filtro += "WHERE nome LIKE @nome";
                }

                if (cpf != null)
                {
                    if (nome != null)
                    {
                        filtro += " AND cpf = @cpf";
                    }
                    else
                    {
                        filtro += "WHERE cpf = @cpf";
                    }
                }

                MySqlCommand query = new MySqlCommand(string.Format("SELECT id, nome, telefone, cpf FROM parceiro {0} LIMIT @tamanhoPagina OFFSET @offset", filtro), con);
                query.Parameters.AddWithValue("@nome", nome);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina);
                query.Parameters.AddWithValue("@offset", offset);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Parceiro parceiro = new(
                            (int)leitor["id"],
                            leitor["nome"].ToString(),
                            leitor["telefone"].ToString(),
                            leitor["cpf"].ToString()
                            );
                        parceiros.Add(parceiro);
                    }
                }
                else
                {
                    parceiros.Clear();
                }

                con.Close();
            }
            catch
            {
                parceiros.Clear();
            }
            return parceiros;
        }

        public static List<Parceiro> ListarIndicacoes(int parceiro, int pagina, int tamanhoPagina)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Parceiro> indicacoes = new List<Parceiro>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT indicado FROM indicacao WHERE parceiro = @parceiro LIMIT @tamanhoPagina OFFSET @offset", con);
                query.Parameters.AddWithValue("@parceiro", parceiro);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina);
                query.Parameters.AddWithValue("@offset", offset);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Parceiro indicacao = Parceiro.BuscarParceiro((int)leitor["indicado"]);
                        indicacoes.Add(indicacao);
                    }
                }
                else
                {
                    indicacoes.Clear();
                }

                con.Close();
            }
            catch
            {
                indicacoes.Clear();
            }
            return indicacoes;
        }

        public static bool MudarStatus(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT fechou FROM parceiro WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", id);
                bool statusFechou = Convert.ToBoolean(query.ExecuteScalar());

                query.CommandText = "UPDATE parceiro SET fechou = true WHERE id = @id";

                query.ExecuteNonQuery();

                if (statusFechou == false)
                {
                    query.CommandText = "UPDATE parceiro p INNER JOIN indicacao i ON p.id = i.parceiro SET p.credito = p.credito + (SELECT valor FROM configuracao WHERE chave = 'valorInd') WHERE i.indicado = @id";
                    query.ExecuteNonQuery();
                }

                con.Close();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool MudarStatusCpfTelefone(string dado, int tipo)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                string filtro;

                if (tipo == 0)
                {
                    filtro = "cpf = @cpf";
                }
                else
                {
                    filtro = "telefone = @telefone";
                }

                MySqlCommand query = new MySqlCommand(string.Format("SELECT id FROM parceiro WHERE {0}", filtro), con);
                query.Parameters.AddWithValue("@cpf", dado);
                query.Parameters.AddWithValue("@telefone", dado);
                int id = (int) query.ExecuteScalar();

                con.Close();
                return MudarStatus(id);
            }
            catch
            {
                return false;
            }
        }

        public static bool AtualizarDados(int id, string cpf, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                var sha = SHA256.Create();
                var asByteArray = Encoding.Default.GetBytes(senha);
                var hashedPassword = sha.ComputeHash(asByteArray);
                string senhaHash = Convert.ToBase64String(hashedPassword);

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET cpf = @cpf, senha = @senha WHERE id = @id", con);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@senha", senhaHash);
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

        public static int ConsultarCredito(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            int credito = 0;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT credito FROM parceiro WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", id);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        credito = (int)leitor["credito"];
                    }
                }

                con.Close();
                return credito;
            }
            catch
            {
                return credito;
            }
        }

        public bool AtualizarCredito()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT credito FROM parceiro WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", Id);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Credito = (int)leitor["credito"];
                    }
                }

                con.Close();
                return true;
            }
            catch
            {
                return false;
            }
        }

        private bool AdicionarCredito(int valor)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Credito += valor;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET credito = @credito WHERE cpf = @cpf", con);
                query.Parameters.AddWithValue("@credito", Credito);
                query.Parameters.AddWithValue("@cpf", Cpf);

                query.ExecuteNonQuery();
                con.Close();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool SacarCredito(int id, int valor)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET credito = credito - @valor WHERE id = @id", con);
                query.Parameters.AddWithValue("@valor", valor);
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

        public static ParceiroDTO VerificarNovoParceiro(string telefone)
        {
            bool? resposta;
            int? id = null;
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT cpf, id FROM parceiro WHERE telefone = @telefone", con);
                query.Parameters.AddWithValue("@telefone", telefone);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    string? cpf = null;

                    while (leitor.Read())
                    {
                        cpf = leitor["cpf"].ToString();
                        id = (int)leitor["id"];
                    }

                    if (cpf == "")
                    {
                        resposta = true;
                    }
                    else
                    {
                        resposta = false;
                    }
                }
                else
                {
                    resposta = null;
                }

                con.Close();
            }
            catch
            {
                resposta = null;
            }

            ParceiroDTO dto = new ParceiroDTO
            {
                NovoParceiro = resposta,
                Id = id
            };

            return dto;
        }

        public static Parceiro Autenticar(string cpf, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Parceiro parceiro = null;

            var sha = SHA256.Create();
            var asByteArray = Encoding.Default.GetBytes(senha);
            var hashedPassword = sha.ComputeHash(asByteArray);
            string senhaHash = Convert.ToBase64String(hashedPassword);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT * FROM parceiro WHERE cpf = @cpf AND login = true", con);
                query.Parameters.AddWithValue("@cpf", cpf);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        string senhaBanco = leitor["senha"].ToString();

                        if (senhaHash == senhaBanco)
                        {
                            parceiro = new Parceiro(
                                (int)leitor["id"],
                                leitor["nome"].ToString(),
                                leitor["telefone"].ToString(),
                                leitor["cpf"].ToString(),
                                (int)leitor["credito"],
                                (bool)leitor["fechou"]
                                );
                        }
                        else
                        {
                            parceiro = null;
                        }
                    }
                }
                con.Close();
            }
            catch
            {
                parceiro = null;
            }
            return parceiro;
        }

        public Parceiro EditarParceiro(Parceiro parceiroNovo)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            Parceiro parceiro = null;

            try
            {
                con.Open();

                if (Nome != parceiroNovo.Nome && parceiroNovo.Nome != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE parceiro SET nome = @nome WHERE id = @id", con);
                    query.Parameters.AddWithValue("@nome", parceiroNovo.Nome);
                    query.Parameters.AddWithValue("@id", Id);
                    query.ExecuteNonQuery();
                }

                if (Telefone != parceiroNovo.Telefone && parceiroNovo.Telefone != "")
                {
                    MySqlCommand query = new MySqlCommand("UPDATE parceiro SET telefone = @telefone WHERE id = @id", con);
                    query.Parameters.AddWithValue("@telefone", parceiroNovo.Telefone);
                    query.Parameters.AddWithValue("@id", Id);
                    query.ExecuteNonQuery();
                }

                if (parceiroNovo.Senha != "")
                {
                    var sha = SHA256.Create();
                    var asByteArray = Encoding.Default.GetBytes(parceiroNovo.Senha);
                    var hashedPassword = sha.ComputeHash(asByteArray);
                    string senhaHash = Convert.ToBase64String(hashedPassword);

                    MySqlCommand query = new MySqlCommand("UPDATE parceiro SET senha = @senha WHERE id = @id", con);
                    query.Parameters.AddWithValue("@senha", senhaHash);
                    query.Parameters.AddWithValue("@id", Id);
                    query.ExecuteNonQuery();
                }

                MySqlCommand queryBusca = new MySqlCommand("SELECT * FROM parceiro WHERE id = @id", con);
                queryBusca.Parameters.AddWithValue("@id", Id);

                MySqlDataReader leitor = queryBusca.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        parceiro = new Parceiro(
                                (int)leitor["id"],
                                leitor["nome"].ToString(),
                                leitor["telefone"].ToString(),
                                leitor["cpf"].ToString(),
                                (int)leitor["credito"],
                                (bool)leitor["fechou"]
                                );
                    }
                }

                con.Close();
                return parceiro;
            }
            catch
            {
                return null;
            }
        }

        public bool DesativarParceiro()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET nome = '[USUÁRIO DESCONHECIDO]', credito = 0, senha = null, login = false WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", Id);

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

    public class ParceiroDTO
    {
        public bool? NovoParceiro { get; set; }
        public int? Id { get; set; }
    }
}
