import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import assets = require('@aws-cdk/assets');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codebuild = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'can use filename as buildspec'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      buildSpec: 'hello.yml',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: 'hello.yml'
      }
    }));

    test.done();
  },

  'can use buildspec literal'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.CodePipelineSource(),
      buildSpec: { phases: ['say hi'] }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Source: {
        BuildSpec: "{\n  \"phases\": [\n    \"say hi\"\n  ]\n}",
      }
    }));

    test.done();
  },

  'github auth test'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.GitHubSource({
        cloneUrl: "https://github.com/testowner/testrepo",
        oauthToken: new cdk.Secret("test_oauth_token")
      })
    });

    // THEN
    expect(stack).to(haveResource('AWS::CodeBuild::Project', {
      Source: {
        Type: "GITHUB",
        Auth: {
          Type: 'OAUTH',
          Resource: 'test_oauth_token'
        },
        Location: 'https://github.com/testowner/testrepo'
      }
    }));

    test.done();
  },

  'github enterprise auth test'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      source: new codebuild.GitHubEnterpriseSource({
        cloneUrl: "https://github.testcompany.com/testowner/testrepo",
        oauthToken: new cdk.Secret("test_oauth_token")
      })
    });

    // THEN
    expect(stack).to(haveResource('AWS::CodeBuild::Project', {
      Source: {
        Type: "GITHUB_ENTERPRISE",
        Auth: {
          Type: 'OAUTH',
          Resource: 'test_oauth_token'
        },
        Location: 'https://github.testcompany.com/testowner/testrepo'
      }
    }));

    test.done();
  },

  'construct from asset'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new codebuild.Project(stack, 'Project', {
      buildScriptAsset: new assets.ZipDirectoryAsset(stack, 'Asset', { path: '.' }),
      buildScriptAssetEntrypoint: 'hello.sh',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::CodeBuild::Project', {
      Environment: {
        ComputeType: "BUILD_GENERAL1_SMALL",
        EnvironmentVariables: [
          {
            Name: "SCRIPT_S3_BUCKET",
            Type: "PLAINTEXT",
            Value: { Ref: "AssetS3Bucket235698C0" }
          },
          {
            Name: "SCRIPT_S3_KEY",
            Type: "PLAINTEXT",
            Value: {
              "Fn::Join": ["", [
                { "Fn::Select": [0, { "Fn::Split": ["||", { Ref: "AssetS3VersionKeyA852DDAE" }] }] },
                { "Fn::Select": [1, { "Fn::Split": ["||", { Ref: "AssetS3VersionKeyA852DDAE" }] }] }
              ]]
            }
          }
        ],
      },
      Source: {
        // Not testing BuildSpec, it's too big and finicky
        Type: "NO_SOURCE"
      }
    }));

    test.done();
  },
};
