﻿using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Ocsp;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace IndicaLMR.Classes
{
    public class Parceiro
    {
        private string nome, telefone, cpf, senha;
        private string? indicadoPor;
        private int id, credito, tipo;
        private int? idParceiro;
        private bool fechou, repassado, foiIndicado;

        public int Id { get { return id; } set {  id = value; } }
        public int? IdParceiro { get { return idParceiro; } set { idParceiro = value; } }
        public string Nome { get { return nome; } set {  nome = value.ToUpper(); } }
        public string Telefone { get { return telefone; } set { telefone = value; } }
        public string Cpf { get { return cpf; } set { cpf = value; } }
        public string Senha { get { return senha; } set { senha = value; } }
        public string? IndicadoPor { get { return indicadoPor; } set { indicadoPor = value; } }
        public int Credito { get { return credito; } set { credito = value; } }
        public int Tipo { get { return tipo; } set { tipo = value; } }
        public bool Fechou { get { return fechou; } set { fechou = value; } }
        public bool Repassado { get { return repassado; } set { repassado = value; } }
        public bool FoiIndicado { get { return foiIndicado; } set { foiIndicado = value; } }

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
        public Parceiro(int id, string nome, string telefone, string cpf, int credito, bool fechou, int tipo, bool repassado, string? indicadoPor, int? idParceiro)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Credito = credito;
            Fechou = fechou;
            Tipo = tipo;
            Repassado = repassado;
            IndicadoPor = indicadoPor;
            IdParceiro = idParceiro;
        }
        public Parceiro(string nome, string telefone, string senha)
        {
            Nome = nome;
            Telefone = telefone;
            Senha = senha;
        }
        public Parceiro(int id, string nome, string telefone, string cpf, int tipo)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Tipo = tipo;
        }
        private Parceiro(int id, string nome, string telefone, string cpf, bool fechou, int tipo, bool foiIndicado)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Fechou = fechou;
            Tipo = tipo;
            FoiIndicado = foiIndicado;
        }
        public Parceiro(string nome, string telefone, string cpf, int tipo, string senha)
        {
            Id = 0;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Tipo = tipo;
            Senha = senha;
            Credito = 0;
            Fechou = false;
        }

        private Parceiro(int id, string nome, string telefone, string cpf, int credito, bool fechou, int tipo)
        {
            Id = id;
            Nome = nome;
            Telefone = telefone;
            Cpf = cpf;
            Credito = credito;
            Fechou = fechou;
            Tipo = tipo;
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

                MySqlCommand query = new MySqlCommand("INSERT INTO parceiro VALUES(@id, @nome, @telefone, @cpf, @credito, @fechou, @senha, @login, @tipo, @repassado)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@telefone", Telefone);
                query.Parameters.AddWithValue("@cpf", Cpf);
                query.Parameters.AddWithValue("@credito", Credito);
                query.Parameters.AddWithValue("@fechou", Fechou);
                query.Parameters.AddWithValue("@senha", senhaHash);
                query.Parameters.AddWithValue("@login", true);
                query.Parameters.AddWithValue("@tipo", Tipo);
                query.Parameters.AddWithValue("@repassado", false);

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

                MySqlCommand query = new MySqlCommand("INSERT INTO parceiro VALUES(@id, @nome, @telefone, @cpf, @credito, @fechou, @senha, @login, @tipo, @repassado)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", Nome);
                query.Parameters.AddWithValue("@telefone", Telefone);
                query.Parameters.AddWithValue("@cpf", null);
                query.Parameters.AddWithValue("@credito", Credito);
                query.Parameters.AddWithValue("@fechou", Fechou);
                query.Parameters.AddWithValue("@senha", null);
                query.Parameters.AddWithValue("@login", true);
                query.Parameters.AddWithValue("@tipo", 0);
                query.Parameters.AddWithValue("@repassado", false);

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

        public static bool VerificarParceiro(string cpf)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            int? id = null;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT id FROM parceiro WHERE cpf = @cpf", con);
                query.Parameters.AddWithValue("@cpf", cpf);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        id = (int)leitor["id"];
                    }
                }

                con.Close();

                if (id != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
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
                            (bool)leitor["fechou"],
                            (int)leitor["tipo"]
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

                MySqlCommand query = new MySqlCommand("SELECT parceiro.id, nome, cpf, credito, telefone, fechou, parceiro.tipo, repassado, (SELECT nome FROM parceiro WHERE parceiro.id = i.parceiro) AS indicado_por, i.parceiro FROM parceiro LEFT JOIN indicacao as i on i.indicado = parceiro.id WHERE parceiro.id = @id", con);
                query.Parameters.AddWithValue("@id", id);

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
                            (bool)leitor["fechou"],
                            (int)leitor["tipo"],
                            (bool)leitor["repassado"],
                            leitor["indicado_por"].ToString(),
                            Convert.IsDBNull(leitor["parceiro"]) ? null : (int?)leitor["parceiro"]
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

        public static int ContarIndicacoes(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            int quantidade = 0;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT COUNT(id) FROM indicacao WHERE parceiro = @id", con);
                query.Parameters.AddWithValue("@id", id);

                quantidade = Convert.ToInt32(query.ExecuteScalar());

                con.Close();
            }
            catch
            {
                quantidade = 0;
            }
            return quantidade;
        }

        public static int ContarIndicacoesFechadas(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            int quantidade = 0;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT COUNT(indicacao.id) FROM indicacao INNER JOIN parceiro AS p on p.id = indicado WHERE parceiro = @id AND p.fechou = true", con);
                query.Parameters.AddWithValue("@id", id);

                quantidade = Convert.ToInt32(query.ExecuteScalar());

                con.Close();
            }
            catch
            {
                quantidade = 0;
            }
            return quantidade;
        }

        public static ParceirosDTO ListarParceiros(string nome, string cpf, int? tipo, int? indicado, int? fechou, int pagina, int tamanhoPagina)
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
                    if (filtro != "")
                    {
                        filtro += " AND cpf = @cpf";
                    }
                    else
                    {
                        filtro += "WHERE cpf = @cpf";
                    }
                }

                if (tipo != null)
                {
                    if (filtro != "")
                    {
                        filtro += " AND tipo = @tipo";
                    }
                    else
                    {
                        filtro += "WHERE tipo = @tipo";
                    }
                }

                if (indicado != null && indicado == 1)
                {
                    if (filtro != "")
                    {
                        filtro += " AND (SELECT id FROM indicacao WHERE indicado = parceiro.id)";
                    }
                    else
                    {
                        filtro += "WHERE (SELECT id FROM indicacao WHERE indicado = parceiro.id)";
                    }
                }

                if (fechou != null)
                {
                    if (filtro != "")
                    {
                        filtro += " AND fechou = @fechou";
                    }
                    else
                    {
                        filtro += "WHERE fechou = @fechou";
                    }
                }

                MySqlCommand query = new MySqlCommand(string.Format("SELECT id, nome, telefone, cpf, tipo, fechou, (CASE WHEN(SELECT id FROM indicacao WHERE indicado = parceiro.id LIMIT 1) IS NOT NULL THEN true ELSE false END) AS foi_indicado FROM parceiro {0} LIMIT @tamanhoPagina OFFSET @offset", filtro), con);
                query.Parameters.AddWithValue("@nome", nome);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@tipo", tipo);
                query.Parameters.AddWithValue("@fechou", fechou);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina + 1);
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
                            leitor["cpf"].ToString(),
                            (bool)leitor["fechou"],
                            (int)leitor["tipo"],
                            Convert.ToBoolean(leitor["foi_indicado"])
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

            bool temMais = tamanhoPagina < parceiros.Count ? true : false;
            if (parceiros.Count > tamanhoPagina) { parceiros.RemoveAt(parceiros.Count - 1); };

            ParceirosDTO parceirosDTO = new ParceirosDTO
            {
                Parceiros = parceiros,
                TemMais = temMais
            };

            return parceirosDTO;
        }

        public static ParceirosDTO ListarIndicacoes(int parceiro, int pagina, int tamanhoPagina)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Parceiro> indicacoes = new List<Parceiro>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT indicado FROM indicacao WHERE parceiro = @parceiro LIMIT @tamanhoPagina OFFSET @offset", con);
                query.Parameters.AddWithValue("@parceiro", parceiro);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina + 1);
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

            bool temMais = tamanhoPagina < indicacoes.Count ? true : false;
            if (indicacoes.Count > tamanhoPagina) { indicacoes.RemoveAt(indicacoes.Count - 1); };

            ParceirosDTO parceirosDTO = new ParceirosDTO
            {
                Parceiros = indicacoes,
                TemMais = temMais
            };

            return parceirosDTO;
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
                    query.CommandText = "UPDATE parceiro p INNER JOIN indicacao i ON p.id = i.parceiro SET p.credito = p.credito + (SELECT valor FROM configuracao WHERE chave = 'valorInd') WHERE i.indicado = @id AND p.tipo = 0";
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
                int id = (int)query.ExecuteScalar();

                con.Close();
                return MudarStatus(id);
            }
            catch
            {
                return false;
            }
        }

        public static bool MudarStatusRepasse(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET repassado = NOT repassado WHERE id = @id", con);
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

        public static bool AtualizarDados(string telefone, string cpf, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                var sha = SHA256.Create();
                var asByteArray = Encoding.Default.GetBytes(senha);
                var hashedPassword = sha.ComputeHash(asByteArray);
                string senhaHash = Convert.ToBase64String(hashedPassword);

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET cpf = @cpf, senha = @senha WHERE telefone = @telefone", con);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@senha", senhaHash);
                query.Parameters.AddWithValue("@telefone", telefone);

                query.ExecuteNonQuery();

                con.Close();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool AtualizarSenha(int id, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                var sha = SHA256.Create();
                var asByteArray = Encoding.Default.GetBytes(senha);
                var hashedPassword = sha.ComputeHash(asByteArray);
                string senhaHash = Convert.ToBase64String(hashedPassword);

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET senha = @senha WHERE id = @id", con);
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

        public static bool RecuperarSenha(string cpf, string telefone, string senha)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                var sha = SHA256.Create();
                var asByteArray = Encoding.Default.GetBytes(senha);
                var hashedPassword = sha.ComputeHash(asByteArray);
                string senhaHash = Convert.ToBase64String(hashedPassword);

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET senha = @senha WHERE cpf = @cpf AND telefone = @telefone", con);
                query.Parameters.AddWithValue("@senha", senhaHash);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@telefone", telefone);

                int linhas = query.ExecuteNonQuery();

                con.Close();

                return linhas > 0 ? true : false;
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

        public static bool? VerificarNovoParceiro(string telefone)
        {
            bool? resposta;
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT cpf FROM parceiro WHERE telefone = @telefone", con);
                query.Parameters.AddWithValue("@telefone", telefone);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    string? cpf = null;

                    while (leitor.Read())
                    {
                        cpf = leitor["cpf"].ToString();
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

            return resposta;
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
                                (bool)leitor["fechou"],
                                (int)leitor["tipo"]
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
                                (bool)leitor["fechou"],
                                (int)leitor["tipo"]
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

        public static ParceiroDTO VerificarCadastroAlterarSenha(string cpf, string telefone)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            bool status = false; ;
            string? telefoneBanco = null;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT id, telefone FROM parceiro WHERE cpf = @cpf", con);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@telefone", telefone);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        string celular = leitor["telefone"].ToString();

                        if (celular == telefone)
                        {
                            status = true;
                            telefoneBanco = celular;
                        }
                        else
                        {
                            status = false;
                            telefoneBanco = "*********" + celular.Substring(celular.Length - 2);
                        }
                    }
                }

                con.Close();
            }
            catch
            {
                status = false;
            }

            ParceiroDTO dto = new ParceiroDTO
            {
                Status = status,
                Telefone = telefoneBanco
            };

            return dto;
        }

        public bool DesativarParceiro()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE parceiro SET nome = @nome, credito = @credito, senha = @senha, login = @login WHERE id = @id", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@nome", "[USUÁRIO DESCONHECIDO]");
                query.Parameters.AddWithValue("@credito", 0);
                query.Parameters.AddWithValue("@senha", null);
                query.Parameters.AddWithValue("@login", false);

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

    public class ParceiroDTO()
    {
        public bool? Status { get; set; }
        public string Telefone { get; set; }
    }

    public class ParceirosDTO
    {
        public List<Parceiro> Parceiros { get; set; }
        public bool TemMais { get; set; }
    }
}
