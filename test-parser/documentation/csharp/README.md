```csharp

// Necessary using directives
using System.Collections.Generic;
using System.Net.Http;

/// <summary>
/// Create a new Record Set in "results" table.
/// </summary>
/// <remarks>
/// Typically called in the [AssemblyInitialize] method.
/// </remarks>
/// <param name="username">The TestParser username (not email address).</param>
/// <param name="unixTimeStamp">The unixtimestamp for the Record Set (primary key).</param>
/// <returns>The Http Response Message.</returns>
public static HttpResponseMessage NewRecordSet(string username, long unixTimeStamp)
{
	string requestUri = "https://testparser.com/api/results";
	HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
	httpRequestMessage.Content = new FormUrlEncodedContent( new[] {
		new KeyValuePair<string, string>("unixtimestamp", unixTimeStamp.ToString())
	});
	httpRequestMessage.Headers.Add("username", username);
	return new HttpClient().SendAsync(httpRequestMessage).Result;
}

// DynamoDB Object (same for "live" and "results" tables
Dictionary<string, string> results = new Dictionary<string, string>
{
	{ "configuration", configuration },
	{ "computerName", computerName },
	{ "description", description },
	{ "duration", durationString },
	{ "endTime", endTimeString },
	{ "message", failureMessage },
	{ "outcome", outcome },
	{ "startTime", startTimeString },
	{ "test", test }, // Primary Key
	{ "testClass", testClass },
	{ "testName", testName }
};

/// <summary>
/// Add (or replace existing) result in "live" table.
/// </summary>
/// <remarks>
/// Typically called in the [TestCleanup()] method.
/// </remarks>
/// <param name="username">The TestParser username (not email address).</param>
/// <param name="results">The results to add/update.</param>
/// <returns>The Http Response Message.</returns>
public static HttpResponseMessage UpdateLiveTable(string username, Dictionary<string, string> results)
{
	string requestUri = "https://testparser.com/api/live";
	HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
	httpRequestMessage.Content = new FormUrlEncodedContent(results);
	httpRequestMessage.Headers.Add("username", username);
	return new HttpClient().SendAsync(httpRequestMessage).Result;
}

/// <summary>
/// Add the result property to the record set where the unixtimestamp (primary key) matches the given value in the "reults" table.
/// </summary>
/// Typically called in the [TestCleanup()] method.
/// </remarks>
/// <param name="username">The TestParser username (not email address).</param>
/// <param name="unixTimeStamp">The unixtimestamp for the Record Set (primary key).</param>
/// <param name="results">The results to add/update.</param>
/// <returns>The Http Response Message.</returns>
public static HttpResponseMessage UpdateResultsTable(string username, long unixTimeStamp, Dictionary<string, string> results)
{
	string requestUri = "https://testparser.com/api/results/" + unixTimeStamp;
	HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Put, requestUri);
	httpRequestMessage.Content = new FormUrlEncodedContent(results);
	httpRequestMessage.Headers.Add("username", username);
	return new HttpClient().SendAsync(httpRequestMessage).Result;
}

```