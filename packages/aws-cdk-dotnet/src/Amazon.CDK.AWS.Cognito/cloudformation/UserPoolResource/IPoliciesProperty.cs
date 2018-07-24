using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html </remarks>
    [JsiiInterface(typeof(IPoliciesProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.PoliciesProperty")]
    public interface IPoliciesProperty
    {
        /// <summary>``UserPoolResource.PoliciesProperty.PasswordPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-policies.html#cfn-cognito-userpool-policies-passwordpolicy </remarks>
        [JsiiProperty("passwordPolicy", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.PasswordPolicyProperty\"}]},\"optional\":true}")]
        object PasswordPolicy
        {
            get;
            set;
        }
    }
}