/**
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const rp = require('request-promise');

// Helper function that calculates the priority of the issue
function calculateIssuePriority(eventType) {
  // Run custom logic that can determine the priority or severity of this issue
  // For example, you can parse the stack trace to determine which part of your app
  // is causing the crash and assign priorities based on that

  // See https://help.xmatters.com/ondemand/xmodwelcome/communicationplanbuilder/appendixrestapi.htm#POSTtrigger

  // For the demonstration of this sample, let's assign a priority based on the event type
  if (eventType === 'velocityAlert') {
    // high impacting, return highest priority
    return 'High';
  } else if (eventType === 'regressed') {
    // regressed issue, return medium priority
    return 'Medium';
  } else {
    // new issues - return low priority
    return 'Low';
  }
}

// Helper function that signal to xMatters
function triggerXmattersInbound(issue, issueType) {
  const inbound_trigger_url = functions.config().xmatters.inbound_trigger_url;
  const user = functions.config().xmatters.api_key;
  const pass = functions.config().xmatters.secret;

  const issueId = issue.issueId;
  const issueTitle = issue.issueTitle;
  const appName = issue.appInfo.appName;
  const appId = issue.appInfo.appId;
  const appPlatform = issue.appInfo.appPlatform;
  const latestAppVersion = issue.appInfo.latestAppVersion;
  const crashPercentage = (issue.velocityAlert) ? issue.velocityAlert.crashPercentage : "";

  // See https://help.xmatters.com/ondemand/xmodwelcome/integrationbuilder/create-inbound-updates.htm
  // to customize the signal to xMatters
  const newSignal = {
    properties: {
      issueId,
      issueType,
      issueTitle,
      appName,
      appId,
      appPlatform,
      latestAppVersion,
      crashPercentage
    },
    priority: calculateIssuePriority(issueType)
  };

  // Uses xMatters API
  // Doc: https://help.xmatters.com/ondemand/xmodwelcome/integrationbuilder/create-inbound-updates.htm#Authentication
  // Request (Promise) Doc: https://github.com/request/request#http-authentication
  return rp({
    auth: {
      'user': user,
      'pass': pass,
    },
    method: 'POST',
    uri: inbound_trigger_url,
    body: newSignal,
    json: true,
  });
}

exports.signalNewIssue = functions.crashlytics.issue().onNew(async (issue) => {
  await triggerXmattersInbound(issue, 'new');
  console.log(`Created issue in xMatters successfully`);
});

exports.signalRegressedIssue = functions.crashlytics.issue().onRegressed(async (issue) => {
  await triggerXmattersInbound(issue, 'regressed');
  console.log(`Created issue in xMatters successfully`);
});

exports.signalVelocityAlert = functions.crashlytics.issue().onVelocityAlert(async (issue) => {
  await triggerXmattersInbound(issue, 'velocityAlert');
  console.log(`Created issue in xMatters successfully`);
});
