using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Backend.Entities;
using Backend.Helpers;
using Backend.Helpers.dal;

namespace Backend.Services
{
    public interface IUserService
    {
        User Authenticate(string username, string password);
        User SignUp(string username, string password);
        IEnumerable<User> GetAll();
    }

    public class UserService : IUserService
    {
        private List<User> _users = Dal.Instace.GetAllUsers();
        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public User Authenticate(string username, string password)
        {
            var user = _users.SingleOrDefault(x => x.Username == username && x.Password == password);

            // return null if user not found
            if (user == null)
                return null;

            // authentication successful so generate jwt token
            string newToken = HandleNewToken(user.Id);
            user.Token = newToken;

            return user;
        }
        
        public User SignUp(string username, string password)
        {
            var user = _users.SingleOrDefault(x => x.Username == username);

            if (user != null) // user already exist
                return null;

            User newUser = Dal.Instace.AddUser(username, password);

            string newToken = HandleNewToken(newUser.Id);
            newUser.Token = newToken;

            return newUser;
        }
        public IEnumerable<User> GetAll()
        {
            return _users;
        }

        private string HandleNewToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userId.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
