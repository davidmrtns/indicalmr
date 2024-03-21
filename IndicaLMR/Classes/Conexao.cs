namespace IndicaLMR.Classes
{
    public class Conexao
    {
        private static readonly string codConexao = Environment.GetEnvironmentVariable("CONNECTION_STRING", EnvironmentVariableTarget.User);
        public static string CodConexao { get { return codConexao; } }
    }
}
