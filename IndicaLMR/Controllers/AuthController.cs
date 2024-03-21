using IndicaLMR.Classes;
using IndicaLMR.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace IndicaLMR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        [HttpPost("autenticar")]
        public IActionResult Autenticar([FromBody] ParceiroModel parceiroModel)
        {
            Parceiro parceiro = Parceiro.Autenticar(parceiroModel.cpf, parceiroModel.senha);

            if (parceiro != null)
            {
                string token = Token.CriarTokenParceiro(parceiro.Id, parceiro.Nome, parceiro.Cpf, parceiro.Telefone);

                HttpContext.Session.SetString("_LoggedUser", JsonSerializer.Serialize(parceiro));
                Response.Cookies.Append("Authorization", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict
                });
                return Ok(true);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("novo-parceiro/{telefone}")]
        public IActionResult VerificarNovoParceiro(string telefone)
        {
            ParceiroDTO dto = Parceiro.VerificarNovoParceiro(telefone);

            if (dto.NovoParceiro != null)
            {
                return Ok(dto);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpPost("atualizar-dados")]
        public IActionResult AtualizarDados([FromBody] ParceiroModel parceiroModel)
        {
            try
            {
                //validar cpf e senha antes de permitir atualizar os dados
                bool resposta = Parceiro.AtualizarDados((int)parceiroModel.id!, parceiroModel.cpf, parceiroModel.senha);
                return Ok(resposta);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpGet("validar")]
        public bool Validar()
        {
            Parceiro parceiro;

            try
            {
                parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser"))!;
            }
            catch
            {
                parceiro = null;
            }

            if (parceiro != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [Authorize]
        [HttpGet("usuario")]
        public string BuscarUsuario()
        {
            string usuario = null;

            try
            {
                usuario = HttpContext.Session.GetString("_LoggedUser")!;
            }
            catch
            {
                usuario = null;
            }

            return usuario;
        }

        [Authorize]
        [HttpGet("atualizar")]
        public IActionResult AtualizarUsuario()
        {
            try
            {
                Parceiro parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser"))!;
                parceiro.AtualizarCredito();
                HttpContext.Session.SetString("_LoggedUser", JsonSerializer.Serialize(parceiro));
                return Ok(true);
            }
            catch
            {
                return Ok(false);
            }
        }

        [Authorize]
        [HttpGet("desconectar")]
        public bool Desconectar()
        {
            try
            {
                HttpContext.Session.Clear();
                HttpContext.Session.Remove("Authorization");
                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpPost("escritorio/autenticar")]
        public IActionResult AutenticarEscritorio([FromBody] UsuarioModel usuarioModel)
        {
            Usuario usuario = Usuario.Autenticar(usuarioModel.email, usuarioModel.senha);

            if (usuario != null)
            {
                string token = Token.CriarTokenUsuario(usuario.Id, usuario.Nome, usuario.Email, usuario.Administrador, usuario.Financeiro);

                HttpContext.Session.SetString("_LoggedOfficeUser", JsonSerializer.Serialize(usuario));
                Response.Cookies.Append("Authorization", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict
                });
                return Ok(true);
            }
            else
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpGet("escritorio/validar")]
        public bool ValidarEscritorio()
        {
            Usuario usuario;

            try
            {
                usuario = JsonSerializer.Deserialize<Usuario>(HttpContext.Session.GetString("_LoggedOfficeUser"))!;
            }
            catch
            {
                usuario = null;
            }

            if (usuario != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
