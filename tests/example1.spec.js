//require('dotenv').config({ path: '/Users/mohammed/myJasmineFramework/sample.env' })
//const CONFIG = require('./config.json')
selenium = require('selenium-webdriver');
jasmine.getEnv().defaultTimeoutInterval = 60000; // in microseconds.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const username = "mohammedk1"//process.env.BROWSERSTACK_USER;
const accessKey = "spBCpUJaVTnvxxssFtEJ"//process.env.BROWSERSTACK_ACCESSKEY;
const remoteHubUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

describe('Sample Test 1', function () {

    beforeEach(function (done) {

        const caps = {
            'os_version': process.env.OS_VERSION,
            'browserName': process.env.BROWSERNAME,
            'browser_version': process.env.BROWSER_VERSON,
            'os': process.env.OS,
            'name': process.env.NAME, // test name
            'build': process.env.BUILD // CI/CD job or build name
        }
        // const caps = {
        //     'os_version': 10,
        //     'browserName': "Chrome",
        //     'browser_version': 88,
        //     'os': 'Windows',
        //     'name': "Sample Test", // test name
        //     'build': "Sample Build" // CI/CD job or build name
        // }
        console.log("Test spec1 initiated with URL :: "+ remoteHubUrl + " CAPS :: " + JSON.stringify(caps));

        this.driver = new selenium.Builder().
            usingServer(remoteHubUrl).
            withCapabilities(caps).
            build();

        this.driver.get('http://crossbrowsertesting.github.io/login-form.html').then(done);
    });

    // Close the website after each test is run (so that it is opened fresh each time)
    afterEach(function (done) {
        this.driver.quit().then(done);
    });

    it('Test 1', function (done) {
        try {
            this.driver.findElement(selenium.By.id("username")).sendKeys("tester@crossbrowsertesting.com");
            this.driver.findElement(selenium.By.xpath("//*[@type=\"password\"]")).sendKeys("test123");
            this.driver.findElement(selenium.By.css("button[type=submit]")).click();
            var element = this.driver.wait(selenium.until.elementLocated(selenium.By.id("logged-in-message")), 10000);

            element.getAttribute('id').then(function (id) {
                expect(id).toBe('logged-in-message');
                console.log("The test was successful");
                done();
            });
            // this.driver.executeScript(
            //     'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains BrowserStack!"}}'
            // );
        } catch (error) {
            // this.driver.executeScript(
            //     'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
            // );
        }
    });

});
