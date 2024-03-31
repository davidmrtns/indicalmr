namespace IndicaLMR.Classes
{
    public class Conexao
    {
        private static IConfiguration _configuration;

        public static string CodConexao { get { return _configuration["CONNECTION_STRING"]; } }
        public static string Issuer { get { return _configuration["ISSUER"]; } }
        public static string Audience { get { return _configuration["AUDIENCE"]; } }
        public static string SecurityKey { get { return _configuration["SECURITY_KEY"]; } }
        public static string TokenAsaas { get { return _configuration["TOKEN_ASAAS"]; } }

        static Conexao()
        {
            _configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
