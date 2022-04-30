using Xunit;
using NSubstitute;
using MongoDB.Driver;
using core.Models.Data;
using core.Services;
using System.Collections.Generic;
using System.Linq;
using core.Repositories;
using System;
using System.Linq.Expressions;
using MongoDB.Driver.Linq;
using MongoDB.Bson;
using core.Utils;
using core.Models.Request;

namespace tests
{
    public class UsersTest
    {
        private readonly IUsersRepository _mockUsersRepository;
        private readonly IUserService _testUsersService;
        private readonly Dictionary<string, User> _store;

        public UsersTest()
        {
            _mockUsersRepository = Substitute.For<IUsersRepository>();
            _testUsersService = new UserService(_mockUsersRepository);
            _store = new Dictionary<string, User>();

            _mockUsersRepository.GetUser(default)
                .ReturnsForAnyArgs(args => {
                    var expression = (Expression<Func<User, bool>>)args[0];
                    var user = _store.Values
                        .AsQueryable()
                        .Where(expression)
                        .FirstOrDefault();

                    return user;    
                });
            
            _mockUsersRepository.GetUserByEmail(default)
                .ReturnsForAnyArgs(args => _store
                    .Where(u => u.Value.Email == (string)args[0])
                    .FirstOrDefault()
                    .Value);
            
            _mockUsersRepository.AddUser(default)
                .ReturnsForAnyArgs(args => {
                    var user = (User)args[0];
                    user.Id = ObjectId.GenerateNewId().ToString();
                    _store.Add(user.Email, user);

                    return user;
                });

            for (int i=0; i<10; ++i)
            {
                var randomUser = RandomDataGenerator.RandomUser();
                _store.Add(randomUser.Email, randomUser);
            }
        }

        [Fact]
        public async void TestGetUser()
        {
            var user = _store.FirstOrDefault().Value;
            
            var correctAuthenticationRequest = new AuthenticationRequest()
            {
                Email = user.Email,
                Password = user.Password
            };

            var incorrectAuthenticationRequest = new AuthenticationRequest()
            {
                Email = user.Email,
                Password = "wrong password"
            };

            var correctServiceCall = await _testUsersService.AuthenticateUser(correctAuthenticationRequest);
            var incorrectServiceCall = await _testUsersService.AuthenticateUser(incorrectAuthenticationRequest);

            Assert.True(correctServiceCall.IsSuccessful);
            Assert.False(incorrectServiceCall.IsSuccessful);
            Assert.Equal(user.Email, correctServiceCall.Data?.Email);
        }

        [Fact]    
        public async void TestGetUserByEmail()
        {
            var user = _store.FirstOrDefault().Value;

            var correctServiceCall = await _testUsersService.GetUserByEmail(user.Email);
            var incorrectServiceCall = await _testUsersService.GetUserByEmail("wrong email");

            Assert.True(correctServiceCall.IsSuccessful);
            Assert.False(incorrectServiceCall.IsSuccessful);
            Assert.Equal(user.Id, correctServiceCall.Data?.Id);
        }

        [Fact]
        public async void TestAddUser()
        {
            var newUser = RandomDataGenerator.RandomUser();
            var signupRequest = new SignupRequest()
            {
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                Password = newUser.Password
            };

            if (_store.ContainsKey(signupRequest.Email))
            {
                var serviceCall = await _testUsersService.SignupUser(signupRequest);
                Assert.False(serviceCall.IsSuccessful);
            }
            else
            {
                var serviceCall = await _testUsersService.SignupUser(signupRequest);
                Assert.True(serviceCall.IsSuccessful);
                Assert.Equal(signupRequest.Email, serviceCall.Data?.Email);
            }
        }
    }
}