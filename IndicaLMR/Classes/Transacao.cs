using MySql.Data.MySqlClient;
using System;

namespace IndicaLMR.Classes
{
    public class Transacao
    {
        private int id, idParceiro, valor, tipo;
        private int? premio;
        private bool baixa;
        private string data;
        private string? nomePremio, nomeParceiro;

        public int Id { get { return id; } set { id = value; } }
        public int IdParceiro { get { return idParceiro; } set { idParceiro = value; } }
        public int Valor { get { return valor; } set { valor = value; } }
        public int Tipo { get { return tipo; } set { tipo = value; } }
        public int? Premio { get { return premio; } set { premio = value; } }
        public bool Baixa{ get { return baixa; } set { baixa = value; } }
        public string Data{ get { return data; } set { data = value; } }
        public string? NomePremio{ get { return nomePremio; } set { nomePremio = value; } }
        public string? NomeParceiro{ get { return nomeParceiro; } set { nomeParceiro = value; } }

        public Transacao(int id, int idParceiro, int valor, int tipo, int? premio, bool baixa)
        {
            Id = id;
            IdParceiro = idParceiro;
            Valor = valor;
            Tipo = tipo;
            Baixa = baixa;
            Premio = premio;
        }

        public Transacao(int idParceiro, int valor, int tipo, string data, string? nomePremio)
        {
            IdParceiro = idParceiro;
            Valor = valor;
            Tipo = tipo;
            Data = data;
            NomePremio = nomePremio;
        }

        public Transacao(int id, int idParceiro, int valor, int tipo, string data, bool baixa, string? nomePremio)
        {
            Id = id;
            IdParceiro = idParceiro;
            Valor = valor;
            Tipo = tipo;
            Data = data;
            Baixa = baixa;
            NomePremio = nomePremio;
        }

        public Transacao(int id, int idParceiro, int valor, int tipo, string data, bool baixa, string? nomePremio, string nomeParceiro)
        {
            Id = id;
            IdParceiro = idParceiro;
            Valor = valor;
            Tipo = tipo;
            Data = data;
            Baixa = baixa;
            NomePremio = nomePremio;
            NomeParceiro = nomeParceiro;
        }

        public bool CriarTransacao(int credito)
        {
            int valorSaque = Valor;
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            if (Tipo == 2)
            {
                con.Open();
                MySqlCommand query = new MySqlCommand("SELECT valor FROM configuracao WHERE chave = 'convPontVal'", con);
                valorSaque = Valor / ((int)query.ExecuteScalar());
                con.Close();
            }

            if (credito >= valorSaque)
            {
                try
                {
                    con.Open();

                    MySqlCommand query = new MySqlCommand("INSERT INTO transacao (id, parceiro, valor, tipo, baixa, premio) VALUES(@id, @idParceiro, @valor, @tipo, @baixa, @premio)", con);
                    query.Parameters.AddWithValue("@id", Id);
                    query.Parameters.AddWithValue("@idParceiro", IdParceiro);
                    query.Parameters.AddWithValue("@valor", valorSaque);
                    query.Parameters.AddWithValue("@tipo", Tipo);
                    query.Parameters.AddWithValue("@baixa", Baixa);
                    query.Parameters.AddWithValue("@premio", Premio);

                    query.ExecuteNonQuery();

                    con.Close();

                    Parceiro.SacarCredito(IdParceiro, valorSaque);
                    return true;
                }
                catch
                {
                    return false;
                }
            }
            else
            {
                return false;
            } 
        }

        public static List<Transacao> ListarTransacoes(int parceiro, int pagina, int tamanhoPagina)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Transacao> transacoes = new List<Transacao>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT transacao.valor, tipo, data, premio.nome FROM transacao LEFT JOIN premio ON transacao.premio = premio.id WHERE parceiro = @parceiro ORDER BY data DESC LIMIT @tamanhoPagina OFFSET @offset", con);
                query.Parameters.AddWithValue("@parceiro", parceiro);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina);
                query.Parameters.AddWithValue("@offset", offset);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Transacao transacao = new Transacao(
                            parceiro,
                            (int)leitor["valor"],
                            (int)leitor["tipo"],
                            leitor["data"].ToString(),
                            leitor["nome"].ToString()
                            );

                        transacoes.Add(transacao);
                    }
                }
                else
                {
                    transacoes.Clear();
                }

                con.Close();
            }
            catch
            {
                transacoes.Clear();
            }
            return transacoes;
        }

        public static List<Transacao> ListarTransacoesFiltro(int pagina, int tamanhoPagina, int? tipo, bool? baixa, string? nome, string? cpf)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Transacao> transacoes = new List<Transacao>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                string filtro = "";

                if (nome != null)
                {
                    nome += '%';
                    filtro += "WHERE parceiro.nome LIKE @nome";
                }

                if (cpf != null)
                {
                    if (nome != null)
                    {
                        filtro += " AND parceiro.cpf = @cpf";
                    }
                    else
                    {
                        filtro += "WHERE parceiro.cpf = @cpf";
                    }
                }

                if (tipo != null)
                {
                    if (nome != null || cpf != null)
                    {
                        filtro += " AND tipo = @tipo";
                    }
                    else
                    {
                        filtro += "WHERE tipo = @tipo";
                    }
                }

                if (baixa != null)
                {
                    if (tipo != null)
                    {
                        filtro += " AND baixa = @baixa";
                    }
                    else
                    {
                        if (nome != null || cpf != null)
                        {
                            filtro += " AND baixa = @baixa";
                        }
                        else
                        {
                            filtro += "WHERE baixa = @baixa";
                        }
                    }
                }

                MySqlCommand query = new MySqlCommand(string.Format("SELECT transacao.id, parceiro, parceiro.nome AS nome_parceiro, transacao.valor, tipo, data, baixa, premio.nome FROM transacao LEFT JOIN premio ON transacao.premio = premio.id INNER JOIN parceiro ON transacao.parceiro = parceiro.id {0} ORDER BY data DESC LIMIT @tamanhoPagina OFFSET @offset", filtro), con);
                query.Parameters.AddWithValue("@baixa", baixa);
                query.Parameters.AddWithValue("@tipo", tipo);
                query.Parameters.AddWithValue("@nome", nome);
                query.Parameters.AddWithValue("@cpf", cpf);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina);
                query.Parameters.AddWithValue("@offset", offset);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Transacao transacao = new Transacao(
                            (int)leitor["id"],
                            (int)leitor["parceiro"],
                            (int)leitor["valor"],
                            (int)leitor["tipo"],
                            leitor["data"].ToString(),
                            (bool)leitor["baixa"],
                            leitor["nome"].ToString(),
                            leitor["nome_parceiro"].ToString()
                            );

                        transacoes.Add(transacao);
                    }
                }
                else
                {
                    transacoes.Clear();
                }

                con.Close();
            }
            catch
            {
                transacoes.Clear();
            }
            return transacoes;
        }

        public static List<Transacao> ListarTransacoesPorParceiro(int parceiro, int pagina, int tamanhoPagina)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);
            List<Transacao> transacoes = new List<Transacao>();
            int offset = (pagina - 1) * tamanhoPagina;

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("SELECT transacao.id, transacao.valor, tipo, data, baixa, premio.nome FROM transacao LEFT JOIN premio ON transacao.premio = premio.id WHERE parceiro = @parceiro ORDER BY data DESC LIMIT @tamanhoPagina OFFSET @offset", con);
                query.Parameters.AddWithValue("@parceiro", parceiro);
                query.Parameters.AddWithValue("@tamanhoPagina", tamanhoPagina);
                query.Parameters.AddWithValue("@offset", offset);

                MySqlDataReader leitor = query.ExecuteReader();

                if (leitor.HasRows)
                {
                    while (leitor.Read())
                    {
                        Transacao transacao = new Transacao(
                            (int)leitor["id"],
                            parceiro,
                            (int)leitor["valor"],
                            (int)leitor["tipo"],
                            leitor["data"].ToString(),
                            (bool)leitor["baixa"],
                            leitor["nome"].ToString()
                            );

                        transacoes.Add(transacao);
                    }
                }
                else
                {
                    transacoes.Clear();
                }

                con.Close();
            }
            catch
            {
                transacoes.Clear();
            }
            return transacoes;
        }

        public static bool MudarStatus(int id)
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("UPDATE transacao SET baixa = NOT baixa WHERE id = @id", con);
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
