using Xunit;
using core.Services;
using core.Utils;
using core.Models.Response;

namespace tests
{
    public class TokenTest
    {
        private ITokenService _testTokenService;
        private string _testKey;
        private string _testIssuer;
        private UserDTO _testAuthDTO;

        public TokenTest()
        {
            _testTokenService = new TokenService();
            _testKey = "this_is_my_custom_Secret_key_for_authnetication";
            _testIssuer = "TEST_ISSUER";

            var user = RandomDataGenerator.RandomUser();
            _testAuthDTO = new UserDTO()
            {
                Email = user.Email,
                FirstName = user.FirstName
            };
        }

        [Fact]
        public void TestBuildToken()
        {
            var serviceCall =  _testTokenService.BuildToken(_testKey, _testIssuer, _testAuthDTO);

            Assert.True(serviceCall.IsSuccessful);
            Assert.NotNull(serviceCall.Data);
            Assert.IsType<string>(serviceCall.Data);
        }

        [Fact]
        public async void TestIsTokenValid()
        {
            var correctToken = _testTokenService.BuildToken(_testKey, _testIssuer, _testAuthDTO).Data ?? "";
            var incorrectToken = "wrong_token";

            var correctServiceCall = _testTokenService.IsTokenValid(_testKey, _testIssuer, correctToken);
            var incorrectServiceCall = _testTokenService.IsTokenValid(_testKey, _testIssuer, incorrectToken);

            Assert.True(correctServiceCall.Data);
            Assert.False(incorrectServiceCall.Data);
        }
    }
}