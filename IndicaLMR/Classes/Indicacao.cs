using MySql.Data.MySqlClient;

namespace IndicaLMR.Classes
{
    public class Indicacao
    {
        private int id, idParceiro, idIndicado;

        public int Id { get { return id; } set { id = value; } }
        public int IdParceiro { get { return idParceiro; } set { idParceiro = value; } }
        public int IdIndicado { get { return idIndicado; } set { idIndicado = value; } }

        public Indicacao(int id, int idParceiro, int idIndicado)
        {
            Id = id;
            IdParceiro = idParceiro;
            IdIndicado = idIndicado;
        }

        public bool CriarIndicacao()
        {
            MySqlConnection con = new MySqlConnection(Conexao.CodConexao);

            try
            {
                con.Open();

                MySqlCommand query = new MySqlCommand("INSERT INTO indicacao VALUES(@id, @idParceiro, @idIndicado)", con);
                query.Parameters.AddWithValue("@id", Id);
                query.Parameters.AddWithValue("@idParceiro", IdParceiro);
                query.Parameters.AddWithValue("@idIndicado", IdIndicado);

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
