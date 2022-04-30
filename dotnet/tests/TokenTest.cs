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
    public class TokenTest
    {
        private ITokenService _testTokenService;
        private string _testKey;
        private string _testIssuer;
        private AuthenticationRequest _testAuthRequest;

        public TokenTest()
        {
            _testTokenService = new TokenService();
            _testKey = "this_is_my_custom_Secret_key_for_authnetication";
            _testIssuer = "TEST_ISSUER";

            var user = RandomDataGenerator.RandomUser();
            _testAuthRequest = new AuthenticationRequest()
            {
                Email = user.Email,
                Password = user.Password
            };
        }

        [Fact]
        public void TestBuildToken()
        {
            var serviceCall =  _testTokenService.BuildToken(_testKey, _testIssuer, _testAuthRequest);

            Assert.True(serviceCall.IsSuccessful);
            Assert.NotNull(serviceCall.Data);
            Assert.IsType<string>(serviceCall.Data);
        }

        [Fact]
        public async void TestIsTokenValid()
        {
            var correctToken = _testTokenService.BuildToken(_testKey, _testIssuer, _testAuthRequest).Data ?? "";
            var incorrectToken = "wrong_token";

            var correctServiceCall = _testTokenService.IsTokenValid(_testKey, _testIssuer, correctToken);
            var incorrectServiceCall = _testTokenService.IsTokenValid(_testKey, _testIssuer, incorrectToken);

            Assert.True(correctServiceCall.Data);
            Assert.False(incorrectServiceCall.Data);
        }
    }
}